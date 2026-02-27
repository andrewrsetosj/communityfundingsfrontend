"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  funding_percentage: number;
  days_left: number | null;
  creator_name: string | null;
  image_url: string | null;
  donors_count: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Deterministic shuffle using a week-based seed so the selection
// stays the same for the entire week, then refreshes automatically.
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647; // simple LCG
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getWeekNumber(): number {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
}

export default function FeaturedSection() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(
          `${API_URL}/api/campaigns?status=active&sort=popular&per_page=50`
        );
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();

        // Filter: >40% funded AND >50 backers
        const qualifying: Campaign[] = (data.campaigns || []).filter(
          (c: Campaign) => c.funding_percentage > 40 && c.donors_count > 50
        );

        // Shuffle deterministically by week, pick up to 4
        const shuffled = seededShuffle<Campaign>(qualifying, getWeekNumber());
        setCampaigns(shuffled.slice(0, 4));
      } catch (err) {
        console.error("Error fetching featured campaigns:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const main = campaigns[0];

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Featured Business or Project
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Standout campaigns chosen from our most popular and well-funded projects.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-100 rounded-2xl h-72 animate-pulse" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-24 h-20 bg-gray-100 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!main) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Featured Business or Project
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            No featured projects this week. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
          Featured Business or Project
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Standout campaigns chosen from our most popular and well-funded projects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Project Image */}
        <Link
          href={`/campaign/${main.slug}`}
          className="relative rounded-2xl overflow-hidden group cursor-pointer"
        >
          <div className="aspect-[4/3] bg-gray-200 relative">
            {main.image_url && main.image_url.startsWith("http") ? (
              <img
                src={main.image_url}
                alt={main.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#8BC34A]/20 to-[#689F38]/20 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </Link>

        {/* Project Details */}
        <div className="flex flex-col justify-center">
          <span className="text-xs uppercase tracking-wider text-[#8BC34A] font-semibold mb-2">
            Featured Project
          </span>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {main.title}
          </h3>
          {main.description && (
            <p className="text-gray-600 mb-5 line-clamp-3">
              {main.description}
            </p>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-[#8BC34A] h-2 rounded-full"
              style={{ width: `${Math.min(main.funding_percentage, 100)}%` }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <p className="text-xl font-bold text-gray-900">
                ${main.raised_amount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                raised of ${main.goal_amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {main.donors_count}
              </p>
              <p className="text-xs text-gray-500">backers</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {main.funding_percentage}%
              </p>
              <p className="text-xs text-gray-500">funded</p>
            </div>
          </div>

          {main.days_left !== null && (
            <p className="text-sm text-gray-500 mb-5">
              {main.days_left} days left
            </p>
          )}

          <Link
            href={`/campaign/${main.slug}`}
            className="inline-block w-fit bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
          >
            View Project
          </Link>
        </div>
      </div>
    </section>
  );
}
