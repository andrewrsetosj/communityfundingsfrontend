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
  user_type: number;
  name: string;
  last_name?: string | null;
  bio?: string | null;
  time_creation: string;
};

type ProfileCampaign = {
  campaign_id: number;
  creator_id: string;
  title: string;
  status: string;
  time_created: string;
  description_html?: string | null;
  category?: string | null;
  location?: string | null;
  funding_goal_cents: number;
  duration_days?: number | null;
  amount_raised_cents: number;
  backers: number;
  image_url?: string | null;
};

type ProfilePageData = {
  creator: ProfileCreator;
  campaigns: ProfileCampaign[];
};

function formatUserType(userType?: number) {
  return userType === 1 ? "Individual" : "Organization";
}

function formatJoinedDate(dateString?: string) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function getFullName(creator?: ProfileCreator | null) {
  if (!creator) return "Unknown User";
  return [creator.name, creator.last_name].filter(Boolean).join(" ").trim() || "Unknown User";
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

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { user } = useUser();
  const id = params?.id;

  const [data, setData] = useState<ProfilePageData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setError(null);

        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      }
    })();
  }, [id]);

  const creator = data?.creator;
  const campaigns = data?.campaigns ?? [];

  const isOwnProfile = useMemo(() => {
    return !!user?.id && !!creator?.creator_id && user.id === creator.creator_id;
  }, [user?.id, creator?.creator_id]);

  const profileImage = isOwnProfile && user?.imageUrl ? user.imageUrl : null;

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

                <div className="flex-1">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#8BC34A] mb-2">
                    User Profile
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {getFullName(creator)}
                  </h1>
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
                </div>

                {isOwnProfile && (
                  <div className="md:self-start">
                    <Link
                      href="/settings"
                      className="inline-flex items-center justify-center px-5 py-3 bg-[#8BC34A] text-white rounded-lg font-medium hover:bg-[#7CB342] transition-colors"
                    >
                      Edit Profile
                    </Link>
                  </div>
                )}
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

                <section className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Projects Started
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

                        return (
                          <Link
                            key={campaign.campaign_id}
                            href={`/project/${campaign.campaign_id}`}
                            className="group block"
                          >
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 mb-3">
                              <Image
                                src={imageSrc}
                                alt={campaign.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                                {campaign.title}
                              </h3>

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

                              <div className="flex items-center text-xs text-gray-500 space-x-4">
                                <span className="flex items-center hover:text-[#8BC34A] transition-colors">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                  </svg>
                                  Save
                                </span>
                                <span className="flex items-center hover:text-[#8BC34A] transition-colors">
                                  <span className="mr-1">$</span>
                                  Fund
                                </span>
                                <span className="flex items-center hover:text-[#8BC34A] transition-colors">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                  View
                                </span>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Details</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Full Name
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {getFullName(creator)}
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          User Type
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatUserType(creator.user_type)}
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Member Since
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatJoinedDate(creator.time_creation)}
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          Projects Started
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {campaigns.length}
                        </p>
                      </div>
                    </div>
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