"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

type Campaign = {
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
};

type Creator = {
  creator_id: string;
  name: string;
  last_name: string;
  email: string;
  bio?: string;
};

type Faq = {
  question: string;
  answer: string;
  display_order?: number;
};

type Reward = {
  reward_id: number;
  title: string;
  description_html: string;
  required_amount_cents: number;
};

type Comment = {
  comment_id: number;
  comment_text: string;
  creator_id: string;
  campaign_id: number;
  parent_comment_id?: number | null;
  name?: string;
  last_name?: string;
  time_created: string;
  replies: Comment[];
  reply_count: number;
  has_more_replies: boolean;
  is_you: boolean;
  is_friend: boolean;
  is_project_owner: boolean;
};

type Photo = {
  photo_id: number;
  campaign_id: number;
  s3_bucket: string;
  s3_key: string;
  content_type: string;
  is_primary: boolean;
  image_url: string;
};

type CommentsPagination = {
  page: number;
  per_page: number;
  total_parent_comments: number;
  total_pages: number;
};

type CampaignPageData = {
  campaign: Campaign;
  creator: Creator | null;
  faqs: Faq[];
  rewards: Reward[];
  photos: Photo[];
  comments: Comment[];
  comments_pagination: CommentsPagination;
};

const COMMENT_MAX_LENGTH = 1000;

const recommendedProjects = [
  { id: 1, image: "photo-1558618666-fcd25c85cd64", title: "Handcrafted Ceramic Pottery Collection", creator: "SARAH CHEN" },
  { id: 2, image: "photo-1493225457124-a3eb161ffa5f", title: "Independent Music Album: Echoes of Tomorrow", creator: "THE MIDNIGHT COLLECTIVE" },
  { id: 3, image: "photo-1511632765486-a01980e01a18", title: "Community Garden Initiative for Urban Schools", creator: "GREEN FUTURES" },
  { id: 4, image: "photo-1469474968028-56623f02e42e", title: "Documentary: Voices of the Mountains", creator: "WILD LENS FILMS" },
];

function formatUSD(cents?: number) {
  if (typeof cents !== "number") return "";
  return (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function formatCommentDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCommentDateTime(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getCommentAuthor(comment: Comment) {
  return [comment.name, comment.last_name].filter(Boolean).join(" ").trim() || comment.creator_id || "Unknown User";
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("cf_backend_token");
  if (!token || token === "undefined" || token === "null") return {};
  return { Authorization: `Bearer ${token}` };
}

function CommentBadges({ comment }: { comment: Comment }) {
  return (
    <>
      {comment.is_you && (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
          You
        </span>
      )}

      {comment.is_friend && !comment.is_you && (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#F5F9F0] text-[#6E9E36] border border-[#8BC34A]/20">
          Friend
        </span>
      )}

      {comment.is_project_owner && (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          Project Owner
        </span>
      )}
    </>
  );
}

function CommentHeader({ comment, compact = false }: { comment: Comment; compact?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-1">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/profile/${comment.creator_id}`}
            className={`font-semibold text-gray-900 hover:text-[#8BC34A] transition-colors ${compact ? "text-sm" : ""}`}
          >
            {getCommentAuthor(comment)}
          </Link>
          <CommentBadges comment={comment} />
        </div>
        <Link
          href={`/profile/${comment.creator_id}`}
          className="text-xs text-gray-500 hover:text-[#8BC34A] transition-colors block w-fit"
        >
          {comment.creator_id}
        </Link>
      </div>

      <span
        title={formatCommentDateTime(comment.time_created)}
        className="text-xs text-gray-500 whitespace-nowrap cursor-default rounded-md border border-transparent hover:border-gray-200 hover:bg-gray-50 px-2 py-1 transition-colors"
      >
        {formatCommentDate(comment.time_created)}
      </span>
    </div>
  );
}

export default function ProjectDetail() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams<{ url: string }>();
  const url = params?.url;

  const [data, setData] = useState<CampaignPageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);

  const [commentPage, setCommentPage] = useState(1);
  const [loadingRepliesFor, setLoadingRepliesFor] = useState<number | null>(null);

  async function loadCampaignPage(targetPage: number) {
    if (!url) return;

    try {
      setError(null);
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const res = await fetch(`${API_BASE}/api/campaign-page/${url}?page=${targetPage}`, {
        cache: "no-store",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error(`Failed: ${res.status}`);

      const json = (await res.json()) as CampaignPageData;
      setData(json);
      setCommentPage(json.comments_pagination?.page ?? targetPage);
      setCurrentPhotoIndex(0);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    }
  }

  useEffect(() => {
    if (!url) return;
    loadCampaignPage(1);
  }, [url]);

  async function handleSubmitComment() {
    if (!url || !commentText.trim()) return;

    try {
      setIsCommentSubmitting(true);

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const res = await fetch(`${API_BASE}/api/campaign-page/${url}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          comment_text: commentText.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to post comment: ${res.status}`);
      }

      setCommentText("");
      await loadCampaignPage(1);
    } catch (err) {
      console.error(err);
      alert("Could not post comment.");
    } finally {
      setIsCommentSubmitting(false);
    }
  }

  async function handleSubmitReply(parentCommentId: number) {
    if (!url || !replyText.trim()) return;

    try {
      setIsReplySubmitting(true);

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const res = await fetch(`${API_BASE}/api/campaign-page/${url}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          comment_text: replyText.trim(),
          parent_comment_id: parentCommentId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to post reply: ${res.status}`);
      }

      const json = (await res.json()) as { comment: Comment };

      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          comments: prev.comments.map((comment) =>
            comment.comment_id === parentCommentId
              ? {
                  ...comment,
                  replies: [...comment.replies, json.comment],
                  reply_count: comment.reply_count + 1,
                  has_more_replies: comment.reply_count + 1 > [...comment.replies, json.comment].length,
                }
              : comment
          ),
        };
      });

      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      console.error(err);
      alert("Could not post reply.");
    } finally {
      setIsReplySubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: number) {
    if (!url) return;

    const confirmed = window.confirm("Are you sure you want to delete your comment?");
    if (!confirmed) return;

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const res = await fetch(
        `${API_BASE}/api/campaign-page/${url}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to delete comment: ${res.status}`);
      }

      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          comments: prev.comments
            .filter((comment) => comment.comment_id !== commentId)
            .map((comment) => {
              const deletedWasReply = comment.replies.some((reply) => reply.comment_id === commentId);
              const updatedReplies = comment.replies.filter((reply) => reply.comment_id !== commentId);
              const updatedReplyCount = deletedWasReply
                ? Math.max(0, comment.reply_count - 1)
                : comment.reply_count;

              return {
                ...comment,
                replies: updatedReplies,
                reply_count: updatedReplyCount,
                has_more_replies: updatedReplyCount > updatedReplies.length,
              };
            }),
        };
      });
    } catch (err) {
      console.error(err);
      alert("Could not delete comment.");
    }
  }

  async function handleLoadMoreReplies(parentCommentId: number) {
    if (!url) return;

    try {
      setLoadingRepliesFor(parentCommentId);

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const res = await fetch(
        `${API_BASE}/api/campaign-page/${url}/comments/${parentCommentId}/replies`,
        {
          cache: "no-store",
          headers: getAuthHeaders(),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to load replies: ${res.status}`);
      }

      const json = (await res.json()) as { comment_id: number; replies: Comment[] };

      setData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          comments: prev.comments.map((comment) =>
            comment.comment_id === parentCommentId
              ? {
                  ...comment,
                  replies: json.replies,
                  has_more_replies: false,
                }
              : comment
          ),
        };
      });
    } catch (err) {
      console.error(err);
      alert("Could not load replies.");
    } finally {
      setLoadingRepliesFor(null);
    }
  }

  function handleCollapseReplies(parentCommentId: number) {
    setData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        comments: prev.comments.map((comment) =>
          comment.comment_id === parentCommentId
            ? {
                ...comment,
                replies: comment.replies.slice(0, 5),
                has_more_replies: comment.reply_count > 5,
              }
            : comment
        ),
      };
    });
  }

  const campaign = data?.campaign;
  const creator = data?.creator;

  const isOwnCreatorProfile =
    !!user?.id && !!creator?.creator_id && user.id === creator.creator_id;

  const creatorImage = isOwnCreatorProfile && user?.imageUrl ? user.imageUrl : null;

  const creatorFullName = creator
    ? [creator.name, creator.last_name].filter(Boolean).join(" ").trim()
    : "Unknown";

  const creatorInitial =
    creator?.name?.[0]?.toUpperCase() ||
    creator?.last_name?.[0]?.toUpperCase() ||
    "U";

  const currentPhoto = data?.photos?.[currentPhotoIndex];
  const heroIsVideo =
    (currentPhoto?.content_type ?? "").toLowerCase().startsWith("video/");
  const heroImage =
    currentPhoto?.image_url ??
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800";

  const totalPhotos = data?.photos?.length ?? 0;

  const goToPrevPhoto = () => {
    if (!totalPhotos) return;
    setCurrentPhotoIndex((prev) => (prev === 0 ? totalPhotos - 1 : prev - 1));
  };

  const goToNextPhoto = () => {
    if (!totalPhotos) return;
    setCurrentPhotoIndex((prev) => (prev === totalPhotos - 1 ? 0 : prev + 1));
  };

  const daysToGo = useMemo(() => {
    if (!campaign?.time_created || typeof campaign?.duration_days !== "number") return null;
    const created = new Date(campaign.time_created);
    const end = new Date(created.getTime() + campaign.duration_days * 24 * 60 * 60 * 1000);
    const diffMs = end.getTime() - Date.now();
    return Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
  }, [campaign?.time_created, campaign?.duration_days]);

  const percentFunded = useMemo(() => {
    if (!campaign?.funding_goal_cents) return 0;
    return Math.min(100, Math.round((campaign.amount_raised_cents / campaign.funding_goal_cents) * 100));
  }, [campaign?.amount_raised_cents, campaign?.funding_goal_cents]);

  const totalCommentPages = data?.comments_pagination?.total_pages ?? 1;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
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

        {!data && !error && <p className="text-gray-600">Loading…</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {data && campaign && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {campaign.title}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {totalPhotos > 0 && heroIsVideo ? (
                    <video
                      key={heroImage}
                      src={heroImage}
                      controls
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={heroImage}
                      alt={campaign.title}
                      fill
                      className="object-cover"
                    />
                  )}

                  {totalPhotos > 1 && (
                    <>
                      <button
                        onClick={goToPrevPhoto}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                        aria-label="Previous image"
                      >
                        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <button
                        onClick={goToNextPhoto}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                        aria-label="Next image"
                      >
                        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {data?.photos?.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`w-2.5 h-2.5 rounded-full ${
                              index === currentPhotoIndex ? "bg-white" : "bg-white/50"
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Category: <span className="font-medium">{campaign.category}</span></p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Location: <span className="font-medium">{campaign.location}</span></p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">Status: <span className="font-medium">{campaign.status?.charAt(0).toUpperCase() + campaign.status?.slice(1)}</span></p>
                  </div>
                </div>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Story</h2>
                  <p className="text-gray-600 mb-8">
                    {campaign.description_html}
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQs</h2>
                  {data.faqs.length === 0 ? (
                    <p className="text-gray-600">No FAQs yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {data.faqs.map((f) => (
                        <div key={f.display_order} className="border border-gray-200 rounded-lg p-4">
                          <div className="font-semibold text-gray-900">{f.question}</div>
                          <div className="text-gray-600 mt-1">{f.answer}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>

                  <div className="border border-gray-200 rounded-2xl p-5 bg-white mb-6">
                    {user ? (
                      <>
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
                          placeholder="Share your thoughts about this project..."
                          className="w-full min-h-[120px] border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A] resize-y"
                        />

                        <div className="flex items-center justify-between mt-3">
                          <p className={`text-xs ${commentText.length >= COMMENT_MAX_LENGTH ? "text-red-600" : "text-gray-500"}`}>
                            {commentText.length}/{COMMENT_MAX_LENGTH}
                          </p>

                          <button
                            onClick={handleSubmitComment}
                            disabled={isCommentSubmitting || !commentText.trim() || commentText.length > COMMENT_MAX_LENGTH}
                            className="px-5 py-2.5 bg-[#8BC34A] text-white rounded-lg text-sm font-medium hover:bg-[#7CB342] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCommentSubmitting ? "Posting..." : "Post Comment"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Please sign in to leave a comment.
                      </p>
                    )}
                  </div>

                  {data.comments.length === 0 ? (
                    <p className="text-gray-600">No comments yet. Be the first to comment.</p>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {data.comments.map((comment) => (
                          <div key={comment.comment_id} className="border border-gray-200 rounded-2xl p-5 bg-white">
                            <div className="flex items-start gap-3">
                              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {comment.name?.[0]?.toUpperCase() ?? "U"}
                              </div>

                              <div className="min-w-0 flex-1">
                                <CommentHeader comment={comment} />

                                <p className="text-sm text-gray-700 whitespace-pre-line mb-3">
                                  {comment.comment_text}
                                </p>

                                <div className="flex items-center gap-4">
                                  {user && (
                                    <button
                                      onClick={() =>
                                        setReplyingTo((prev) =>
                                          prev === comment.comment_id ? null : comment.comment_id
                                        )
                                      }
                                      className="text-sm text-[#8BC34A] hover:underline"
                                    >
                                      Reply
                                    </button>
                                  )}

                                  {comment.is_you && (
                                    <button
                                      onClick={() => handleDeleteComment(comment.comment_id)}
                                      className="text-sm text-red-600 hover:underline"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>

                                {replyingTo === comment.comment_id && user && (
                                  <div className="mt-4">
                                    <textarea
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
                                      placeholder="Write a reply..."
                                      className="w-full min-h-[90px] border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:border-[#8BC34A] focus:ring-1 focus:ring-[#8BC34A] resize-y"
                                    />

                                    <div className="flex items-center justify-between gap-2 mt-3">
                                      <p className={`text-xs ${replyText.length >= COMMENT_MAX_LENGTH ? "text-red-600" : "text-gray-500"}`}>
                                        {replyText.length}/{COMMENT_MAX_LENGTH}
                                      </p>

                                      <div className="flex justify-end gap-2">
                                        <button
                                          onClick={() => {
                                            setReplyingTo(null);
                                            setReplyText("");
                                          }}
                                          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() => handleSubmitReply(comment.comment_id)}
                                          disabled={isReplySubmitting || !replyText.trim() || replyText.length > COMMENT_MAX_LENGTH}
                                          className="px-4 py-2 text-sm bg-[#8BC34A] text-white rounded-lg hover:bg-[#7CB342] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {isReplySubmitting ? "Posting..." : "Post Reply"}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {comment.replies.length > 0 && (
                                  <div className="mt-5 space-y-3 border-l-2 border-gray-100 pl-4">
                                    {comment.replies.map((reply) => (
                                      <div key={reply.comment_id} className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                            {reply.name?.[0]?.toUpperCase() ?? "U"}
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <CommentHeader comment={reply} compact />

                                            <p className="text-sm text-gray-700 whitespace-pre-line mb-2">
                                              {reply.comment_text}
                                            </p>

                                            {reply.is_you && (
                                              <button
                                                onClick={() => handleDeleteComment(reply.comment_id)}
                                                className="text-sm text-red-600 hover:underline"
                                              >
                                                Delete
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}

                                    {comment.has_more_replies ? (
                                      <button
                                        onClick={() => handleLoadMoreReplies(comment.comment_id)}
                                        disabled={loadingRepliesFor === comment.comment_id}
                                        className="text-sm text-[#8BC34A] hover:underline disabled:opacity-50"
                                      >
                                        {loadingRepliesFor === comment.comment_id
                                          ? "Loading replies..."
                                          : `Load more replies (${comment.reply_count - comment.replies.length} more)`}
                                      </button>
                                    ) : comment.reply_count > 5 ? (
                                      <button
                                        onClick={() => handleCollapseReplies(comment.comment_id)}
                                        className="text-sm text-[#8BC34A] hover:underline"
                                      >
                                        Show fewer replies
                                      </button>
                                    ) : null}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {totalCommentPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                          {Array.from({ length: totalCommentPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => loadCampaignPage(pageNum)}
                              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                pageNum === commentPage
                                  ? "bg-[#8BC34A] text-white border-[#8BC34A]"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </section>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-gray-900">
                      {formatUSD(campaign.amount_raised_cents)}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      pledged of {formatUSD(campaign.funding_goal_cents)} goal
                    </p>

                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
                      <div className="h-2 bg-[#8BC34A]" style={{ width: `${percentFunded}%` }} />
                    </div>

                    <p className="text-2xl font-bold text-gray-900">{campaign.backers}</p>
                    <p className="text-sm text-gray-500 mb-4">backers</p>

                    <p className="text-2xl font-bold text-gray-900">{daysToGo ?? "-"}</p>
                    <p className="text-sm text-gray-500 mb-6">days to go</p>

                    <button className="w-full bg-[#8BC34A] text-white py-3 rounded-lg font-medium hover:bg-[#7CB342] transition-colors mb-3">
                      Back this project
                    </button>

                    <p className="text-xs text-gray-500">
                      All or nothing. This project will only be funded if it reaches its goal before the campaign ends.
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mb-6">
                    {creator ? (
                      <Link
                        href={`/profile/${creator.creator_id}`}
                        className="flex items-center gap-3 mb-3 group"
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                          {creatorImage ? (
                            <Image
                              src={creatorImage}
                              alt={creatorFullName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                              {creatorInitial}
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-[#8BC34A] transition-colors">
                            {creatorFullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {creator.creator_id}
                          </p>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                        <div>
                          <p className="font-semibold text-gray-900">Unknown</p>
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mb-2">
                      {creator?.bio ?? "No bio yet."}{" "}
                      {creator && (
                        <Link
                          href={`/profile/${creator.creator_id}`}
                          className="text-[#8BC34A] hover:underline"
                        >
                          Read More
                        </Link>
                      )}
                    </p>
                  </div>

                  <div className="flex justify-end mb-6">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href).then(() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        });
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-[#8BC34A] text-white rounded-lg text-sm font-medium hover:bg-[#7CB342] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      {copied ? "Link Copied!" : "Share"}
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Rewards</h3>
                    {data.rewards.length === 0 ? (
                      <p className="text-xs text-gray-500">No rewards yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {data.rewards.map((r) => (
                          <div key={r.reward_id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-900">{r.title}</p>
                              <p className="text-sm text-gray-700">{formatUSD(r.required_amount_cents)}</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{r.description_html}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-12">
              <button className="px-6 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Report this project to CF
              </button>
            </div>

            <section className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                We Also Recommend
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProjects.map((project) => (
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
                        {percentFunded}% funded · By:{" "}
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
                <button className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  View More
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}