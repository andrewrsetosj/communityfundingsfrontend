"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const PRESET_AMOUNTS = ["10", "25", "50", "100"];

const RECOMMENDED_PROJECTS = [
  { id: 1, image: "photo-1558618666-fcd25c85cd64", title: "Handcrafted Ceramic Pottery Collection", creator: "SARAH CHEN" },
  { id: 2, image: "photo-1493225457124-a3eb161ffa5f", title: "Independent Music Album: Echoes of Tomorrow", creator: "THE MIDNIGHT COLLECTIVE" },
  { id: 3, image: "photo-1511632765486-a01980e01a18", title: "Community Garden Initiative for Urban Schools", creator: "GREEN FUTURES" },
  { id: 4, image: "photo-1469474968028-56623f02e42e", title: "Documentary: Voices of the Mountains", creator: "WILD LENS FILMS" },
];

const COMMENT_MAX_LENGTH = 2000;

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  goal_amount: number;
  raised_amount: number;
  donors_count: number;
  status: string;
  creator_id: string;
  creator_name: string | null;
  category: string | null;
  location: string | null;
  funding_percentage: number;
  days_left: number | null;
  image_url: string | null;
  video_url: string | null;
  is_featured: boolean;
  created_at: string;
}

interface CommentData {
  id: string;
  campaign_id: string;
  user_id: string;
  user_name: string | null;
  user_avatar: string | null;
  content: string;
  created_at: string;
}

// ═══════════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════════

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cf_backend_token");
}

function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function isAuthenticated(): boolean {
  return !!getAuthToken();
}

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 5) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ═══════════════════════════════════════════════════════════════
// Comments Section Component
// ═══════════════════════════════════════════════════════════════

function CommentsSection({ campaignId }: { campaignId: string }) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get the current user ID from the JWT for ownership checks
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.sub || null);
      } catch {
        setCurrentUserId(null);
      }
    }
  }, []);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      setLoadError("");
      const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/comments?limit=50`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data: CommentData[] = await res.json();
      setComments(data);
    } catch (err: unknown) {
      setLoadError(err instanceof Error ? err.message : "Could not load comments");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (campaignId) fetchComments();
  }, [campaignId, fetchComments]);

  // Post comment
  const handlePostComment = async () => {
    const content = newComment.trim();
    if (!content || content.length > COMMENT_MAX_LENGTH) return;

    if (!isAuthenticated()) {
      setPostError("Please sign in to comment.");
      return;
    }

    setPosting(true);
    setPostError("");

    try {
      const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/comments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: "Failed to post comment" }));
        throw new Error(errData.detail || "Failed to post comment");
      }

      const posted: CommentData = await res.json();
      setComments((prev) => [posted, ...prev]);
      setNewComment("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (err: unknown) {
      setPostError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    setDeletingId(commentId);

    try {
      const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/comments/${commentId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: "Failed to delete" }));
        throw new Error(errData.detail || "Failed to delete comment");
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const charCount = newComment.length;
  const isOverLimit = charCount > COMMENT_MAX_LENGTH;
  const canPost = newComment.trim().length > 0 && !isOverLimit && !posting;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
          {comments.length}
        </span>
      </div>

      {/* Compose Box */}
      {isAuthenticated() ? (
        <div className="mb-8">
          <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#8BC34A] focus-within:ring-1 focus-within:ring-[#8BC34A] transition-all bg-white">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={handleTextareaChange}
              placeholder="Share your thoughts on this campaign..."
              rows={3}
              maxLength={COMMENT_MAX_LENGTH + 50}
              className="w-full px-4 pt-4 pb-2 resize-none focus:outline-none text-gray-800 placeholder:text-gray-400 text-sm"
            />
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50/50">
              <span
                className={`text-xs transition-colors ${
                  isOverLimit ? "text-red-500 font-medium" : charCount > COMMENT_MAX_LENGTH * 0.9 ? "text-amber-500" : "text-gray-400"
                }`}
              >
                {charCount}/{COMMENT_MAX_LENGTH}
              </span>
              <button
                onClick={handlePostComment}
                disabled={!canPost}
                className="bg-[#8BC34A] text-white px-5 py-1.5 rounded-full text-sm font-medium hover:bg-[#7CB342] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {posting ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Posting...
                  </span>
                ) : (
                  "Post Comment"
                )}
              </button>
            </div>
          </div>
          {postError && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {postError}
            </p>
          )}
        </div>
      ) : (
        <div className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-gray-600 text-sm mb-3">Sign in to join the conversation</p>
          <Link
            href="/sign-in"
            className="inline-flex items-center bg-[#8BC34A] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#7CB342] transition-colors"
          >
            Sign In to Comment
          </Link>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && loadError && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm mb-3">{loadError}</p>
          <button
            onClick={() => { setLoading(true); fetchComments(); }}
            className="text-[#8BC34A] text-sm font-medium hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !loadError && comments.length === 0 && (
        <div className="text-center py-10">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}

      {/* Comments List */}
      {!loading && !loadError && comments.length > 0 && (
        <div className="space-y-0 divide-y divide-gray-100">
          {comments.map((comment) => {
            const isOwn = currentUserId === comment.user_id;
            const isDeleting = deletingId === comment.id;

            return (
              <div
                key={comment.id}
                className={`py-4 first:pt-0 group transition-opacity ${isDeleting ? "opacity-40 pointer-events-none" : ""}`}
              >
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {comment.user_avatar ? (
                      <Image
                        src={comment.user_avatar}
                        alt={comment.user_name || "User"}
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8BC34A] to-[#689F38] flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {(comment.user_name || "U").charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {comment.user_name || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatRelativeTime(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line break-words leading-relaxed">
                      {comment.content}
                    </p>

                    {/* Delete action (own comment only) */}
                    {isOwn && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="mt-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════

export default function ProjectDetail() {
  const router = useRouter();
  const params = useParams();
  const campaignIdOrSlug = params.id as string;

  // Campaign data from API
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Donation form state
  const [pledgeAmount, setPledgeAmount] = useState("10");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donating, setDonating] = useState(false);
  const [donateError, setDonateError] = useState("");

  // Load campaign from backend
  useEffect(() => {
    if (!campaignIdOrSlug) return;
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/campaigns/${campaignIdOrSlug}`);
        if (!res.ok) throw new Error("Campaign not found");
        const data = await res.json();
        setCampaign(data);
      } catch (err: unknown) {
        setFetchError(err instanceof Error ? err.message : "Failed to load campaign");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [campaignIdOrSlug]);

  // Handle Stripe Checkout
  const handleBackProject = async (amount?: string) => {
    if (!campaign) return;
    const finalAmount = parseFloat(amount || pledgeAmount);
    if (!finalAmount || finalAmount <= 0) {
      setDonateError("Please enter a valid amount");
      return;
    }
    setDonating(true);
    setDonateError("");

    try {
      const res = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_id: campaign.id,
          amount: finalAmount,
          donor_name: isAnonymous ? "Anonymous" : donorName || "Anonymous",
          donor_email: donorEmail || undefined,
          is_anonymous: isAnonymous,
          message: donorMessage || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Payment failed" }));
        throw new Error(err.detail || "Payment failed");
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: unknown) {
      setDonateError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setDonating(false);
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8BC34A]" />
        </div>
      </div>
    );
  }

  // ── Error / not found state ──
  if (!campaign) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-32">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-6">{fetchError || "This campaign does not exist."}</p>
          <Link href="/" className="text-[#8BC34A] hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  // ── Computed values ──
  const isActive = campaign.status === "active";
  const progressPercent = Math.min(campaign.funding_percentage, 100);
  const heroImage = campaign.image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800";

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-[#8BC34A] hover:text-[#7CB342] transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Project Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {campaign.title.toUpperCase()}
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          {campaign.short_description || campaign.description.slice(0, 250)}
        </p>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Media */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Image
                src={heroImage}
                alt={campaign.title}
                fill
                className="object-cover"
                unoptimized={!heroImage.includes("unsplash.com")}
              />
              {campaign.video_url && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <a
                    href={campaign.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 bg-[#8BC34A]/90 rounded-full flex items-center justify-center hover:bg-[#8BC34A] transition-colors"
                  >
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </a>
                </div>
              )}
            </div>

            {/* Creator + Category info */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {campaign.creator_name && (
                <span>
                  By: <span className="font-medium text-gray-700">{campaign.creator_name}</span>
                </span>
              )}
              {campaign.category && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                  {campaign.category}
                </span>
              )}
              {campaign.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {campaign.location}
                </span>
              )}
            </div>
          </div>

          {/* Right Column - Funding Info & Donation Form */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-xl p-6 sticky top-8">
              {/* Raised Amount */}
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">
                  ${campaign.raised_amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-gray-500">
                  raised of ${campaign.goal_amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} goal
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-[#8BC34A] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between text-sm mb-6">
                <span className="font-medium text-[#8BC34A]">{campaign.funding_percentage}% funded</span>
                <div className="flex items-center gap-4 text-gray-500">
                  <span>{campaign.donors_count} donors</span>
                  {campaign.days_left !== null && <span>{campaign.days_left} days left</span>}
                </div>
              </div>

              {/* Donation Form (only if campaign is active) */}
              {isActive ? (
                <div>
                  {/* Preset Amounts */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setPledgeAmount(amt)}
                        className={`py-2 rounded-lg text-sm font-medium transition-colors border ${
                          pledgeAmount === amt
                            ? "bg-[#8BC34A] text-white border-[#8BC34A]"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#8BC34A]"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="relative mb-3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={pledgeAmount}
                      onChange={(e) => setPledgeAmount(e.target.value)}
                      placeholder="Custom amount"
                      className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8BC34A] focus:border-[#8BC34A]"
                    />
                  </div>

                  {/* Donor Name */}
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Your name (optional)"
                    disabled={isAnonymous}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8BC34A] focus:border-[#8BC34A] mb-3 disabled:bg-gray-50 disabled:text-gray-400"
                  />

                  {/* Donor Email */}
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="Email for receipt (optional)"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8BC34A] focus:border-[#8BC34A] mb-3"
                  />

                  {/* Message */}
                  <textarea
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    placeholder="Leave a message of support (optional)"
                    rows={2}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#8BC34A] focus:border-[#8BC34A] mb-3 resize-none"
                  />

                  {/* Anonymous toggle */}
                  <label className="flex items-center gap-2 text-xs text-gray-600 mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-[#8BC34A] focus:ring-[#8BC34A]"
                    />
                    Donate anonymously
                  </label>

                  {/* Error */}
                  {donateError && (
                    <p className="text-xs text-red-600 mb-3">{donateError}</p>
                  )}

                  {/* Pledge Button */}
                  <button
                    onClick={() => handleBackProject()}
                    disabled={donating || !pledgeAmount || parseFloat(pledgeAmount) <= 0}
                    className="w-full bg-[#8BC34A] text-white py-2.5 rounded-lg font-medium hover:bg-[#7CB342] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm mb-2"
                  >
                    {donating ? "Redirecting to Stripe..." : `Pledge $${pledgeAmount || "0"}`}
                  </button>

                  <p className="text-xs text-gray-500">
                    Secure payment via Stripe. Your support helps bring this
                    creative vision to life and supports independent creators.{" "}
                    <Link href="#" className="text-[#8BC34A] hover:underline">
                      Learn More
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    This campaign is no longer accepting donations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Story Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Story</h2>
          <div className="text-gray-600 mb-8 max-w-3xl whitespace-pre-line">
            {campaign.description}
          </div>

          {campaign.image_url && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="relative aspect-[3/4] max-w-sm rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={campaign.image_url}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex items-start">
                <div className="w-24 h-24 rounded-full bg-[#8BC34A] opacity-80" />
              </div>
            </div>
          )}

          <button className="px-6 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Report this project to CF
          </button>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* Comments Section — wired to backend                       */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <CommentsSection campaignId={campaign.id} />

        {/* We Also Recommend */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            We Also Recommend
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RECOMMENDED_PROJECTS.map((project) => (
              <Link key={project.id} href={`/project/${project.id}`} className="group cursor-pointer block">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 mb-3">
                  <Image
                    src={`https://images.unsplash.com/${project.image}?w=400`}
                    alt="Project thumbnail"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    78% funded · By:{" "}
                    <span className="font-semibold text-gray-700">{project.creator}</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Raised: <span className="font-medium">$12,450</span>
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span className="flex items-center hover:text-[#8BC34A] transition-colors">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Save
                    </span>
                    <span className="flex items-center hover:text-[#8BC34A] transition-colors">
                      <span className="mr-1">$</span>
                      Fund
                    </span>
                    <span className="flex items-center hover:text-[#8BC34A] transition-colors">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Skip
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Link
              href="/projects-we-love"
              className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              View More
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-[#8BC34A] font-bold tracking-widest text-sm uppercase">
                Community Fundings
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">About</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">About Us</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">Our Charter</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">Stats</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">Press</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Support</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">Help Center</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">Our Rules</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">Creator Resources</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">Brand Assets</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">More</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">Newsletter</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">Community Guidelines</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">Privacy Policy</p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">Terms of Use</p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; 2011-2026 Community Fundings, PBC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}