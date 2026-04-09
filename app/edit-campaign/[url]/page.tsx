"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  displayUrlForPhoto,
  isVideoContentType,
  photosPayloadForApi,
  uploadCampaignFilesToS3,
} from "../../create-project/lib/campaignPhotoUpload";
import LocationAutocomplete from "../../create-project/component/LocationAutocomplete";

type Reward = {
  reward_id?: number;
  title: string;
  description?: string;
  required_amount_cents: number;
  limit_total?: number | null;
  display_order?: number;
};

type Faq = {
  question: string;
  answer: string;
  display_order?: number;
};

type ViewerPermissions = {
  is_owner?: boolean;
  is_collaborator?: boolean;
  has_pending_invite?: boolean;
  can_view?: boolean;
  can_comment?: boolean;
};

type CampaignData = {
  campaign: {
    campaign_id: number;
    creator_id: string;
    title: string;
    status: string;
    url?: string | null;
    description_html: string;
    category?: string | null;
    location?: string | null;
    funding_goal_cents: number;
    duration_days?: number | null;
    backers: number;
  };
  viewer_permissions?: ViewerPermissions;
  rewards: Reward[];
  faqs: Faq[];
  photos: {
    photo_id?: number;
    image_url?: string;
    s3_bucket?: string;
    s3_key?: string;
    content_type?: string;
    is_primary?: boolean;
    sort_order?: number;
  }[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const MAX_DURATION_DAYS = 365;
const CATEGORY_OPTIONS = [
  "Art",
  "Comics",
  "Crafts",
  "Dance",
  "Design",
  "Fashion",
  "Film & Video",
  "Food",
  "Games",
  "Journalism",
  "Music",
  "Photography",
  "Publishing",
  "Technology",
  "Theater",
];

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("cf_backend_token");
  if (!token || token === "undefined" || token === "null") return {};
  return { Authorization: `Bearer ${token}` };
}

function centsFromDollars(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "").trim();
  if (!cleaned) return 0;
  const [whole, frac = ""] = cleaned.split(".");
  return parseInt(whole || "0", 10) * 100 + parseInt((frac + "00").slice(0, 2), 10);
}

function formatStatusLabel(status: string) {
  if (!status) return "";
  return status
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isValidCategory(value: string) {
  return CATEGORY_OPTIONS.includes(value);
}

function getMissingRequiredFields(params: {
  title: string;
  descriptionHtml: string;
  category: string;
  location: string;
  goalAmount: string;
  durationDays: string;
}) {
  const missing: string[] = [];
  if (!params.title.trim()) missing.push("title");
  if (!params.descriptionHtml.trim()) missing.push("description");
  if (!params.category.trim() || !isValidCategory(params.category.trim())) missing.push("category");
  if (!params.location.trim()) missing.push("location");
  if (centsFromDollars(params.goalAmount) <= 0) missing.push("funding goal");
  const durationNum = Number(params.durationDays);
  if (
    !params.durationDays.trim() ||
    !Number.isInteger(durationNum) ||
    durationNum < 1 ||
    durationNum > MAX_DURATION_DAYS
  ) {
    missing.push("duration");
  }
  return missing;
}

export default function EditCampaignPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams<{ url: string }>();
  const url = params?.url;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [data, setData] = useState<CampaignData | null>(null);

  const [creatorId, setCreatorId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [status, setStatus] = useState("");
  const [photos, setPhotos] = useState<CampaignData["photos"]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviewUrls, setPendingPreviewUrls] = useState<string[]>([]);
  const [primaryMediaSelection, setPrimaryMediaSelection] = useState<{ kind: "existing" | "pending"; index: number } | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);

  useEffect(() => {
    if (!url) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/campaign-page/${url}`, {
          cache: "no-store",
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`Failed to load campaign: ${res.status}`);
        const data = (await res.json()) as CampaignData;
        setData(data);
        setCreatorId(data.campaign.creator_id);
        setTitle(data.campaign.title || "");
        setDescriptionHtml(data.campaign.description_html || "");
        setCategory(data.campaign.category || "");
        setLocation(data.campaign.location || "");
        setGoalAmount(String((data.campaign.funding_goal_cents || 0) / 100));
        setDurationDays(data.campaign.duration_days ? String(data.campaign.duration_days) : "");
        setStatus(data.campaign.status || "");
        setRewards((data.rewards || []).map((r, idx) => ({ ...r, display_order: idx, description: r.description || "" })));
        setFaqs((data.faqs || []).map((f, idx) => ({ ...f, display_order: idx })));
        setPhotos(data.photos || []);
        const existingPrimaryIndex = (data.photos || []).findIndex((p) => p.is_primary);
        setPrimaryMediaSelection(
          (data.photos || []).length > 0
            ? { kind: "existing", index: existingPrimaryIndex >= 0 ? existingPrimaryIndex : 0 }
            : null
        );
      } catch (e: any) {
        setError(e?.message || "Could not load campaign");
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  const viewerPermissions = data?.viewer_permissions;
  const isOwner = viewerPermissions?.is_owner ?? (!!user?.id && !!creatorId && user.id === creatorId);
  const isCollaborator = viewerPermissions?.is_collaborator ?? false;
  const notAllowed = !loading && data && !isOwner && !isCollaborator;

  const collaboratorRestricted = isCollaborator;
  const ownerLockedFields = (data?.campaign?.backers || 0) > 0;
  const hasBackers = ownerLockedFields || collaboratorRestricted;

  const addReward = () =>
    setRewards((prev) => [
      ...prev,
      { title: "", description: "", required_amount_cents: 0, limit_total: null, display_order: prev.length },
    ]);

  const updateReward = (idx: number, patch: Partial<Reward>) =>
    setRewards((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const removeReward = (idx: number) =>
    setRewards((prev) => prev.filter((_, i) => i !== idx).map((r, i) => ({ ...r, display_order: i })));

  const addFaq = () =>
    setFaqs((prev) => [...prev, { question: "", answer: "", display_order: prev.length }]);

  const updateFaq = (idx: number, patch: Partial<Faq>) =>
    setFaqs((prev) => prev.map((f, i) => (i === idx ? { ...f, ...patch } : f)));

  const removeFaq = (idx: number) =>
    setFaqs((prev) => prev.filter((_, i) => i !== idx).map((f, i) => ({ ...f, display_order: i })));

  const missingRequiredFields = useMemo(() => {
    return getMissingRequiredFields({
      title,
      descriptionHtml,
      category,
      location,
      goalAmount,
      durationDays,
    });
  }, [title, descriptionHtml, category, location, goalAmount, durationDays]);

  const canSave = missingRequiredFields.length === 0;
  const durationNumber = Number(durationDays);
  const durationError =
    durationDays.trim() &&
    (!Number.isInteger(durationNumber) || durationNumber < 1 || durationNumber > MAX_DURATION_DAYS)
      ? `Duration must be a whole number between 1 and ${MAX_DURATION_DAYS} days.`
      : "";

  const isDraft = status === "draft";

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files).filter((f) => {
      const t = f.type;
      if (t.startsWith("image/") || t.startsWith("video/")) return true;
      if (!t && /\.(jpe?g|png|gif|webp|mp4|webm|mov)$/i.test(f.name)) return true;
      return false;
    });
    if (incoming.length === 0) return;

    const remaining = Math.max(0, 8 - (photos.length + pendingFiles.length));
    if (remaining <= 0) return;

    const accepted = incoming.slice(0, remaining);
    setPendingFiles((prev) => [...prev, ...accepted]);
    setPendingPreviewUrls((prev) => [...prev, ...accepted.map((f) => URL.createObjectURL(f))]);
  }

  function removeExistingPhoto(idx: number) {
    setPhotos((prev) => {
      const next = prev.filter((_, i) => i !== idx).map((p, i) => ({ ...p, sort_order: i }));
      setPrimaryMediaSelection((current) => {
        if (!next.length) {
          return pendingFiles.length > 0 ? { kind: "pending", index: 0 } : null;
        }
        if (!current) return { kind: "existing", index: 0 };
        if (current.kind === "existing") {
          if (current.index === idx) return { kind: "existing", index: 0 };
          if (current.index > idx) return { kind: "existing", index: current.index - 1 };
        }
        return current;
      });
      return next;
    });
  }

  function removePendingPhoto(idx: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
    setPendingPreviewUrls((prev) => {
      const url = prev[idx];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== idx);
    });
    setPrimaryMediaSelection((current) => {
      const nextPendingCount = pendingFiles.length - 1;
      if (!current) {
        if (photos.length > 0) return { kind: "existing", index: 0 };
        return nextPendingCount > 0 ? { kind: "pending", index: 0 } : null;
      }
      if (current.kind === "pending") {
        if (current.index === idx) {
          if (photos.length > 0) return { kind: "existing", index: 0 };
          return nextPendingCount > 0 ? { kind: "pending", index: 0 } : null;
        }
        if (current.index > idx) return { kind: "pending", index: current.index - 1 };
      }
      return current;
    });
  }

  function handleSetPrimary(kind: "existing" | "pending", index: number) {
    setPrimaryMediaSelection({ kind, index });
  }

  function getPrimaryFlags(existingCount: number, pendingCount: number) {
    let existingPrimaryIndex = -1;
    let pendingPrimaryIndex = -1;

    if (primaryMediaSelection?.kind === "existing" && primaryMediaSelection.index < existingCount) {
      existingPrimaryIndex = primaryMediaSelection.index;
    } else if (primaryMediaSelection?.kind === "pending" && primaryMediaSelection.index < pendingCount) {
      pendingPrimaryIndex = primaryMediaSelection.index;
    } else if (existingCount > 0) {
      existingPrimaryIndex = 0;
    } else if (pendingCount > 0) {
      pendingPrimaryIndex = 0;
    }

    return { existingPrimaryIndex, pendingPrimaryIndex };
  }

  async function handleDeleteDraft() {
    if (!url || !isDraft || !isOwner) return;
    const confirmed = window.confirm("Delete this draft campaign? This cannot be undone.");
    if (!confirmed) return;

    try {
      setSaveError(null);
      if (!canSave) throw new Error("One or more required fields are missing values.");
      if (durationError) throw new Error(durationError);
      setSaving(true);
      const res = await fetch(`${API_BASE}/api/campaign-page/${url}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to delete draft: ${res.status}`);
      }
      router.push("/");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Could not delete draft.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    if (!url || !canSave) return;
    try {
      setSaving(true);

      const token = typeof window !== "undefined" ? localStorage.getItem("cf_backend_token") : null;
      if (!token || token === "undefined" || token === "null") {
        throw new Error("Please sign in again and try once more.");
      }

      const campaignId = Number(params?.url) ? Number(params?.url) : data?.campaign?.campaign_id;
      const resolvedCampaignId = campaignId || 0;
      if (!resolvedCampaignId) {
        throw new Error("Campaign ID missing.");
      }

      const uploadedPhotos = pendingFiles.length
        ? await uploadCampaignFilesToS3(resolvedCampaignId, pendingFiles, token)
        : [];

      const uploadedPhotoPayload = photosPayloadForApi(uploadedPhotos);
      const { existingPrimaryIndex, pendingPrimaryIndex } = getPrimaryFlags(
        photos.length,
        uploadedPhotoPayload.length
      );

      const mergedPhotos = [
        ...photos.map((p, idx) => ({
          s3_bucket: p.s3_bucket || "",
          s3_key: p.s3_key || "",
          content_type: p.content_type || "image/jpeg",
          is_primary: idx === existingPrimaryIndex,
          sort_order: idx,
        })),
        ...uploadedPhotoPayload.map((p, idx) => ({
          ...p,
          is_primary: idx === pendingPrimaryIndex,
          sort_order: photos.length + idx,
        })),
      ].map((p, idx) => ({
        ...p,
        is_primary: p.is_primary || (existingPrimaryIndex < 0 && pendingPrimaryIndex < 0 && idx === 0),
        sort_order: idx,
      }));

      const res = await fetch(`${API_BASE}/api/campaign-page/${url}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          title: hasBackers ? (data?.campaign.title || "").trim() : title.trim(),
          description_html: descriptionHtml,
          category: hasBackers ? data?.campaign.category || null : category.trim() || null,
          location: hasBackers ? data?.campaign.location || null : location.trim() || null,
          funding_goal_cents: hasBackers ? data?.campaign.funding_goal_cents || 0 : centsFromDollars(goalAmount),
          duration_days: hasBackers ? data?.campaign.duration_days ?? null : durationDays ? Number(durationDays) : null,
          rewards: rewards
            .filter((r) => r.title.trim() && r.required_amount_cents > 0)
            .map((r, idx) => ({
              title: r.title.trim(),
              description: r.description?.trim() || null,
              required_amount_cents: r.required_amount_cents,
              limit_total: r.limit_total || null,
              display_order: idx,
            })),
          faqs: faqs
            .filter((f) => f.question.trim() && f.answer.trim())
            .map((f, idx) => ({
              question: f.question.trim(),
              answer: f.answer.trim(),
              display_order: idx,
            })),
          photos: mergedPhotos,
        }),
      });
      if (!res.ok) {
        let message = `Failed to save: ${res.status}`;
        try {
          const errJson = await res.json();
          if (typeof errJson?.detail === "string" && errJson.detail.trim()) {
            message = errJson.detail;
          }
        } catch {
          try {
            const text = await res.text();
            if (text) message = text;
          } catch {}
        }
        throw new Error(message);
      }

      pendingPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      router.push(`/project/${url}`);
    } catch (e: any) {
      setSaveError(e?.message || "Could not save campaign.");
      alert(e?.message || "Could not save campaign.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Edit Campaign</h1>
            <p className="text-gray-600 mt-2">Update your campaign basics, story, rewards, and FAQs in one place.</p>
          </div>
          <Link href={url ? `/project/${url}` : "#"} className="text-sm text-[#8BC34A] hover:underline">
            Back to campaign
          </Link>
        </div>

        {loading && <p className="text-gray-600">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {notAllowed && <p className="text-red-600">You do not have permission to edit this campaign.</p>}

        {!loading && !error && !notAllowed && (
          <div className="space-y-8">
            {isDraft && !isCollaborator && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm text-sky-900">
                This campaign is currently a draft. To continue editing and posting your campaign, we suggest editing through the{" "}
                <Link href="/drafts" className="font-medium text-sky-700 underline hover:text-sky-800">
                  Drafts page
                </Link>
                .
              </div>
            )}

            {collaboratorRestricted && (
              <div className="rounded-2xl border border-violet-200 bg-violet-50 px-5 py-4 text-sm text-violet-900">
                As a collaborator, you are seeing a limited version of this page. Ask the campaign owner if you would like to make any additional changes. (You will only be able to save changes if the campaign owner has filled out the Campaign Title, Category, Location, Funding Goal, and Duration.)
              </div>
            )}

            {!collaboratorRestricted && ownerLockedFields && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
                Because backers have contributed to your campaign, you are no longer able to edit the title, category, location, funding goal, or duration.
              </div>
            )}

            <div className="rounded-2xl border border-gray-200 p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={hasBackers}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <input
                    value={formatStatusLabel(status)}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={hasBackers}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a category</option>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {!category || !isValidCategory(category) ? (
                    <p className="mt-2 text-sm text-gray-500">Please choose one of the listed categories.</p>
                  ) : null}
                </div>
                <div>
                  <div className={hasBackers ? "pointer-events-none opacity-70" : ""}>
                    <LocationAutocomplete value={location} onChange={(value) => setLocation(value)} />
                  </div>
                  {!location.trim() ? <p className="mt-2 text-sm text-gray-500">Please choose a city.</p> : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Goal (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    disabled={hasBackers}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value.replace(/[^0-9]/g, ""))}
                    disabled={hasBackers}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                  {durationError ? <p className="mt-2 text-sm text-red-600">{durationError}</p> : null}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={descriptionHtml}
                onChange={(e) => setDescriptionHtml(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A]"
              />
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Rewards</h2>
                <button type="button" onClick={addReward} className="px-4 py-2 bg-[#8BC34A] text-white rounded-lg">
                  Add reward
                </button>
              </div>
              <div className="space-y-4">
                {rewards.length === 0 && <p className="text-sm text-gray-500">No rewards yet.</p>}
                {rewards.map((reward, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        value={reward.title}
                        onChange={(e) => updateReward(idx, { title: e.target.value })}
                        placeholder="Reward title"
                        className="px-4 py-3 border border-gray-200 rounded-lg"
                      />
                      <input
                        value={reward.required_amount_cents ? String(reward.required_amount_cents / 100) : ""}
                        onChange={(e) => updateReward(idx, { required_amount_cents: centsFromDollars(e.target.value) })}
                        placeholder="Amount in USD"
                        className="px-4 py-3 border border-gray-200 rounded-lg"
                      />
                      <textarea
                        value={reward.description || ""}
                        onChange={(e) => updateReward(idx, { description: e.target.value })}
                        placeholder="Reward description (required)"
                        rows={3}
                        className="md:col-span-2 px-4 py-3 border border-gray-200 rounded-lg"
                      />
                      <input
                        value={reward.limit_total || ""}
                        onChange={(e) =>
                          updateReward(idx, {
                            limit_total: e.target.value ? Number(e.target.value.replace(/[^0-9]/g, "")) : null,
                          })
                        }
                        placeholder="Limit (optional)"
                        className="px-4 py-3 border border-gray-200 rounded-lg"
                      />
                    </div>
                    <button type="button" onClick={() => removeReward(idx)} className="mt-3 text-sm text-red-600 hover:underline">
                      Remove reward
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">FAQs</h2>
                <button type="button" onClick={addFaq} className="px-4 py-2 bg-[#8BC34A] text-white rounded-lg">
                  Add FAQ
                </button>
              </div>
              <div className="space-y-4">
                {faqs.length === 0 && <p className="text-sm text-gray-500">No FAQs yet.</p>}
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-4">
                    <input
                      value={faq.question}
                      onChange={(e) => updateFaq(idx, { question: e.target.value })}
                      placeholder="Question"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-3"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(idx, { answer: e.target.value })}
                      placeholder="Answer"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                    />
                    <button type="button" onClick={() => removeFaq(idx)} className="mt-3 text-sm text-red-600 hover:underline">
                      Remove FAQ
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Campaign Media</h2>
                <label className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  Add Images / Videos
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      addFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              {photos.length === 0 && pendingPreviewUrls.length === 0 ? (
                <p className="text-sm text-gray-500">No photos uploaded for this campaign yet.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, idx) => {
                    const displayUrl = displayUrlForPhoto(photo as any);
                    const isVideo = isVideoContentType(photo.content_type);
                    return (
                      <div key={`existing-${photo.photo_id ?? idx}`} className="relative">
                        {isVideo ? (
                          <video src={displayUrl} controls className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                        ) : (
                          <img src={displayUrl} alt="Campaign" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                        )}
                        {primaryMediaSelection?.kind === "existing" && primaryMediaSelection.index === idx && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-xs font-medium text-gray-700 border border-gray-200">
                            Cover
                          </span>
                        )}
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSetPrimary("existing", idx)}
                            className="px-2 py-1 rounded-md bg-white/90 border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
                          >
                            {primaryMediaSelection?.kind === "existing" && primaryMediaSelection.index === idx ? "Primary" : "Set primary"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExistingPhoto(idx)}
                            className="px-2 py-1 rounded-md bg-white/90 border border-gray-200 text-xs text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {pendingPreviewUrls.map((previewUrl, idx) => {
                    const file = pendingFiles[idx];
                    const isVideo = !!file && isVideoContentType(file.type);
                    return (
                      <div key={`pending-${idx}`} className="relative">
                        {isVideo ? (
                          <video src={previewUrl} controls className="w-full h-32 object-cover rounded-xl border border-dashed border-gray-300" />
                        ) : (
                          <img src={previewUrl} alt="New upload" className="w-full h-32 object-cover rounded-xl border border-dashed border-gray-300" />
                        )}
                        <div className="absolute top-2 left-2 flex gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-white/90 text-xs font-medium text-gray-700 border border-gray-200">
                            New
                          </span>
                          {primaryMediaSelection?.kind === "pending" && primaryMediaSelection.index === idx && (
                            <span className="px-2 py-0.5 rounded-full bg-white/90 text-xs font-medium text-gray-700 border border-gray-200">
                              Cover
                            </span>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSetPrimary("pending", idx)}
                            className="px-2 py-1 rounded-md bg-white/90 border border-gray-200 text-xs text-gray-700 hover:bg-gray-50"
                          >
                            {primaryMediaSelection?.kind === "pending" && primaryMediaSelection.index === idx ? "Primary" : "Set primary"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removePendingPhoto(idx)}
                            className="px-2 py-1 rounded-md bg-white/90 border border-gray-200 text-xs text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">Choose which photo or video should be the primary cover for your campaign.</p>
            </div>

            {saveError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</div>
            ) : null}

            <div className="flex justify-between gap-3">
              <div>
                {isDraft && isOwner && (
                  <button
                    type="button"
                    onClick={handleDeleteDraft}
                    disabled={saving}
                    className="px-6 py-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete Draft
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <Link href={url ? `/project/${url}` : "#"} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Cancel
                </Link>
                <button
                  onClick={handleSave}
                  disabled={!canSave || saving}
                  title={!canSave ? "One or more required fields are missing values." : undefined}
                  className="px-8 py-3 bg-[#8BC34A] text-white rounded-lg font-medium hover:bg-[#7CB342] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
