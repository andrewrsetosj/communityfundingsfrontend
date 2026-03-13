"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

interface Campaign {
  id: string;
  title: string;
  slug: string;
  goal_amount: number;
  raised_amount: number;
  funding_percentage: number;
  days_left: number | null;
  creator_name: string | null;
  image_url: string | null;
  donors_count: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function CommunityFavoritesPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch(
          `${API_URL}/api/campaigns?status=active&sort=popular&per_page=50`
        );
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      } catch (err) {
        console.error("Error fetching community favorites:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#F5F5F5] py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-[#8BC34A] transition-colors border border-gray-300 rounded-full px-4 py-2 bg-white"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Community Favorites
          </h1>

          {/* Description */}
          <p className="text-gray-600 max-w-xl">
            The most popular projects on our platform, ranked by number of
            backers. These are the campaigns our community loves most!
          </p>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg h-72 animate-pulse"
              />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              No community favorites yet. Check back soon!
            </p>
            <Link
              href="/"
              className="inline-block mt-6 px-6 py-3 bg-[#8BC34A] text-white rounded-full font-medium hover:bg-[#7CB342] transition-colors"
            >
              Browse All Projects
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-medium text-gray-900 mb-8">
              <span className="font-bold">{campaigns.length}</span>{" "}
              {campaigns.length === 1 ? "project" : "projects"} loved by the
              community
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {campaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaign/${campaign.slug}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow block border border-gray-100"
                >
                  <div className="relative h-36 bg-gray-200">
                    {campaign.image_url &&
                    campaign.image_url.startsWith("http") ? (
                      <img
                        src={campaign.image_url}
                        alt={campaign.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <svg
                          className="w-10 h-10"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {campaign.title}
                    </h3>
                    {campaign.creator_name && (
                      <p className="text-xs text-gray-500 mb-1">
                        By:{" "}
                        <span className="font-medium">
                          {campaign.creator_name}
                        </span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mb-3">
                      ${campaign.raised_amount.toLocaleString()} raised of $
                      {campaign.goal_amount.toLocaleString()}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                      <div
                        className="bg-[#8BC34A] h-1.5 rounded-full"
                        style={{
                          width: `${Math.min(campaign.funding_percentage, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium text-[#8BC34A]">
                        {campaign.funding_percentage}% funded
                      </span>
                      <span>{campaign.donors_count} backers</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
