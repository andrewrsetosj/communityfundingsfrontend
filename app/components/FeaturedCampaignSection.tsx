"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Campaign {
  id: string;
  title: string;
  slug: string | null;
  goal_amount: number;
  raised_amount: number;
  funding_percentage: number;
  days_left: number | null;
  creator_name: string | null;
  image_url: string | null;
}

export default function FeaturedCampaignSection() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(
          `${API_URL}/api/campaigns?status=active&sort=most_funded&per_page=20`
        );
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();
        const campaigns: Campaign[] = data.campaigns || [];
        if (campaigns.length > 0) {
          const random = campaigns[Math.floor(Math.random() * campaigns.length)];
          setCampaign(random);
        }
      } catch (err) {
        console.error("Error fetching featured campaign:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Featured Campaign
          </h2>
        </div>
        <div className="animate-pulse bg-gray-200 rounded-2xl aspect-[16/10] max-w-4xl mx-auto" />
      </section>
    );
  }

  if (!campaign) return null;

  const heroImage =
    campaign.image_url ||
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800";
  const linkHref = `/project/${campaign.slug || campaign.id}`;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
          Featured Campaign
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Check out this campaign from our community and help bring it to life.
        </p>
      </div>

      <Link
        href={linkHref}
        className="block rounded-2xl overflow-hidden group max-w-5xl mx-auto border border-gray-200 hover:shadow-lg transition-shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left — Image */}
          <div className="relative aspect-[4/3] md:aspect-auto bg-gray-200">
            <Image
              src={heroImage}
              alt={campaign.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
              priority
            />
          </div>

          {/* Right — Info */}
          <div className="p-8 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-wider text-[#8BC34A] font-semibold mb-3">
              Featured Campaign
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              {campaign.title}
            </h3>

            {campaign.creator_name && (
              <p className="text-sm text-gray-500 mb-4">
                By: <span className="font-medium text-gray-700">{campaign.creator_name}</span>
              </p>
            )}

            {/* Stats */}
            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900">
                ${campaign.raised_amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-gray-500">
                raised of ${campaign.goal_amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} goal
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-[#8BC34A] h-2 rounded-full transition-all"
                style={{ width: `${Math.min(campaign.funding_percentage, 100)}%` }}
              />
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="font-medium text-[#8BC34A]">{campaign.funding_percentage}% funded</span>
              {campaign.days_left !== null && (
                <span>{campaign.days_left} days left</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
