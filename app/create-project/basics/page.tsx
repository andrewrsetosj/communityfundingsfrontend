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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>(draft.image_url || "");

  const openFilePicker = () => fileInputRef.current?.click();

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_URL}/api/uploads/image`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail || "Upload failed");
      }
      const data = await res.json();
      setBasics({ image_url: data.url });
      setPreviewUrl(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const removeImage = () => {
    setBasics({ image_url: "" });
    setPreviewUrl("");
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
            className="hidden"
            onChange={onFileChange}
          />

          <div
            role="button"
            tabIndex={0}
            onClick={!previewUrl ? openFilePicker : undefined}
            onKeyDown={(e) => {
              if (!previewUrl && (e.key === "Enter" || e.key === " ")) openFilePicker();
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
              previewUrl ? "border-gray-200" : "border-gray-300 hover:border-[#8BC34A] cursor-pointer"
            }`}
          >
            {uploading ? (
              <div className="text-center py-4">
                <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#8BC34A] rounded-full animate-spin mb-3" />
                <p className="text-gray-600">Uploading image...</p>
              </div>
            ) : previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Project image"
                  className="w-full max-h-64 object-cover rounded-md border"
                />
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openFilePicker();
                    }}
                    className="text-sm text-[#8BC34A] font-medium underline"
                  >
                    Replace image
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="text-sm text-gray-600 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  Drag and drop an image, or{" "}
                  <span className="text-[#8BC34A] font-medium underline">browse</span>
                </p>
                <p className="text-sm text-gray-400">
                  Recommended: 1024 x 576 pixels (16:9)
                </p>
              </div>
            )}

            {uploadError && (
              <p className="mt-3 text-sm text-red-600">{uploadError}</p>
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