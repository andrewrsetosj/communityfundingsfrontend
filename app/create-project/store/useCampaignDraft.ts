"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  backendJwtExpired,
  syncClerkToBackendToken,
  type ClerkLikeUser,
} from "@/lib/backendToken";

export type RewardDraft = {
  title: string;
  required_amount_cents: number;
  description: string;
  limit_total?: number | null;
  display_order: number;
};

export type FaqDraft = {
  question: string;
  answer: string;
  display_order: number;
};

export type CollaboratorDraft = {
  email: string;
};

export type PaymentDraft = {
  account_type: "individual" | "business";
  account_holder_name: string;
  routing_number: string;
  account_number: string;
  confirm_account_number: string;
};

export type CampaignPhotoRef = {
  s3_bucket: string;
  s3_key: string;
  content_type: string;
  is_primary: boolean;
  sort_order: number;
  image_url?: string | null;
};

export type CampaignDraft = {
  // DB tracking
  campaign_id: number | null;

  // Basics
  title: string;
  category: string;
  location: string;
  funding_goal_cents: number;
  duration_days: number;
  photos: CampaignPhotoRef[];

  // Rewards
  rewards: RewardDraft[];

  // Story
  description_html: string;
  faqs: FaqDraft[];

  // People
  bio: string;
  vanity_slug: string;
  co_creators: CollaboratorDraft[];

  // Payment
  payment: PaymentDraft;
};

export const emptyDraft: CampaignDraft = {
  campaign_id: null,

  title: "",
  category: "",
  location: "",
  funding_goal_cents: 0,
  duration_days: 0,
  photos: [],

  rewards: [],
  description_html: "",
  faqs: [],

  bio: "",
  vanity_slug: "",
  co_creators: [],

  payment: {
    account_type: "individual",
    account_holder_name: "",
    routing_number: "",
    account_number: "",
    confirm_account_number: "",
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type DraftStore = {
  draft: CampaignDraft;

  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  setBasics: (
    patch: Partial<
      Pick<
        CampaignDraft,
        "title" | "category" | "location" | "funding_goal_cents" | "duration_days"
      >
    >
  ) => void;

  setRewards: (rewards: RewardDraft[]) => void;
  setStory: (patch: Partial<Pick<CampaignDraft, "description_html" | "faqs">>) => void;

  setPeople: (
    patch: Partial<Pick<CampaignDraft, "bio" | "vanity_slug" | "co_creators">>
  ) => void;

  setPayment: (patch: Partial<PaymentDraft>) => void;

  setCampaignId: (id: number) => void;
  setPhotos: (photos: CampaignPhotoRef[]) => void;
  loadDraft: (data: Omit<CampaignDraft, "payment"> & { campaign_id: number }) => void;

  reset: () => void;
};

/**
 * Save the current draft to the backend. Returns the campaign_id.
 * Pass `clerkUser` from `useUser()` so we can refresh an expired backend JWT before saving.
 */
export async function saveDraftToBackend(
  clerkUser?: ClerkLikeUser | null,
): Promise<number> {
  const { draft } = useCampaignDraft.getState();

  let token =
    typeof window !== "undefined"
      ? localStorage.getItem("cf_backend_token")
      : null;

  if (clerkUser && (!token || backendJwtExpired(token))) {
    const ok = await syncClerkToBackendToken(clerkUser);
    if (!ok) throw new Error("Could not refresh session with the server.");
    token = localStorage.getItem("cf_backend_token");
  }

  if (!token) throw new Error("Not authenticated");

  const payload: Record<string, unknown> = {
    title: draft.title,
    category: draft.category,
    location: draft.location,
    funding_goal_cents: draft.funding_goal_cents,
    duration_days: draft.duration_days,
    description_html: draft.description_html,
    bio: draft.bio,
    vanity_slug: draft.vanity_slug,
    faqs: draft.faqs,
    rewards: draft.rewards,
    co_creators: draft.co_creators,
  };

  if (draft.campaign_id) {
    payload.campaign_id = draft.campaign_id;
  }

  const doPut = (bearer: string) =>
    fetch(`${API_URL}/api/campaigns/drafts`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearer}`,
      },
      body: JSON.stringify(payload),
    });

  let res = await doPut(token);

  if (res.status === 401 && clerkUser) {
    const ok = await syncClerkToBackendToken(clerkUser);
    const t2 = ok ? localStorage.getItem("cf_backend_token") : null;
    if (t2) res = await doPut(t2);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to save draft: ${text}`);
  }

  const result = await res.json();
  const campaignId = result.campaign_id as number;

  // Update store with the campaign_id
  useCampaignDraft.getState().setCampaignId(campaignId);

  return campaignId;
}

export const useCampaignDraft = create<DraftStore>()(
  persist(
    (set) => ({
      draft: emptyDraft,

      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      setBasics: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      setRewards: (rewards) => set((s) => ({ draft: { ...s.draft, rewards } })),
      setStory: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      setPeople: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),

      setPayment: (patch) =>
        set((s) => ({
          draft: {
            ...s.draft,
            payment: { ...s.draft.payment, ...patch },
          },
        })),

      setCampaignId: (id) =>
        set((s) => ({ draft: { ...s.draft, campaign_id: id } })),

      setPhotos: (photos) =>
        set((s) => ({ draft: { ...s.draft, photos } })),

      loadDraft: (data) =>
        set((s) => ({
          draft: {
            ...s.draft,
            campaign_id: data.campaign_id,
            title: data.title,
            category: data.category,
            location: data.location,
            funding_goal_cents: data.funding_goal_cents,
            duration_days: data.duration_days,
            photos: data.photos ?? [],
            rewards: data.rewards,
            description_html: data.description_html,
            faqs: data.faqs,
            bio: data.bio,
            vanity_slug: data.vanity_slug,
            co_creators: data.co_creators,
          },
        })),

      reset: () => set({ draft: { ...emptyDraft } }),
    }),
    {
      name: "campaign-create-draft-v1",
      version: 5,
      migrate: (persisted: unknown) => {
        const state =
          (persisted as { state?: Record<string, unknown> })?.state ??
          (persisted as Record<string, unknown>) ??
          {};
        const draft = (state?.draft as Record<string, unknown>) ?? {};
        return {
          ...state,
          draft: {
            ...emptyDraft,
            ...draft,
            photos: Array.isArray(draft.photos) ? draft.photos : [],
            payment: {
              ...emptyDraft.payment,
              ...(draft.payment as Partial<PaymentDraft>),
            },
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);