"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

type SavedCampaignRecord = {
  campaign_id: number;
  creator_id: string;
  title: string;
  status: string;
  time_created: string;
  url: string;
  updated_at: string;
  description_html: string;
  category: string;
  location: string;
  funding_goal_cents: number;
  duration_days: number;
  amount_raised_cents: number;
  backers: number;
  end_date?: string | null;
  saved_at: string;
  is_saved: boolean;
  image_url?: string | null;
  creator: {
    creator_id: string;
    username?: string | null;
    name?: string | null;
    last_name?: string | null;
    avatar_url?: string | null;
  };
};

type SavedCampaignsResponse = {
  campaigns: SavedCampaignRecord[];
};

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("cf_backend_token");
  if (!token || token === "undefined" || token === "null") return {};
  return { Authorization: `Bearer ${token}` };
}

function formatUSD(cents?: number) {
  if (typeof cents !== "number") return "";
  return (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatCampaignStatus(status?: string) {
  if (!status) return "";
  if (status === "pending_review") return "Pending";
  return status
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

function clampText(text: string, max = 140) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

function formatSavedDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getProfileHref(person?: { username?: string | null; creator_id?: string | null }) {
  if (person?.username) return `/profile/${person.username}`;
  if (person?.creator_id) return `/profile/${person.creator_id}`;
  return "#";
}

function getCreatorDisplayName(record: SavedCampaignRecord) {
  const first = record.creator?.name ?? "";
  const last = record.creator?.last_name ?? "";
  const full = [first, last].filter(Boolean).join(" ").trim();
  return full || record.creator?.username || record.creator?.creator_id || "Unknown creator";
}

export default function SavedCampaignsPage() {
  const [items, setItems] = useState<SavedCampaignRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  async function loadSavedCampaigns() {
    try {
      setLoading(true);
      setError(null);

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE}/api/saved-campaigns`, {
        cache: "no-store",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to load saved campaigns: ${res.status}`);
      }

      const json = (await res.json()) as SavedCampaignsResponse;
      setItems(json.campaigns ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Could not load saved campaigns.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSavedCampaigns();
  }, []);

  async function handleUnsave(campaignUrl: string, campaignId: number) {
    try {
      setRemovingId(campaignId);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const res = await fetch(`${API_BASE}/api/saved-campaigns/${campaignUrl}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to unsave campaign: ${res.status}`);
      }

      setItems((prev) => prev.filter((item) => item.campaign_id !== campaignId));
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Could not remove saved campaign.");
    } finally {
      setRemovingId(null);
    }
  }

  const totalSaved = useMemo(() => items.length, [items]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-[#8BC34A] mb-2">Your Campaign Library</p>
            <h1 className="text-3xl font-bold text-gray-900">Saved Campaigns</h1>
            <p className="text-gray-600 mt-2">
              {totalSaved === 0
                ? "You haven’t saved any campaigns yet."
                : `${totalSaved} saved campaign${totalSaved === 1 ? "" : "s"}`}
            </p>
          </div>

          <Link
            href="/my-projects"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to My Campaigns
          </Link>
        </div>

        {loading && <p className="text-gray-600">Loading saved campaigns…</p>}

        {error && (
          <div className="border border-red-200 bg-red-50 text-red-700 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="border border-gray-200 rounded-2xl bg-white p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F5F9F0] flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5v16l7-4 7 4V5a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved campaigns yet</h2>
            <p className="text-gray-600 mb-6">
              Save campaigns from any campaign page and they’ll show up here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-3 bg-[#8BC34A] text-white rounded-lg font-medium hover:bg-[#7CB342] transition-colors"
            >
              Explore Campaigns
            </Link>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((campaign) => {
              const creatorName = getCreatorDisplayName(campaign);
              const imageUrl =
                campaign.image_url ||
                "https://community-fundings-assets.s3.us-east-2.amazonaws.com/Hero/placeholderimg.jpeg";

              const percentFunded = campaign.funding_goal_cents
                ? Math.min(
                    100,
                    Math.round((campaign.amount_raised_cents / campaign.funding_goal_cents) * 100)
                  )
                : 0;

              return (
                <div
                  key={campaign.campaign_id}
                  className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm"
                >
                  <Link href={`/project/${campaign.url || campaign.campaign_id}`} className="block">
                    <div className="relative aspect-[16/10] bg-gray-100">
                      <Image
                        src={imageUrl}
                        alt={campaign.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500 mb-1">
                          {formatCampaignStatus(campaign.status)}
                        </p>
                        <Link
                          href={`/project/${campaign.url || campaign.campaign_id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-[#8BC34A] transition-colors"
                        >
                          {campaign.title}
                        </Link>
                      </div>

                      <button
                        onClick={() => handleUnsave(campaign.url || String(campaign.campaign_id), campaign.campaign_id)}
                        disabled={removingId === campaign.campaign_id}
                        className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-[#6E9E36] hover:border-[#8BC34A] hover:text-[#8BC34A] disabled:opacity-50"
                        title="Remove from saved campaigns"
                      >
                        {removingId === campaign.campaign_id ? (
                          "..."
                        ) : (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {clampText(stripHtml(campaign.description_html) || "No description yet.")}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{campaign.category || "Uncategorized"}</span>
                      <span>{campaign.location || "No location"}</span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                      <div className="h-2 bg-[#8BC34A]" style={{ width: `${percentFunded}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="font-medium text-gray-900">
                        {formatUSD(campaign.amount_raised_cents)}
                      </span>
                      <span className="text-gray-500">
                        of {formatUSD(campaign.funding_goal_cents)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-4">
                      <Link
                        href={getProfileHref(campaign.creator)}
                        className="hover:text-[#8BC34A] transition-colors"
                      >
                        by {creatorName}
                      </Link>
                      <span>Saved {formatSavedDate(campaign.saved_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
