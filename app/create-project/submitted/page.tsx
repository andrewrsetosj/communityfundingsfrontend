"use client";

import Link from "next/link";
import { useCampaignDraft } from "../store/useCampaignDraft";

export default function SubmittedPage() {
  const title = useCampaignDraft((s) => s.draft.title);
  const vanity = useCampaignDraft((s) => s.draft.vanity_slug);

  const today = new Date();
  const submittedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      {/* Success Icon */}
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">
        Your campaign has been submitted 🎉
      </h1>

      <p className="text-gray-600 mb-8">
        Our team is reviewing your campaign to make sure everything is ready for launch.
      </p>

      {/* Campaign Name */}
      {title && (
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Campaign</p>
          <p className="text-lg font-medium text-gray-900">{title}</p>
        </div>
      )}

      {/* Status Card */}
      <div className="border border-gray-200 rounded-xl p-6 mb-10 text-left bg-white">
        <p className="text-sm text-gray-500 mb-2">Status</p>
        <p className="font-medium text-gray-900 mb-4">Under review</p>

        <div className="text-sm text-gray-600 space-y-1">
          <p>Submitted: {submittedDate}</p>
          <p>Estimated review: 2–3 business days</p>
        </div>
      </div>

      {/* What happens next */}
      <div className="text-left mb-10">
        <h3 className="font-medium text-gray-900 mb-3">What happens next</h3>
        <ul className="text-gray-600 text-sm space-y-2">
          <li>• Our team reviews your campaign details</li>
          <li>• We’ll email you if any updates are needed</li>
          <li>• Once approved, your campaign will go live</li>
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <Link
          href="/create-project/people"
          className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Edit campaign
        </Link>

        {vanity && (
          <Link
            href={`/project/${vanity}`}
            className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Preview page
          </Link>
        )}

        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-[#8BC34A] text-white hover:bg-[#7CB342] transition-colors"
        >
          Go home
        </Link>
      </div>

      {/* Email reassurance */}
      <p className="text-xs text-gray-500">
        You’ll receive an email once your campaign has been reviewed.
      </p>
    </div>
  );
}