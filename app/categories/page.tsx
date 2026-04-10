"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const allCategories = [
  { name: "Arts", slug: "arts" },
  { name: "Comics & Illustration", slug: "comics-illustration" },
  { name: "Community", slug: "community" },
  { name: "Creative", slug: "creative" },
  { name: "Design & Tech", slug: "design-tech" },
  { name: "Disaster Relief", slug: "disaster-relief" },
  { name: "Education", slug: "education" },
  { name: "Emergency", slug: "emergency" },
  { name: "Film", slug: "film" },
  { name: "Food & Craft", slug: "food-craft" },
  { name: "Game", slug: "game" },
  { name: "Music", slug: "music" },
  { name: "Nonprofit", slug: "nonprofit" },
  { name: "Pets", slug: "pets" },
  { name: "Publishing", slug: "publishing" },
  { name: "Sports", slug: "sports" },
  { name: "Technology", slug: "technology" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CategoriesPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch(`${API_URL}/api/campaigns/categories`);
        if (!res.ok) return;
        const data = await res.json();
        const map: Record<string, number> = {};
        for (const item of data) {
          map[item.name] = item.count;
        }
        setCounts(map);
      } catch {
        // Failed to fetch counts — leave at 0
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-[#F5F5F5] py-12">
        <div className="max-w-7xl mx-auto px-6">
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
              Home
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Categories
          </h1>

          <p className="text-gray-600 max-w-xl mb-6">
            Explore campaigns by category. Find creative work that inspires you
            and support the creators behind them.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-[#8BC34A] hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-[#8BC34A]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#8BC34A]/20 transition-colors">
                <svg
                  className="w-6 h-6 text-[#8BC34A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#8BC34A] transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">
                {(counts[category.name] || 0).toLocaleString()} projects
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}