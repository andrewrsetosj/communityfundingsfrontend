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
  name?: string;
  last_name?: string;
  time_created: string;
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

type CampaignPageData = {
  campaign: Campaign;
  creator: Creator | null;
  faqs: Faq[];
  rewards: Reward[];
  photos: Photo[];
  comments: Comment[];
};

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

export default function ProjectDetail() {
  const { user } = useUser();
  const router = useRouter();
const params = useParams<{ url: string }>();
const url = params?.url;
const [data, setData] = useState<CampaignPageData | null>(null);
const [error, setError] = useState<string | null>(null);

const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!url) return;

    (async () => {
      try {
        setError(null);
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const res = await fetch(`${API_BASE}/api/campaign-page/${url}`, {
  cache: "no-store",
});

        if (!res.ok) throw new Error(`Failed: ${res.status}`);

        const json = (await res.json()) as CampaignPageData;
        setData(json);
        setCurrentPhotoIndex(0);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      }
    })();
  }, [url]);

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

  return (
    <div className="min-h-screen bg-white">
      <Header />

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

        {/* Loading / Error */}
        {!data && !error && <p className="text-gray-600">Loading…</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {data && campaign && (
          <>
            {/* Project Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {campaign.title}
            </h1>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Left Column - Media */}
              <div className="lg:col-span-2">
                {/* Main video or hero image */}
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

                {/* Feature Points (static FOR NOW) */}
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
 {/* Story Section (reusing campaign.description for now, will change obvi) */}
<section className="mb-10">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">Story</h2>
  <p className="text-gray-600 mb-8">
    {campaign.description_html}
  </p>
</section>
                {/* FAQs */}
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
              </div>

              {/* Right Column - Funding Info */}
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

                  {/* Creator Info */}
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

                  {/* Share Button */}
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

                  {/* Rewards */}
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
            {/* We Also Recommend (unchanged) */}
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