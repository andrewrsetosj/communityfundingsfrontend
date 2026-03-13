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
  email: string;
};

export type PaymentDraft = {
  account_type: "individual" | "business";
  account_holder_name: string;
  routing_number: string;
  account_number: string;
  confirm_account_number: string;
};

export type CampaignDraft = {
  // Basics
  title: string;
  category: string;
  location: string;
  funding_goal_cents: number;
  duration_days: number;

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
  title: "",
  category: "",
  location: "",
  funding_goal_cents: 0,
  duration_days: 0,

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

      setPayment: (patch) =>
        set((s) => ({
          draft: {
            ...s.draft,
            payment: { ...s.draft.payment, ...patch },
          },
        })),

      reset: () => set({ draft: emptyDraft }),
    }),
    {
      name: "campaign-create-draft-v1",
      version: 3,
      migrate: (persisted: any) => {
        const state = persisted?.state ?? persisted ?? {};
        const draft = state?.draft ?? {};
        return {
          ...state,
          draft: {
            ...emptyDraft,
            ...draft,
            payment: { ...emptyDraft.payment, ...(draft.payment ?? {}) },
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);