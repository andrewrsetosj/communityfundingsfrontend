"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Header from "../components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface DraftSummary {
  campaign_id: number;
  title: string;
  category: string;
  created_at: string | null;
  slug: string;
}

export default function DraftsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [drafts, setDrafts] = useState<DraftSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const token = localStorage.getItem("cf_backend_token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/campaigns/my-drafts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setDrafts(data))
      .catch((err) => console.error("Failed to load drafts:", err))
      .finally(() => setLoading(false));
  }, [isLoaded, user, router]);

  const handleDelete = async (campaignId: number) => {
    if (!confirm("Delete this draft? This cannot be undone.")) return;

    setDeleting(campaignId);
    const token = localStorage.getItem("cf_backend_token");
    try {
      const res = await fetch(`${API_URL}/api/campaigns/drafts/${campaignId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token ?? ""}` },
      });
      if (res.ok) {
        setDrafts((prev) => prev.filter((d) => d.campaign_id !== campaignId));
      }
    } catch (err) {
      console.error("Failed to delete draft:", err);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isLoaded || loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center text-gray-500">
        Loading drafts...
      </div>
    );
  }

  return (
    <>
      <Header />

    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Your Drafts
          </h1>
          <p className="text-gray-600 mt-1">
            Continue working on your campaign drafts.
          </p>
        </div>
        <Link
          href="/create-project/basics"
          className="bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
        >
          New Campaign
        </Link>
      </div>

      {drafts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No drafts yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start creating a campaign and your progress will be saved here.
          </p>
          <Link
            href="/create-project/basics"
            className="inline-block bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
          >
            Start a New Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <div
              key={draft.campaign_id}
              className="border border-gray-200 rounded-xl p-6 hover:border-[#8BC34A] transition-colors bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {draft.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    {draft.category && (
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {draft.category}
                      </span>
                    )}
                    {draft.created_at && (
                      <span>Created {formatDate(draft.created_at)}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <Link
                    href={`/create-project/basics?draft=${draft.campaign_id}`}
                    className="bg-[#8BC34A] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#7CB342] transition-colors"
                  >
                    Continue Editing
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(draft.campaign_id)}
                    disabled={deleting === draft.campaign_id}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    aria-label="Delete draft"
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
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
