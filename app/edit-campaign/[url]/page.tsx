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
  };
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

function getAuthHeaders(): Record<string,string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("cf_backend_token");
  if (!token || token === "undefined" || token === "null") return {};
  return { Authorization: `Bearer ${token}` };
}

function centsFromDollars(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "").trim();
  if (!cleaned) return 0;
  const [whole, frac = ""] = cleaned.split(".");
  return (parseInt(whole || "0", 10) * 100) + parseInt((frac + "00").slice(0,2), 10);
}

function formatStatusLabel(status: string) {
  if (!status) return "";
  return status
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function EditCampaignPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams<{ url: string }>();
  const url = params?.url;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        const data = await res.json() as CampaignData;
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
      } catch (e:any) {
        setError(e?.message || "Could not load campaign");
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  const notOwner = !!user?.id && !!creatorId && user.id !== creatorId;

  const addReward = () => setRewards((prev) => [...prev, { title: "", description: "", required_amount_cents: 0, limit_total: null, display_order: prev.length }]);
  const updateReward = (idx:number, patch: Partial<Reward>) => setRewards((prev) => prev.map((r,i) => i===idx ? { ...r, ...patch } : r));
  const removeReward = (idx:number) => setRewards((prev) => prev.filter((_,i)=>i!==idx).map((r,i)=>({ ...r, display_order:i })));

  const addFaq = () => setFaqs((prev) => [...prev, { question: "", answer: "", display_order: prev.length }]);
  const updateFaq = (idx:number, patch: Partial<Faq>) => setFaqs((prev) => prev.map((f,i) => i===idx ? { ...f, ...patch } : f));
  const removeFaq = (idx:number) => setFaqs((prev) => prev.filter((_,i)=>i!==idx).map((f,i)=>({ ...f, display_order:i })));

  const canSave = useMemo(() => {
    return !!title.trim() && !!descriptionHtml.trim() && centsFromDollars(goalAmount) > 0;
  }, [title, descriptionHtml, goalAmount]);

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
    setPhotos((prev) => prev.filter((_, i) => i !== idx).map((p, i) => ({ ...p, sort_order: i, is_primary: i === 0 })));
  }

  function removePendingPhoto(idx: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
    setPendingPreviewUrls((prev) => {
      const url = prev[idx];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== idx);
    });
  }

  async function handleDeleteDraft() {
    if (!url || !isDraft) return;
    const confirmed = window.confirm("Delete this draft campaign? This cannot be undone.");
    if (!confirmed) return;

    try {
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

      const mergedPhotos = [
        ...photos.map((p, idx) => ({
          s3_bucket: p.s3_bucket || "",
          s3_key: p.s3_key || "",
          content_type: p.content_type || "image/jpeg",
          is_primary: idx === 0,
          sort_order: idx,
        })),
        ...photosPayloadForApi(uploadedPhotos).map((p, idx) => ({
          ...p,
          is_primary: false,
          sort_order: photos.length + idx,
        })),
      ].map((p, idx) => ({
        ...p,
        is_primary: idx === 0,
        sort_order: idx,
      }));

      const res = await fetch(`${API_BASE}/api/campaign-page/${url}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          title: title.trim(),
          description_html: descriptionHtml,
          category: category.trim() || null,
          location: location.trim() || null,
          funding_goal_cents: centsFromDollars(goalAmount),
          duration_days: durationDays ? Number(durationDays) : null,
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
            .map((f, idx) => ({ question: f.question.trim(), answer: f.answer.trim(), display_order: idx })),
          photos: mergedPhotos,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to save: ${res.status}`);
      }

      pendingPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
      router.push(`/project/${url}`);
    } catch (e:any) {
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
          <Link href={url ? `/project/${url}` : "#"} className="text-sm text-[#8BC34A] hover:underline">Back to campaign</Link>
        </div>

        {loading && <p className="text-gray-600">Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {notOwner && <p className="text-red-600">You can only edit your own campaign.</p>}

        {!loading && !error && !notOwner && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-gray-200 p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                  <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <input value={formatStatusLabel(status)} disabled className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input value={location} onChange={(e)=>setLocation(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Funding Goal (USD)</label>
                  <input value={goalAmount} onChange={(e)=>setGoalAmount(e.target.value)} inputMode="decimal" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                  <input value={durationDays} onChange={(e)=>setDurationDays(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A]" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white">
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
              <textarea value={descriptionHtml} onChange={(e)=>setDescriptionHtml(e.target.value)} rows={8} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#8BC34A]" />
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Rewards</h2>
                <button type="button" onClick={addReward} className="px-4 py-2 bg-[#8BC34A] text-white rounded-lg">Add reward</button>
              </div>
              <div className="space-y-4">
                {rewards.length === 0 && <p className="text-sm text-gray-500">No rewards yet.</p>}
                {rewards.map((reward, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input value={reward.title} onChange={(e)=>updateReward(idx, { title: e.target.value })} placeholder="Reward title" className="px-4 py-3 border border-gray-200 rounded-lg" />
                      <input value={reward.required_amount_cents ? String(reward.required_amount_cents / 100) : ""} onChange={(e)=>updateReward(idx, { required_amount_cents: centsFromDollars(e.target.value) })} placeholder="Amount in USD" className="px-4 py-3 border border-gray-200 rounded-lg" />
                      <textarea value={reward.description || ""} onChange={(e)=>updateReward(idx, { description: e.target.value })} placeholder="Reward description" rows={3} className="md:col-span-2 px-4 py-3 border border-gray-200 rounded-lg" />
                      <input value={reward.limit_total || ""} onChange={(e)=>updateReward(idx, { limit_total: e.target.value ? Number(e.target.value.replace(/[^0-9]/g, "")) : null })} placeholder="Limit (optional)" className="px-4 py-3 border border-gray-200 rounded-lg" />
                    </div>
                    <button type="button" onClick={()=>removeReward(idx)} className="mt-3 text-sm text-red-600 hover:underline">Remove reward</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">FAQs</h2>
                <button type="button" onClick={addFaq} className="px-4 py-2 bg-[#8BC34A] text-white rounded-lg">Add FAQ</button>
              </div>
              <div className="space-y-4">
                {faqs.length === 0 && <p className="text-sm text-gray-500">No FAQs yet.</p>}
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-4">
                    <input value={faq.question} onChange={(e)=>updateFaq(idx, { question: e.target.value })} placeholder="Question" className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-3" />
                    <textarea value={faq.answer} onChange={(e)=>updateFaq(idx, { answer: e.target.value })} placeholder="Answer" rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
                    <button type="button" onClick={()=>removeFaq(idx)} className="mt-3 text-sm text-red-600 hover:underline">Remove FAQ</button>
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
                        {idx === 0 && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-xs font-medium text-gray-700 border border-gray-200">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(idx)}
                          className="absolute top-2 right-2 px-2 py-1 rounded-md bg-white/90 border border-gray-200 text-xs text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
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
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-xs font-medium text-gray-700 border border-gray-200">
                          New
                        </span>
                        <button
                          type="button"
                          onClick={() => removePendingPhoto(idx)}
                          className="absolute top-2 right-2 px-2 py-1 rounded-md bg-white/90 border border-gray-200 text-xs text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-xs text-gray-500 mt-3">The first item will be used as the cover image.</p>
            </div>

            <div className="flex justify-between gap-3">
              <div>
                {isDraft && (
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
                <Link href={url ? `/project/${url}` : "#"} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</Link>
                <button onClick={handleSave} disabled={!canSave || saving} className="px-8 py-3 bg-[#8BC34A] text-white rounded-lg font-medium hover:bg-[#7CB342] disabled:opacity-50">
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
