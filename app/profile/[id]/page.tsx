"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

type ProfileCreator = {
  creator_id: string;
  username?: string | null;
  user_type: number;
  name: string;
  last_name?: string | null;
  bio?: string | null;
  website?: string | null;
  avatar_url?: string | null;
  time_creation: string;
};

type ProfileCampaign = {
  campaign_id: number;
  creator_id: string;
  title: string;
  status: string;
  time_created: string;
  url?: string | null;
  description_html?: string | null;
  category?: string | null;
  location?: string | null;
  funding_goal_cents: number;
  duration_days?: number | null;
  amount_raised_cents: number;
  backers: number;
  image_url?: string | null;
  content_type?: string | null;
};

type ProfileActivity = {
  activity_type: "commented" | "followed" | "created_campaign";
  activity_time: string;
  comment_id?: number | null;
  activity_text?: string | null;
  activity_text_preview?: string | null;
  campaign_id?: number | null;
  campaign_url?: string | null;
  campaign_title?: string | null;
  campaign_status?: string | null;
  target_creator_id?: string | null;
  target_name?: string | null;
  target_last_name?: string | null;
  target_username?: string | null;
};

type ProfilePageData = {
  creator: ProfileCreator;
  interests: string[];
  campaigns: ProfileCampaign[];
  activities: ProfileActivity[];
};

type FollowSummary = {
  creator_id: string;
  followers_count: number;
  following_count: number;
};

type FollowRelationship = {
  viewer_creator_id: string | null;
  is_self: boolean;
  is_following: boolean;
  follows_you: boolean;
  is_friend: boolean;
};

function formatUserType(userType?: number) {
  return userType === 1 ? "Individual" : "Business";
}

function formatJoinedDate(dateString?: string) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatTimeAgo(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const seconds = Math.max(1, Math.floor(diffMs / 1000));
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return formatJoinedDate(dateString);
}

function getFullName(creator?: ProfileCreator | null) {
  if (!creator) return "Unknown User";
  return [creator.name, creator.last_name].filter(Boolean).join(" ").trim() || "Unknown User";
}

function getDisplayHandle(creator?: Pick<ProfileCreator, "username" | "creator_id"> | null) {
  if (!creator) return "";
  return `@${creator.username || creator.creator_id}`;
}

function getProfileHref(person?: { username?: string | null; creator_id?: string | null }) {
  if (person?.username) return `/profile/${person.username}`;
  if (person?.creator_id) return `/profile/${person.creator_id}`;
  return "#";
}

function getActivityTargetName(activity: ProfileActivity) {
  return [activity.target_name, activity.target_last_name].filter(Boolean).join(" ").trim() || activity.target_username || activity.target_creator_id || "another user";
}

function formatUSD(cents?: number) {
  if (typeof cents !== "number") return "";
  return (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function getPercentFunded(campaign: ProfileCampaign) {
  if (!campaign.funding_goal_cents) return 0;
  return Math.min(
    100,
    Math.round((campaign.amount_raised_cents / campaign.funding_goal_cents) * 100)
  );
}

function getCampaignHref(campaign?: { url?: string | null; campaign_id?: number | null }) {
  if (campaign?.url) return `/project/${campaign.url}`;
  if (campaign?.campaign_id) return `/project/${campaign.campaign_id}`;
  return "#";
}

function ActivityItem({ activity }: { activity: ProfileActivity }) {
  if (activity.activity_type === "commented") {
    const href = getCampaignHref({ url: activity.campaign_url, campaign_id: activity.campaign_id });
    return (
      <Link href={href} className="block rounded-xl border border-gray-200 p-4 bg-white hover:border-[#8BC34A]/40 hover:bg-[#F9FCF6] transition-colors">
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="text-sm font-semibold text-gray-900">Commented on {activity.campaign_title || "a campaign"}</p>
          <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(activity.activity_time)}</span>
        </div>
        {activity.activity_text_preview ? (
          <p className="text-sm text-gray-600 line-clamp-3">“{activity.activity_text_preview}”</p>
        ) : (
          <p className="text-sm text-gray-600">View comment activity</p>
        )}
      </Link>
    );
  }

  if (activity.activity_type === "followed") {
    const href = getProfileHref({ username: activity.target_username, creator_id: activity.target_creator_id });
    return (
      <Link href={href} className="block rounded-xl border border-gray-200 p-4 bg-white hover:border-[#8BC34A]/40 hover:bg-[#F9FCF6] transition-colors">
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="text-sm font-semibold text-gray-900">Followed {getActivityTargetName(activity)}</p>
          <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(activity.activity_time)}</span>
        </div>
        <p className="text-sm text-gray-600">Open profile</p>
      </Link>
    );
  }

  const href = getCampaignHref({ url: activity.campaign_url, campaign_id: activity.campaign_id });
  return (
    <Link href={href} className="block rounded-xl border border-gray-200 p-4 bg-white hover:border-[#8BC34A]/40 hover:bg-[#F9FCF6] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-sm font-semibold text-gray-900">Created a new campaign: {activity.campaign_title || "Untitled campaign"}</p>
        <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(activity.activity_time)}</span>
      </div>
      <p className="text-sm text-gray-600">Open campaign</p>
    </Link>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user } = useUser();
  const id = params?.id;

  const [data, setData] = useState<ProfilePageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [followSummary, setFollowSummary] = useState<FollowSummary | null>(null);
  const [followRelationship, setFollowRelationship] = useState<FollowRelationship | null>(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  function getAuthHeaders(): Record<string, string> {
    if (typeof window === "undefined") return {};

    const token = localStorage.getItem("cf_backend_token");
    if (!token) return {};

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async function refreshFollowData(profileCreatorId: string) {
    const summaryRes = await fetch(`${API_BASE}/api/follows/${profileCreatorId}/summary`, {
      cache: "no-store",
    });

    if (summaryRes.ok) {
      const summaryJson = (await summaryRes.json()) as FollowSummary;
      setFollowSummary(summaryJson);
    }

    const relationshipRes = await fetch(
      `${API_BASE}/api/follows/${profileCreatorId}/relationship`,
      {
        cache: "no-store",
        headers: getAuthHeaders(),
      }
    );

    if (relationshipRes.ok) {
      const relationshipJson = (await relationshipRes.json()) as FollowRelationship;
      setFollowRelationship(relationshipJson);
    }
  }

  const creator = data?.creator;
  const interests = data?.interests ?? [];
  const activities = (data?.activities ?? []).filter((activity) => {
    if (activity.activity_type !== "created_campaign") return true;
    return activity.campaign_status === "active";
  });

const isOwnProfile = useMemo(() => {
  return !!user?.id && !!creator?.creator_id && user.id === creator.creator_id;
}, [user?.id, creator?.creator_id]);

  const campaigns = (data?.campaigns ?? []).filter((campaign) => {
    if (isOwnProfile) return true;
    return campaign.status === "active";
  });

  async function handleFollowClick() {
    if (!creator || !user?.id || isOwnProfile) return;

    try {
      setIsFollowLoading(true);

      const headers = {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      };

      if (followRelationship?.is_following) {
        const message = followRelationship.is_friend
          ? `Are you sure you want to unfollow ${getFullName(creator)}? You will no longer be friends on Community Fundings.`
          : `Are you sure you want to unfollow ${getFullName(creator)}?`;

        const confirmed = window.confirm(message);
        if (!confirmed) return;

        const res = await fetch(`${API_BASE}/api/follows/${creator.creator_id}`, {
          method: "DELETE",
          headers,
        });

        if (!res.ok) throw new Error("Failed to unfollow");
      } else {
        const res = await fetch(`${API_BASE}/api/follows/${creator.creator_id}`, {
          method: "POST",
          headers,
        });

        if (!res.ok) throw new Error("Failed to follow");
      }

      await refreshFollowData(creator.creator_id);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsFollowLoading(false);
    }
  }

  async function handleReportProfile() {
    if (!creator || isOwnProfile) return;

    try {
      setIsReportLoading(true);

      const res = await fetch(`${API_BASE}/api/profile-page/${profilePathId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to report profile: ${res.status}`);
      }

      alert("Profile reported. A snapshot was saved for admin review.");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Could not report profile.");
    } finally {
      setIsReportLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setError(null);

        const res = await fetch(`${API_BASE}/api/profile-page/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Profile not found");
          }
          throw new Error(`Failed: ${res.status}`);
        }

        const json = (await res.json()) as ProfilePageData;
        setData(json);
        await refreshFollowData(json.creator.creator_id);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      }
    })();
  }, [id]);

  const profileImage = creator?.avatar_url || (isOwnProfile ? user?.imageUrl : null);
  const profilePathId = creator?.username || creator?.creator_id || id;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
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

        {creator && (
          <>
            <section className="rounded-2xl bg-[#F5F9F0] border border-[#8BC34A]/15 px-6 md:px-10 py-10 mb-10">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-sm bg-white flex-shrink-0">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt={getFullName(creator)}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-3xl font-semibold">
                      {creator.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8BC34A] mb-2">
                    User Profile
                  </p>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                      {getFullName(creator)}
                    </h1>
                    <p className="text-sm text-gray-500">{getDisplayHandle(creator)}</p>

                    {!isOwnProfile && followRelationship?.is_friend ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#F5F9F0] text-[#6E9E36] border border-[#8BC34A]/20">
                        Friend
                      </span>
                    ) : !isOwnProfile && followRelationship?.follows_you ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        Follows you
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8BC34A]" />
                      <span>
                        <span className="font-medium text-gray-900">Type:</span>{" "}
                        {formatUserType(creator.user_type)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
                      </svg>
                      <span>
                        <span className="font-medium text-gray-900">Joined:</span>{" "}
                        {formatJoinedDate(creator.time_creation)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600">
                    <Link
                      href={`/profile/${creator.username || creator.creator_id}/followers`}
                      className="hover:text-[#8BC34A] transition-colors"
                    >
                      <span className="font-semibold text-gray-900">
                        {followSummary?.followers_count ?? 0}
                      </span>{" "}
                      Followers
                    </Link>

                    <Link
                      href={`/profile/${creator.username || creator.creator_id}/following`}
                      className="hover:text-[#8BC34A] transition-colors"
                    >
                      <span className="font-semibold text-gray-900">
                        {followSummary?.following_count ?? 0}
                      </span>{" "}
                      Following
                    </Link>
                  </div>
                </div>

                <div className="md:self-start">
                  {isOwnProfile ? (
                    <Link
                      href="/settings"
                      className="inline-flex items-center justify-center px-5 py-3 bg-[#8BC34A] text-white rounded-lg font-medium hover:bg-[#7CB342] transition-colors"
                    >
                      Edit Profile
                    </Link>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleFollowClick}
                        disabled={isFollowLoading}
                        className={`inline-flex items-center justify-center px-5 py-3 rounded-lg font-medium transition-colors ${
                          followRelationship?.is_following
                            ? "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
                            : "bg-[#8BC34A] text-white hover:bg-[#7CB342]"
                        } disabled:opacity-50`}
                      >
                        {isFollowLoading
                          ? "Loading..."
                          : followRelationship?.is_following
                          ? "Following"
                          : "Follow"}
                      </button>

                      <button
                        onClick={handleReportProfile}
                        disabled={isReportLoading}
                        className="inline-flex items-center justify-center px-5 py-3 rounded-lg font-medium bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        {isReportLoading ? "Reporting..." : "Report Profile"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                  <div className="border border-gray-200 rounded-2xl p-6 bg-white">
                    <p className="text-gray-600 leading-7 whitespace-pre-line">
                      {creator.bio?.trim() || "This user has not added a bio yet."}
                    </p>
                  </div>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Details</h2>
                  <div className="border border-gray-200 rounded-2xl p-6 bg-white space-y-6">
                    {creator?.website?.trim() ? (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                          Website
                        </p>
                        <a
                          href={
                            creator.website.startsWith("http://") || creator.website.startsWith("https://")
                              ? creator.website
                              : `https://${creator.website}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#8BC34A] hover:underline break-all"
                        >
                          {creator.website}
                        </a>
                      </div>
                    ) : null}

                    {interests.length > 0 ? (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">
                          Interests
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest) => (
                            <span
                              key={interest}
                              className="px-3 py-1.5 rounded-full text-sm font-medium bg-[#F5F9F0] text-[#6E9E36] border border-[#8BC34A]/20"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {!creator?.website?.trim() && interests.length === 0 ? (
                      <p className="text-gray-600">No website</p>
                    ) : null}
                  </div>
                </section>

                <section className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Campaigns Started
                    </h2>
                    <p className="text-sm text-gray-500">
                      {campaigns.length} {campaigns.length === 1 ? "project" : "projects"}
                    </p>
                  </div>

                  {campaigns.length === 0 ? (
                    <div className="border border-gray-200 rounded-2xl p-6 bg-white">
                      <p className="text-gray-600">No projects yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {campaigns.map((campaign) => {
                        const percentFunded = getPercentFunded(campaign);
                        const imageSrc =
                          campaign.image_url ||
                          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800";
                        const thumbIsVideo =
                          (campaign.content_type ?? "")
                            .toLowerCase()
                            .startsWith("video/");

                        return (
                          <Link
                            key={campaign.campaign_id}
                            href={getCampaignHref(campaign)}
                            className="group block"
                          >
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 mb-3">
                              {thumbIsVideo ? (
                                <video
                                  src={imageSrc}
                                  muted
                                  playsInline
                                  preload="metadata"
                                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <Image
                                  src={imageSrc}
                                  alt={campaign.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              )}
                            </div>

                            <div>
                             <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                  {campaign.title}
                                </h3>

                            {isOwnProfile && campaign.status !== "active" && (
                              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                Only visible to you
                              </span>
                            )}
                            </div>

                              <p className="text-xs text-gray-500 mb-1">
                                {percentFunded}% funded · By:{" "}
                                <span className="font-semibold text-gray-700">
                                  {getFullName(creator)}
                                </span>
                              </p>

                              <p className="text-xs text-gray-500 mb-2">
                                {campaign.backers} {campaign.backers === 1 ? "backer" : "backers"} ·{" "}
                                <span className="font-medium text-gray-700">
                                  {formatUSD(campaign.amount_raised_cents)}
                                </span>{" "}
                                raised
                              </p>

                              <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                                <div
                                  className="h-2 bg-[#8BC34A]"
                                  style={{ width: `${percentFunded}%` }}
                                />
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  <section className="border border-gray-200 rounded-2xl p-6 bg-white">
                    <div className="flex items-center justify-between mb-4 gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                      <span className="text-xs text-gray-500">Newest first</span>
                    </div>

                    {activities.length === 0 ? (
                      <p className="text-sm text-gray-600">No recent activity yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {activities.map((activity, index) => (
                          <ActivityItem key={`${activity.activity_type}-${activity.activity_time}-${index}`} activity={activity} />
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
