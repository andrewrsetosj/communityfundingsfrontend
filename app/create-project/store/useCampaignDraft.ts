"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  email: string; // must exist in creators table (or you handle “invite” flow)
};

export type CampaignDraft = {
  // Basics
  title: string;
  category: string;
  location: string;
  funding_goal_cents: number;
  duration_days: number;
  image_url: string;

  // Rewards
  rewards: RewardDraft[];

  // Story
  description_html: string;
  faqs: FaqDraft[];

  // People
  vanity_slug: string;
  co_creators: CollaboratorDraft[];
};

export const emptyDraft: CampaignDraft = {
  title: "",
  category: "",
  location: "",
  funding_goal_cents: 0,
  duration_days: 1,
  image_url: "",
  rewards: [],
  description_html: "",
  faqs: [],
  vanity_slug: "",
  co_creators: [],
};

type DraftStore = {
  draft: CampaignDraft;

  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  setBasics: (
    patch: Partial<
      Pick<
        CampaignDraft,
        "title" | "category" | "location" | "funding_goal_cents" | "duration_days" | "image_url"
      >
    >
  ) => void;

  setRewards: (rewards: RewardDraft[]) => void;
  setStory: (patch: Partial<Pick<CampaignDraft, "description_html" | "faqs">>) => void;
  setPeople: (patch: Partial<Pick<CampaignDraft, "vanity_slug" | "co_creators">>) => void;

  reset: () => void;
};

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

      reset: () => set({ draft: emptyDraft }),
    }),
    {
      name: "campaign-create-draft-v1",
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);