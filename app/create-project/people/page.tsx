"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCampaignDraft, saveDraftToBackend } from "../store/useCampaignDraft";
import { DraftDebug } from "@/app/create-project/component/draftDebug";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface CollaboratorUI {
  key: string; // stable key for rendering
  email: string;
  role: "co-creator";
  status: "pending" | "verified";
}

export default function PeoplePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [saving, setSaving] = useState(false);

  // Store selectors (hooks)
  const hasHydrated = useCampaignDraft((s) => s.hasHydrated);
  const bio = useCampaignDraft((s) => s.draft.bio);
  const vanitySlug = useCampaignDraft((s) => s.draft.vanity_slug);
  const coCreators = useCampaignDraft((s) => s.draft.co_creators);
  const setPeople = useCampaignDraft((s) => s.setPeople);

  // Local state (hooks)
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const [bioEditing, setBioEditing] = useState(false);
  const [bioLoaded, setBioLoaded] = useState(false);

  // ✅ NEW: touched flags (only show required UI after interaction)
  const [bioTouched, setBioTouched] = useState(false);
  const [urlTouched, setUrlTouched] = useState(false);

  // Derived state (hook)
  const collaboratorsUI: CollaboratorUI[] = useMemo(() => {
    const list = coCreators ?? [];
    return list.map((c, idx) => ({
      key: `${c.email}-${idx}`,
      email: c.email,
      role: "co-creator",
      status: "pending",
    }));
  }, [coCreators]);

  // Side effects (hooks)
  useEffect(() => {
    setAgreedToTerms(false);
  }, []);

  // Fetch creator bio from DB and pre-populate if bio is empty
  useEffect(() => {
    if (!user?.id || bioLoaded) return;

    async function fetchCreatorBio() {
      try {
        const res = await fetch(`${API_URL}/api/users/${user!.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.bio && !(bio ?? "").trim()) {
          setPeople({ bio: data.bio });
        }
        setBioLoaded(true);
      } catch (err) {
        console.error("Error fetching creator bio:", err);
      }
    }
    fetchCreatorBio();
  }, [user?.id, bioLoaded, bio, setPeople]);

  // ✅ Now it's safe to return early (after hooks)
  if (!hasHydrated) return null;

  const handleVanityChange = (raw: string) => {
    const sanitized = raw.toLowerCase().replace(/[^a-z0-9-]/g, "");
    // write immediately to store so Back works even without Next
    setPeople({ vanity_slug: sanitized });
  };

  const handleAddCollaborator = () => {
    const email = newCollaboratorEmail.trim().toLowerCase();
    if (!email) return;

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      alert("Please enter a valid email address.");
      return;
    }

    const existing = (coCreators ?? []).some(
      (c) => c.email.trim().toLowerCase() === email
    );
    if (existing) {
      setNewCollaboratorEmail("");
      return;
    }

    const next = [...(coCreators ?? []), { email }];

    // write immediately to store
    setPeople({ co_creators: next });
    setNewCollaboratorEmail("");
  };

  const handleRemoveCollaborator = (emailToRemove: string) => {
    const next = (coCreators ?? []).filter(
      (c) => c.email.trim().toLowerCase() !== emailToRemove.trim().toLowerCase()
    );

    setPeople({ co_creators: next });
  };

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    newCollaboratorEmail.trim()
  );

  // ✅ REQUIRED FIELDS: bio + vanitySlug
  const bioIsValid = (bio ?? "").trim().length > 0;
  const urlIsValid = (vanitySlug ?? "").trim().length > 0;
  const canContinue = bioIsValid && urlIsValid;

  const handleNext = async () => {
    setBioTouched(true);
    setUrlTouched(true);
    if (!canContinue) return;

    setSaving(true);
    try {
      const campaignId = await saveDraftToBackend();
      router.push(`/create-project/payment?draft=${campaignId}`);
    } catch (err) {
      console.error("Failed to save draft:", err);
      const existingDraft = searchParams.get("draft");
      router.push(`/create-project/payment${existingDraft ? `?draft=${existingDraft}` : ""}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Introduce yourself
      </h1>
      <p className="text-gray-600 mb-8">
        Help backers get to know you and your team.
      </p>

      <div className="space-y-8">
        {/* Creator Profile Card */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Creator Profile
          </label>

          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                  {user?.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {user?.fullName || user?.firstName || "Your Name"}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Creator • 0 projects created
                </p>
                <Link
                  href="/settings"
                  className="text-sm text-[#8BC34A] font-medium hover:underline"
                >
                  Edit profile settings
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Short Bio{" "}
              </label>
              {bioEditing ? (
                <textarea
                  value={bio ?? ""}
                  onChange={(e) => setPeople({ bio: e.target.value })}
                  onBlur={() => setBioTouched(true)}
                  placeholder="Tell backers a bit about yourself..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent resize-none bg-white"
                />
              ) : (
                <p className="w-full py-1 text-gray-700 whitespace-pre-wrap">
                  {(bio ?? "").trim() || <span className="text-gray-400">No bio yet.</span>}
                </p>
              )}
              <button
                type="button"
                onClick={() => setBioEditing(!bioEditing)}
                className="mt-2 text-sm text-[#8BC34A] font-medium hover:underline"
              >
                {bioEditing ? "Done" : "Edit"}
              </button>
              {bioTouched && !bioIsValid && (
                <p className="mt-2 text-sm text-red-500">
                  Please enter a short bio to continue.
                </p>
              )}
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {collaborator.email}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {collaborator.role}
                      </p>
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Invite co-creator */}
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Invite a co-creator
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Email Address
                </label>
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
                className="
                  w-full px-4 py-3 rounded-lg font-medium transition-colors
                  border border-[#8BC34A]
                  text-[#8BC34A]
                  bg-white
                  hover:bg-[#F5F9F0]
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
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
        <div className="mt-12 flex justify-between">
          <Link
            href={`/create-project/story${searchParams.get("draft") ? `?draft=${searchParams.get("draft")}` : ""}`}
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

      <DraftDebug />
    </div>
  );
}