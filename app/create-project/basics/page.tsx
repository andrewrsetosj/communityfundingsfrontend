"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCampaignDraft } from "@/app/create-project/store/useCampaignDraft";
import { DraftDebug } from "@/app/create-project/component/draftDebug";

export default function BasicsPage() {
  const router = useRouter();

  const hasHydrated = useCampaignDraft((s) => s.hasHydrated);
  const draft = useCampaignDraft((s) => s.draft);
  const setBasics = useCampaignDraft((s) => s.setBasics);


  // Format cents -> dollars string for the input
  const fundingGoalString = useMemo(() => {
    const cents = draft.funding_goal_cents ?? 0;
    if (!cents) return "";
    const dollars = cents / 100;
    // keep it simple; you can format w/ Intl if you want commas
    return String(dollars);
  }, [draft.funding_goal_cents]);

  // --- image picker local state ---
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [projectImagePreviewUrls, setProjectImagePreviewUrls] = useState<string[]>([]);
  const MAX_IMAGES = 5;

  const openFilePicker = () => fileInputRef.current?.click();

  const addFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (incoming.length === 0) return;

    const remaining = MAX_IMAGES - projectImages.length;
    if (remaining <= 0) return;

    const accepted = incoming.slice(0, remaining);
    const newUrls = accepted.map((f) => URL.createObjectURL(f));

    setProjectImages((prev) => [...prev, ...accepted]);
    setProjectImagePreviewUrls((prev) => [...prev, ...newUrls]);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    addFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    addFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const removeImageAt = (idx: number) => {
    setProjectImages((prev) => prev.filter((_, i) => i !== idx));
    setProjectImagePreviewUrls((prev) => {
      const url = prev[idx];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const clearAllImages = () => {
    projectImagePreviewUrls.forEach((u) => URL.revokeObjectURL(u));
    setProjectImages([]);
    setProjectImagePreviewUrls([]);
  };

  const handleNext = () => {
    // Nothing to “save” anymore—your draft is already updated onChange.
    router.push("/create-project/rewards");
  };

  const categories = [
    "Arts","Comics","Community","Crafts","Creative","Dance","Design","Disaster Relief",
    "Education","Emergency","Fashion","Film & Video","Food","Games","Journalism",
    "Music","Nonprofit","Pets","Photography","Publishing","Sports","Technology","Theater",
  ];

  // If you want to avoid any "flash" before persisted state loads:
  if (!hasHydrated) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Start with the basics
      </h1>
      <p className="text-gray-600 mb-8">
        Make it easy for people to learn about your project.
      </p>

      <div className="space-y-8">
        {/* Project Title */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Project Title
          </label>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => setBasics({ title: e.target.value })}
            placeholder="Enter your project title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
          />
          <p className="mt-2 text-sm text-gray-500">
            Make it clear, specific, and easy to recognize.
          </p>
        </div>

        {/* Category + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Category
            </label>
            <select
              value={draft.category}
              onChange={(e) => setBasics({ category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Project Location
            </label>
            <input
              type="text"
              value={draft.location}
              onChange={(e) => setBasics({ location: e.target.value })}
              placeholder="Enter your city"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            />
          </div>
        </div>

        {/* Project Image (local only, as discussed) */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Project Image
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onFileChange}
          />

          <div
            role="button"
            tabIndex={0}
            onClick={openFilePicker}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openFilePicker();
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-[#8BC34A] transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-700 font-medium">Upload up to {MAX_IMAGES} images</p>
              <p className="text-sm text-gray-500">{projectImages.length}/{MAX_IMAGES}</p>
            </div>

            {projectImages.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  Drag and drop images, or{" "}
                  <span className="text-[#8BC34A] font-medium underline">browse</span>
                </p>
                <p className="text-sm text-gray-400">
                  Recommended: 1024 x 576 pixels (16:9)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {projectImagePreviewUrls.map((url, idx) => (
                  <div key={url} className="relative">
                    <img src={url} alt={`Preview ${idx + 1}`} className="h-28 w-full object-cover rounded-md border" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImageAt(idx);
                      }}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-800 rounded-full px-2 py-1 text-xs border"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {projectImages.length > 0 && (
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFilePicker();
                  }}
                  className="text-sm text-[#8BC34A] font-medium underline"
                >
                  Add more
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllImages();
                  }}
                  className="text-sm text-gray-600 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Great photos bring your project to life and help backers connect with it.
          </p>
        </div>

        {/* Funding Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Funding Goal
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              value={fundingGoalString}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, "");
                const dollars = parseFloat(raw);
                setBasics({
                  funding_goal_cents: Number.isFinite(dollars)
                    ? Math.round(dollars * 100)
                    : 0,
                });
              }}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Lower, achievable goals increase your chances of success and build early momentum.
          </p>
        </div>

        {/* Campaign Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Campaign Duration
          </label>
          <div className="relative">
            <input
              type="number"
              min={1}
              max={120}
              value={draft.duration_days === 1 ? "" : draft.duration_days}
              placeholder="30"
              onChange={(e) => {
                const raw = e.target.value;

                if (raw === "") {
                  setBasics({ duration_days: 1 });
                  return;
                }

                const num = parseInt(raw, 10);

                if (Number.isNaN(num)) return;

                const clamped = Math.min(120, Math.max(1, num));

                setBasics({ duration_days: clamped });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              days
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Shorter campaigns create urgency and tend to perform better than longer ones.
          </p>
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="bg-[#8BC34A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
        >
          Save & Continue
        </button>
      </div>

      <DraftDebug />
    </div>
  );
}