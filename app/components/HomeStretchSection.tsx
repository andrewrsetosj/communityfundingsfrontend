"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProjectCarousel from "./ProjectCarousel";

interface Campaign {
  campaign_id: number;
  title: string;
  slug: string;
  funding_goal_cents: number;
  amount_raised_cents: number;
  funding_percentage: number;
  days_left: number | null;
  creator_name: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function HomeStretchSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeStretch() {
      try {
        const res = await fetch(`${API_URL}/api/campaigns?status=active`);
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();
        // Filter for campaigns that are >= 80% funded but not yet 100%
        const homeStretch = (data.campaigns as Campaign[]).filter(
          (c) => c.funding_percentage >= 80 && c.funding_percentage < 100
        );
        setCampaigns(homeStretch.slice(0, 10));
      } catch (err) {
        console.error("Error fetching home stretch campaigns:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeStretch();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Home Stretch
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            These projects are almost at their funding goal. Help them cross the finish line!
          </p>
        </div>
        <div className="flex gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-72 bg-gray-100 rounded-lg h-72 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (campaigns.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Home Stretch
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            No projects are in the home stretch right now. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
          Home Stretch
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          These projects are almost at their funding goal. Help them cross the finish line!
        </p>
      </div>

      <ProjectCarousel seeMoreHref="/home-stretch" seeMoreLabel="Home Stretch Projects">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.campaign_id}
            href={`/project/${campaign.slug || campaign.campaign_id}`}
            className="flex-shrink-0 w-72 h-72 snap-start bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow block border border-gray-100"
          >
            <div className="relative h-36 bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                {campaign.title}
              </h3>
              {campaign.creator_name && (
                <p className="text-xs text-gray-500 mb-1">
                  By: <span className="font-medium">{campaign.creator_name}</span>
                </p>
              )}
              <p className="text-xs text-gray-500 mb-3">
                ${(campaign.amount_raised_cents / 100).toLocaleString()} raised of ${(campaign.funding_goal_cents / 100).toLocaleString()}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                <div
                  className="bg-[#8BC34A] h-1.5 rounded-full"
                  style={{ width: `${Math.min(campaign.funding_percentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium text-[#8BC34A]">
                  {campaign.funding_percentage}% funded
                </span>
                {campaign.days_left !== null && (
                  <span>{campaign.days_left} days left</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </ProjectCarousel>
    </section>
  );
}
