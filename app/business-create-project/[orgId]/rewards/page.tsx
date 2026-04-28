"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  useOrgCampaignDraft,
  saveOrgDraftToBackend,
  type RewardDraft,
} from "../store/useOrgCampaignDraft";

interface RewardUI {
  key: string;
  title: string;
  amount: string;
  description: string;
  deliveryDate: string;
  limit: string;
}

function dollarsToCents(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, "").trim();
  if (!cleaned) return 0;

  const parts = cleaned.split(".");
  const dollars = parts[0] ? parseInt(parts[0], 10) : 0;

  const centsRaw = parts[1] ?? "";
  const cents =
    centsRaw.length === 0 ? 0 : parseInt((centsRaw + "00").slice(0, 2), 10);

  if (Number.isNaN(dollars) || Number.isNaN(cents)) return 0;
  return dollars * 100 + cents;
}

function normalizeLimit(input: string): number | null {
  const cleaned = input.replace(/[^0-9]/g, "").trim();
  if (!cleaned) return null;
  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function rewardDraftToUI(r: RewardDraft, idx: number): RewardUI {
  return {
    key: `reward-${idx}`,
    title: r.title ?? "",
    amount: String(((r.required_amount_cents ?? 0) / 100) || ""),
    description: r.description ?? "",
    deliveryDate: "",
    limit: r.limit_total ? String(r.limit_total) : "",
  };
}

export default function OrgRewardsPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const hasHydrated = useOrgCampaignDraft((s) => s.hasHydrated);
  const draftRewards = useOrgCampaignDraft((s) => s.draft.rewards);
  const setRewards = useOrgCampaignDraft((s) => s.setRewards);
  const [saving, setSaving] = useState(false);

  const rewardsUI: RewardUI[] = useMemo(() => {
    const arr = draftRewards ?? [];
    return arr.map((r, idx) => rewardDraftToUI(r, idx));
  }, [draftRewards]);

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [limit, setLimit] = useState("");

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDescription("");
    setDeliveryDate("");
    setLimit("");
    setShowForm(false);
  };

  const handleAddReward = () => {
    const cents = dollarsToCents(amount);
    if (!title.trim() || cents <= 0) return;

    const newDraftReward: RewardDraft = {
      title: title.trim(),
      required_amount_cents: cents,
      description: description.trim(),
      limit_total: normalizeLimit(limit),
      display_order: (draftRewards?.length ?? 0),
    };

    const next = [...(draftRewards ?? []), newDraftReward].map((r, idx) => ({
      ...r,
      display_order: idx,
    }));

    setRewards(next);
    resetForm();
  };

  const handleDeleteReward = (idxToDelete: number) => {
    const next = (draftRewards ?? [])
      .filter((_, idx) => idx !== idxToDelete)
      .map((r, idx) => ({ ...r, display_order: idx }));

    setRewards(next);
  };

  const handleNext = async () => {
    setSaving(true);
    try {
      const campaignId = await saveOrgDraftToBackend(orgId, user ?? undefined);
      router.push(`/business-create-project/${orgId}/story?draft=${campaignId}`);
    } catch (err) {
      console.error("Failed to save draft:", err);
      const existingDraft = searchParams.get("draft");
      router.push(
        `/business-create-project/${orgId}/story${existingDraft ? `?draft=${existingDraft}` : ""}`,
      );
    } finally {
      setSaving(false);
    }
  };

  if (!hasHydrated) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Add reward tiers
      </h1>
      <p className="text-gray-600 mb-8">
        Reward tiers give supporters pre-set contribution options and clarify
        what they'll receive.
      </p>

      {/* Existing Rewards */}
      {rewardsUI.length > 0 && (
        <div className="space-y-4 mb-8">
          {rewardsUI.map((reward, idx) => (
            <div
              key={reward.key}
              className="border border-gray-200 rounded-lg p-6 hover:border-[#8BC34A] transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-[#8BC34A]">
                      ${reward.amount}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">
                      {reward.title}
                    </h3>
                  </div>

                  {reward.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {reward.description}
                    </p>
                  )}

                  <div className="flex gap-4 text-sm text-gray-500">
                    {reward.deliveryDate && (
                      <span>Delivery: {reward.deliveryDate}</span>
                    )}
                    {reward.limit && <span>Limit: {reward.limit} backers</span>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteReward(idx)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete reward"
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

      {/* Add Reward Form */}
      {showForm ? (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            New Reward Tier
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Reward Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Early Bird Special"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Pledge Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="25"
                    inputMode="decimal"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the perk and what makes this tier meaningful."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddReward}
                className="bg-[#8BC34A] text-white px-6 py-2 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
              >
                Add Reward
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#8BC34A] transition-colors group"
        >
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#F5F9F0] transition-colors">
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-[#8BC34A] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-gray-600 group-hover:text-[#8BC34A] transition-colors font-medium">
              Add a reward tier
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Create incentives for your backers
            </p>
          </div>
        </button>
      )}

      <div className="mt-12 flex justify-between">
        <Link
          href={`/business-create-project/${orgId}/basics${searchParams.get("draft") ? `?draft=${searchParams.get("draft")}` : ""}`}
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
  );
}
