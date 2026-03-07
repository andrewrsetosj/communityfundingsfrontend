"use client";

import { useCampaignDraft } from "../store/useCampaignDraft";

export function DraftDebug() {
  const { draft } = useCampaignDraft();

  return (
    <div className="fixed bottom-4 right-4 w-[360px] max-w-[90vw] border bg-white rounded-lg shadow-lg z-50">
      <div className="px-3 py-2 border-b text-xs font-semibold text-gray-700">
        Draft Debug
      </div>
      <pre className="p-3 text-[11px] leading-snug overflow-auto max-h-[260px] text-gray-700">
        {JSON.stringify(draft, null, 2)}
      </pre>
    </div>
  );
}