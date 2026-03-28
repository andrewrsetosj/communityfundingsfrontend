"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Header from "../components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Campaign {
  id: number;
  title: string;
  slug: string | null;
  category: string | null;
  goal_amount: number;
  raised_amount: number;
  funding_percentage: number;
  days_left: number | null;
  creator_name: string | null;
  donors_count: number;
}

export default function RecommendedPage() {
  const { isLoaded } = useUser();
  const [interests, setInterests] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const token = localStorage.getItem("cf_backend_token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Fetch user's interests, then fetch campaigns for each category
    fetch(`${API_URL}/api/users/me/interests`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(async (data: { name: string }[]) => {
        const names = data.map((d) => d.name);
        setInterests(names);

        if (names.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch campaigns for each interest category in parallel
        const results = await Promise.all(
          names.map((category) =>
            fetch(`${API_URL}/api/campaigns?status=active&category=${encodeURIComponent(category)}&per_page=10`)
              .then((res) => (res.ok ? res.json() : { campaigns: [] }))
              .then((data) => data.campaigns as Campaign[])
              .catch(() => [] as Campaign[])
          )
        );

        // Merge and deduplicate by id
        const seen = new Set<number>();
        const merged: Campaign[] = [];
        for (const batch of results) {
          for (const c of batch) {
            if (!seen.has(c.id)) {
              seen.add(c.id);
              merged.push(c);
            }
          }
        }
        setCampaigns(merged);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load recommendations:", err);
        setLoading(false);
      });
  }, [isLoaded]);

  const formatUSD = (dollars: number) =>
    dollars.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  if (!isLoaded || loading) {
    return (
      <>
        <Header />
        <div className="max-w-6xl mx-auto px-6 py-16 text-center text-gray-500">
          Loading recommendations...
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Recommended for You
          </h1>
          {interests.length > 0 ? (
            <p className="text-gray-600">
              Showing campaigns matching your interests:{" "}
              {interests.map((interest, i) => (
                <span key={interest}>
                  <span className="font-medium text-gray-900">{interest}</span>
                  {i < interests.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          ) : (
            <p className="text-gray-600">
              You haven&apos;t selected any interests yet.{" "}
              <Link href="/settings" className="text-[#8BC34A] hover:underline">
                Update your interests
              </Link>{" "}
              to get personalized recommendations.
            </p>
          )}
        </div>

        {interests.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No interests selected
            </h3>
            <p className="text-gray-500 mb-6">
              Select your interests to discover campaigns you&apos;ll love.
            </p>
            <Link
              href="/settings"
              className="inline-block bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
            >
              Choose Your Interests
            </Link>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No matching campaigns right now
            </h3>
            <p className="text-gray-500">
              Check back soon or explore other categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/project/${campaign.slug || campaign.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 block"
              >
                <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {campaign.title}
                  </h3>
                  {campaign.creator_name && (
                    <p className="text-xs text-gray-500 mb-1">
                      By <span className="font-medium">{campaign.creator_name}</span>
                    </p>
                  )}
                  {campaign.category && (
                    <span className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs mb-3">
                      {campaign.category}
                    </span>
                  )}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">
                        {formatUSD(campaign.raised_amount)}
                      </span>
                      <span className="text-[#8BC34A] font-medium">
                        {campaign.funding_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-[#8BC34A] h-1.5 rounded-full"
                        style={{ width: `${Math.min(campaign.funding_percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{campaign.donors_count} backers</span>
                      {campaign.days_left !== null && campaign.days_left > 0 && (
                        <span>{campaign.days_left} days left</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
