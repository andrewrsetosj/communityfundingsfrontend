"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCampaignDraft } from "../store/useCampaignDraft";
import { DraftDebug } from "@/app/create-project/component/draftDebug";

type FAQ = {
  question: string;
  answer: string;
};

export default function StoryPage() {
  const router = useRouter();
  const { draft, setStory } = useCampaignDraft();

  // ---- Prefill from draft (so back/forward keeps content) ----
  const initialDescription = draft.description_html ?? "";

  const initialFaqs: FAQ[] = useMemo(() => {
    const list = draft.faqs ?? [];
    return list
      .slice()
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((f) => ({
        question: f.question ?? "",
        answer: f.answer ?? "",
      }));
  }, [draft.faqs]);

  const persistFaqsToDraft = (nextFaqs: FAQ[]) => {
    setFaqs(nextFaqs);
    setStory({
      faqs: nextFaqs.map((f, idx) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
        display_order: idx,
      })),
    });
  };

  // Rich text editor state (stores HTML)
  const [descriptionHtml, setDescriptionHtml] = useState<string>(initialDescription);

  // FAQ state
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [faqDraft, setFaqDraft] = useState<FAQ>({ question: "", answer: "" });

  // ContentEditable ref
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Keep the editor DOM in sync if state changes externally
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    if (el.innerHTML !== descriptionHtml) {
      el.innerHTML = descriptionHtml;
    }
  }, [descriptionHtml]);

  const openFaqForm = () => {
    setFaqDraft({ question: "", answer: "" });
    setIsAddingFaq(true);
  };

  const cancelFaqForm = () => {
    setFaqDraft({ question: "", answer: "" });
    setIsAddingFaq(false);
  };

  const addFaq = () => {
    if (!faqDraft.question.trim() || !faqDraft.answer.trim()) return;

    const next = [...faqs, { ...faqDraft }];
    persistFaqsToDraft(next);

    cancelFaqForm();
  };

  const removeFaq = (idx: number) => {
    const next = faqs.filter((_, i) => i !== idx);
    persistFaqsToDraft(next);
  };

  // Rich text formatting
  const format = (command: "bold" | "italic" | "underline") => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    setDescriptionHtml(editorRef.current?.innerHTML ?? "");
  };

  const handleEditorInput = () => {
    setDescriptionHtml(editorRef.current?.innerHTML ?? "");
  };

  const clearFormatting = () => {
    editorRef.current?.focus();
    document.execCommand("removeFormat", false);
    setDescriptionHtml(editorRef.current?.innerHTML ?? "");
  };

  const isEditorVisuallyEmpty = (html: string) => {
    const text = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/\u00a0/g, " ")
      .trim();

    return text.length === 0;
  };

  const showPlaceholder = isEditorVisuallyEmpty(descriptionHtml);

  // ---- Save into draft + navigate ----
  const handleNext = () => {
    setStory({
      description_html: descriptionHtml,
      faqs: faqs.map((f, idx) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
        display_order: idx,
      })),
    });

    router.push("/create-project/people");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Tell your story
      </h1>
      <p className="text-gray-600 mb-8">
        Describe your project and the story behind it.
      </p>

      <div className="space-y-8">
        {/* Project Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Project Description
          </label>

          <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent">
            {/* Simple Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex gap-2">
              <button
                type="button"
                onClick={clearFormatting}
                className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded transition-colors"
                aria-label="Clear formatting"
                title="Clear formatting"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => format("bold")}
                className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded transition-colors font-bold text-sm"
                aria-label="Bold"
                title="Bold"
              >
                B
              </button>

              <button
                type="button"
                onClick={() => format("italic")}
                className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded transition-colors italic text-sm"
                aria-label="Italic"
                title="Italic"
              >
                I
              </button>

              <button
                type="button"
                onClick={() => format("underline")}
                className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded transition-colors underline text-sm"
                aria-label="Underline"
                title="Underline"
              >
                U
              </button>
            </div>

            {/* ContentEditable editor */}
            <div className="relative">
              {showPlaceholder && (
                <div className="pointer-events-none absolute top-4 left-4 right-4 text-gray-400 whitespace-pre-line">
                  What are you creating, who is it for, and how will funding help bring it to life?
                </div>
              )}

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleEditorInput}
                onBlur={handleEditorInput}
                className="w-full px-4 py-4 min-h-[220px] focus:outline-none"
              />
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            A compelling story is key to a successful campaign. Be authentic and specific.
          </p>
        </div>

        {/* FAQ (optional) */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">FAQ (optional)</h2>
          </div>

          {/* 1) Existing FAQs ALWAYS on top */}
          {faqs.length > 0 && (
            <div className="space-y-4 mb-6">
              {faqs.map((faq, idx) => (
                <div
                  key={`${faq.question}-${idx}`}
                  className="border border-gray-200 rounded-xl p-6 bg-white"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="font-semibold text-gray-900">{faq.question}</div>
                      <div className="text-gray-600 mt-2 whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </div>

                    {/* 2) Trash can remove button */}
                    <button
                      type="button"
                      onClick={() => removeFaq(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove FAQ"
                      title="Remove FAQ"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3) Below the list: either expanded form OR add box */}
          {isAddingFaq ? (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">New FAQ</h3>

              <div className="space-y-6">
                {/* Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={faqDraft.question}
                    onChange={(e) =>
                      setFaqDraft((prev) => ({ ...prev, question: e.target.value }))
                    }
                    placeholder="e.g., Do you have any social media accounts?"
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl bg-white
                              text-base placeholder:text-gray-400
                              focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                  />
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Answer
                  </label>
                  <textarea
                    value={faqDraft.answer}
                    onChange={(e) =>
                      setFaqDraft((prev) => ({ ...prev, answer: e.target.value }))
                    }
                    placeholder="Write a clear answer for donors..."
                    rows={5}
                    className="w-full px-6 py-4 border border-gray-300 rounded-xl bg-white
                              text-base placeholder:text-gray-400 resize-none
                              focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center gap-10 pt-2">
                  <button
                    type="button"
                    onClick={cancelFaqForm}
                    className="text-lg text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={addFaq}
                    disabled={!faqDraft.question.trim() || !faqDraft.answer.trim()}
                    className="bg-[#8BC34A] text-white px-10 py-3 rounded-full text-lg font-medium
                              hover:bg-[#7CB342] transition-colors disabled:opacity-50 disabled:hover:bg-[#8BC34A]"
                  >
                    Add FAQ
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={openFaqForm}
              className="w-full border-2 border-dashed border-[#8BC34A] rounded-xl py-10 flex flex-col items-center justify-center hover:bg-green-50/20 transition"
            >
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
                <span className="text-[#8BC34A] text-2xl leading-none">+</span>
              </div>
              <div className="text-[#8BC34A] text-lg font-medium">
                {faqs.length > 0 ? "Add another FAQ" : "Add a FAQ"}
              </div>
              <div className="text-gray-500 mt-1">Add common questions and answers.</div>
            </button>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Answering common questions helps backers feel confident supporting your project.
          </p>
        </div>

        {/* Save & Continue Button (must call handleNext) */}
        <div className="mt-12 flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            className="bg-[#8BC34A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
          >
            Save &amp; Continue
          </button>
        </div>
      </div>
      <DraftDebug />
    </div>
  );
}