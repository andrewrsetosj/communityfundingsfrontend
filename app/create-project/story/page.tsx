"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCampaignDraft, saveDraftToBackend } from "../store/useCampaignDraft";
import { DraftDebug } from "@/app/create-project/component/draftDebug";

type FAQ = {
  question: string;
  answer: string;
};

function StoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { draft, setStory } = useCampaignDraft();
  const [saving, setSaving] = useState(false);

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

  // ✅ NEW: touched flag for description editor
  const [descriptionTouched, setDescriptionTouched] = useState(false);

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

  // ✅ gate continue
  const descriptionIsValid = !isEditorVisuallyEmpty(descriptionHtml);
  const canContinue = descriptionIsValid;

  // ---- Save into draft + navigate ----
  const handleNext = async () => {
    setDescriptionTouched(true);
    if (!canContinue) return;

    setStory({
      description_html: descriptionHtml,
      faqs: faqs.map((f, idx) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
        display_order: idx,
      })),
    });

    setSaving(true);
    try {
      const campaignId = await saveDraftToBackend(user ?? undefined);
      router.push(`/create-project/people?draft=${campaignId}`);
    } catch (err) {
      console.error("Failed to save draft:", err);
      const existingDraft = searchParams.get("draft");
      router.push(`/create-project/people${existingDraft ? `?draft=${existingDraft}` : ""}`);
    } finally {
      setSaving(false);
    }
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
            Project Description{" "}
          </label>

          <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex gap-2">
              <button
                type="button"
                onClick={clearFormatting}
                className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => format("bold")}
                className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded font-bold text-sm"
              >
                B
              </button>

              <button
                type="button"
                onClick={() => format("italic")}
                className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded italic text-sm"
              >
                I
              </button>

              <button
                type="button"
                onClick={() => format("underline")}
                className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded underline text-sm"
              >
                U
              </button>
            </div>

            {/* Editor */}
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
                onBlur={() => {
                  setDescriptionTouched(true);
                  handleEditorInput();
                }}
                className="w-full px-4 py-4 min-h-[220px] focus:outline-none"
              />
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            A compelling story is key to a successful campaign. Be authentic and specific.
          </p>

          {descriptionTouched && !descriptionIsValid && (
            <p className="mt-2 text-sm text-red-500">
              Please enter a project description to continue.
            </p>
          )}
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">FAQ (optional)</h2>

          {faqs.length > 0 && (
            <div className="space-y-4 mb-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-6 bg-white">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{faq.question}</div>
                      <div className="text-gray-600 mt-2 whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFaq(idx)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isAddingFaq ? (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <input
                value={faqDraft.question}
                onChange={(e) =>
                  setFaqDraft((p) => ({ ...p, question: e.target.value }))
                }
                placeholder="Question"
                className="w-full mb-4 px-4 py-3 border rounded-lg"
              />

              <textarea
                value={faqDraft.answer}
                onChange={(e) =>
                  setFaqDraft((p) => ({ ...p, answer: e.target.value }))
                }
                placeholder="Answer"
                rows={4}
                className="w-full mb-4 px-4 py-3 border rounded-lg"
              />

              <div className="flex justify-end gap-4">
                <button onClick={cancelFaqForm}>Cancel</button>
                <button
                  onClick={addFaq}
                  disabled={!faqDraft.question || !faqDraft.answer}
                  className="bg-[#8BC34A] text-white px-6 py-2 rounded-full disabled:opacity-50"
                >
                  Add FAQ
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={openFaqForm}
              className="w-full border-2 border-dashed border-[#8BC34A] rounded-xl py-10 text-[#8BC34A]"
            >
              + Add FAQ
            </button>
          )}
        </div>

        {/* Save */}
        <div className="flex justify-between">
          <Link
            href={`/create-project/rewards${searchParams.get("draft") ? `?draft=${searchParams.get("draft")}` : ""}`}
            className="text-gray-500 px-8 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Back
          </Link>
          <button
            type="button"
            onClick={handleNext}
            disabled={saving}
            className="bg-[#8BC34A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>

      <DraftDebug />
    </div>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={null}>
      <StoryPageContent />
    </Suspense>
  );
}