"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useOrgCampaignDraft, saveOrgDraftToBackend } from "../store/useOrgCampaignDraft";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface CollaboratorUI {
  key: string;
  email: string;
  role: "co-creator";
  status: "pending" | "verified";
}

interface OrgProfile {
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  phone_number: string | null;
  address: string | null;
  state: string | null;
}

function debounce<T extends (...args: any[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function OrgPeoplePage() {
  const { orgId } = useParams<{ orgId: string }>();
  const router = useRouter();

  const { user } = useUser();

  const hasHydrated = useOrgCampaignDraft((s) => s.hasHydrated);
  const campaignId = useOrgCampaignDraft((s) => s.draft.campaign_id);
  const vanitySlug = useOrgCampaignDraft((s) => s.draft.vanity_slug);
  const coCreators = useOrgCampaignDraft((s) => s.draft.co_creators);
  const setPeople = useOrgCampaignDraft((s) => s.setPeople);

  const [orgProfile, setOrgProfile] = useState<OrgProfile | null>(null);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const [urlTouched, setUrlTouched] = useState(false);
  const [slugCheckLoading, setSlugCheckLoading] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch org profile and auto-populate bio in draft
  useEffect(() => {
    if (!orgId) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("cf_backend_token") : null;
    fetch(`${API_URL}/api/users/${orgId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: OrgProfile | null) => {
        if (!data) return;
        setOrgProfile(data);
        // Auto-populate the campaign bio from the org's bio so it still gets saved
        if (data.bio) setPeople({ bio: data.bio });
      })
      .catch(() => {});
  }, [orgId, setPeople]);

  const checkSlugDebounced = useCallback(
    debounce(async (slug: string, excludeId: number | null) => {
      if (!slug || !slug.trim()) {
        setSlugAvailable(null);
        return;
      }
      setSlugCheckLoading(true);
      try {
        const params = new URLSearchParams({ slug });
        if (excludeId != null) params.set("campaign_id", String(excludeId));
        const res = await fetch(`${API_URL}/api/campaigns/check-slug?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setSlugAvailable(data.available);
      } catch {
        setSlugAvailable(null);
      } finally {
        setSlugCheckLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkSlugDebounced(vanitySlug || "", campaignId);
  }, [vanitySlug, campaignId, checkSlugDebounced]);

  const collaboratorsUI: CollaboratorUI[] = useMemo(() => {
    const list = coCreators ?? [];
    return list.map((c, idx) => ({
      key: `${c.email}-${idx}`,
      email: c.email,
      role: "co-creator",
      status: "pending",
    }));
  }, [coCreators]);

  if (!hasHydrated) return null;

  const handleVanityChange = (raw: string) => {
    const sanitized = raw.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setPeople({ vanity_slug: sanitized });
    setSlugAvailable(null);
  };

  const handleAddCollaborator = () => {
    const email = newCollaboratorEmail.trim().toLowerCase();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    const existing = (coCreators ?? []).some((c) => c.email.trim().toLowerCase() === email);
    if (existing) { setNewCollaboratorEmail(""); return; }
    setPeople({ co_creators: [...(coCreators ?? []), { email }] });
    setNewCollaboratorEmail("");
  };

  const handleRemoveCollaborator = (emailToRemove: string) => {
    setPeople({
      co_creators: (coCreators ?? []).filter(
        (c) => c.email.trim().toLowerCase() !== emailToRemove.trim().toLowerCase()
      ),
    });
  };

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCollaboratorEmail.trim());
  const urlIsValid = (vanitySlug ?? "").trim().length > 0;
  const canContinue = urlIsValid && slugAvailable === true;

  const handleNext = async () => {
    if (!canContinue || saving) return;
    setSaveError(null);
    setSaving(true);
    try {
      await saveOrgDraftToBackend(orgId, user ?? undefined);
      router.push(`/business-create-project/${orgId}/payment`);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Creator Profile
      </h1>
      <p className="text-gray-600 mb-8">
        Your business profile will be shown as the creator of this campaign.
      </p>

      <div className="space-y-8">
        {/* Business Profile (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Profile
          </label>

          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                {orgProfile?.avatar_url ? (
                  <Image
                    src={orgProfile.avatar_url}
                    alt={orgProfile.name ?? "Business"}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {orgProfile?.name ?? "—"}
                </h3>

                {orgProfile?.bio && (
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {orgProfile.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  {orgProfile?.website && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {orgProfile.website}
                    </span>
                  )}
                  {(orgProfile?.address || orgProfile?.state) && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {[orgProfile.address, orgProfile.state].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {orgProfile?.phone_number && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {orgProfile.phone_number}
                    </span>
                  )}
                </div>

                <Link
                  href={`/business/${orgId}?tab=settings`}
                  className="inline-block mt-3 text-xs text-[#8BC34A] font-medium hover:underline"
                >
                  Edit business profile →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Vanity URL */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            URL
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
              communityfundings.com/project/
            </span>
            <input
              type="text"
              value={vanitySlug ?? ""}
              onChange={(e) => handleVanityChange(e.target.value)}
              onBlur={() => setUrlTouched(true)}
              placeholder="my-awesome-project"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Create a custom URL for your project page. Use only lowercase letters,
            numbers, and hyphens.
          </p>
          {urlTouched && !urlIsValid && (
            <p className="mt-2 text-sm text-red-500">
              Please enter a URL to continue.
            </p>
          )}
          {vanitySlug && vanitySlug.trim() && (
            <div className="mt-2">
              {slugCheckLoading ? (
                <p className="text-sm text-gray-500">Checking availability...</p>
              ) : slugAvailable === true ? (
                <p className="text-sm text-green-600">This URL is available!</p>
              ) : slugAvailable === false ? (
                <p className="text-sm text-red-600">This URL is already taken.</p>
              ) : null}
            </div>
          )}
        </div>

        {/* Co-creators */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Co-creators
          </label>

          {collaboratorsUI.length > 0 && (
            <div className="space-y-3 mb-6">
              {collaboratorsUI.map((collaborator) => (
                <div
                  key={collaborator.key}
                  className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{collaborator.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{collaborator.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      Pending
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCollaborator(collaborator.email)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove co-creator"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Invite a co-creator</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  placeholder="communityfundings@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddCollaborator}
                disabled={!emailIsValid}
                className="w-full px-4 py-3 rounded-lg font-medium transition-colors border border-[#8BC34A] text-[#8BC34A] bg-white hover:bg-[#F5F9F0] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Send Invite
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Co-creators can edit this project and manage campaign details. Must be a valid email.
            </p>
          </div>
        </div>

        {/* Save & Continue */}
        {saveError && (
          <p className="mt-4 text-sm text-red-600" role="alert">{saveError}</p>
        )}
        <div className="mt-4 flex justify-between items-center gap-4 flex-wrap">
          <Link
            href={`/business-create-project/${orgId}/story`}
            className="text-gray-500 px-8 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Back
          </Link>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canContinue || saving}
            className={[
              "bg-[#8BC34A] text-white px-8 py-3 rounded-full font-medium transition-colors",
              canContinue && !saving ? "hover:bg-[#7CB342]" : "opacity-50 cursor-not-allowed",
            ].join(" ")}
            aria-disabled={!canContinue || saving}
            title={!canContinue ? "Please enter a valid and available URL to continue." : undefined}
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
