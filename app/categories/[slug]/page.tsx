"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const categoryNames: Record<string, string> = {
  "arts": "Arts",
  "comics-illustration": "Comics & Illustration",
  "community": "Community",
  "creative": "Creative",
  "design-tech": "Design & Tech",
  "disaster-relief": "Disaster Relief",
  "education": "Education",
  "emergency": "Emergency",
  "film": "Film",
  "food-craft": "Food & Craft",
  "game": "Game",
  "music": "Music",
  "nonprofit": "Nonprofit",
  "pets": "Pets",
  "publishing": "Publishing",
  "sports": "Sports",
  "technology": "Technology",
};

const categoryDescriptions: Record<string, string> = {
  "comics-illustration": "From webcomics and graphic novels to illustrated children's books, this is the home for visual storytelling. Back independent artists bringing their characters and worlds to life.",
  "design-tech": "Apps, hardware, software tools, and innovative tech products built by makers and developers. Support the next big idea before it hits the market.",
  "food-craft": "Artisan food brands, handmade goods, recipe books, and small-batch culinary ventures. Discover makers who put passion into every product.",
  "arts": "Paintings, sculptures, photography, printmaking, and mixed-media works by independent artists seeking support to create and exhibit their work.",
  "film": "Short films, feature-length independents, documentaries, and animation projects. Help filmmakers bring their stories to the screen.",
  "game": "Tabletop games, card games, video games, and interactive experiences crafted by indie creators. Back the next game you can't stop thinking about.",
  "music": "Albums, EPs, tours, music videos, and recording projects from independent musicians across every genre. Support the artists you love directly.",
  "publishing": "Books, poetry collections, journals, and print publications seeking readers and backers. Help independent writers get their words into the world.",
};

const projects = [
  { id: 1, image: "photo-1558618666-fcd25c85cd64" },
  { id: 2, image: "photo-1493225457124-a3eb161ffa5f" },
  { id: 3, image: "photo-1514525253161-7a46d19cd819" },
  { id: 4, image: "photo-1506905925346-21bda4d32df4" },
  { id: 5, image: "photo-1485846234645-a62644f84728" },
  { id: 6, image: "photo-1493225457124-a3eb161ffa5f" },
  { id: 7, image: "photo-1550751827-4bd374c3f58b" },
  { id: 8, image: "photo-1518837695005-2083093ee35b" },
  { id: 9, image: "photo-1532012197267-da84d127e765" },
  { id: 10, image: "photo-1511632765486-a01980e01a18" },
  { id: 11, image: "photo-1497436072909-60f360e1d4b1" },
  { id: 12, image: "photo-1469474968028-56623f02e42e" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const categoryName = categoryNames[slug] || "Category";
  const categoryDescription = categoryDescriptions[slug] || "";

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch(
          `${API_URL}/api/campaigns?status=active&category=${encodeURIComponent(categoryName)}&per_page=50`
        );
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#F5F5F5] py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/categories"
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
              Categories
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {categoryName}
          </h1>

          {/* Description */}
          <p className="text-gray-600 max-w-xl mb-6">
            {categoryDescription}
          </p>

          {/* CTA Button */}
          <Link
            href="/create-project/basics"
            className="inline-block bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
          >
            Start a Project
          </Link>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <>
            <h2 className="text-xl font-medium text-gray-900 mb-8">
              Loading projects in {categoryName}...
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-lg h-72 animate-pulse"
                />
              ))}
            </div>
          </>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-2">
              No projects in {categoryName} yet.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Be the first to start a project in this category!
            </p>
            <Link
              href="/create-project/basics"
              className="inline-block px-6 py-3 bg-[#8BC34A] text-white rounded-full font-medium hover:bg-[#7CB342] transition-colors"
            >
              Start a Project
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-medium text-gray-900 mb-8">
              Explore{" "}
              <span className="font-bold">
                {campaigns.length} {campaigns.length === 1 ? "project" : "projects"}
              </span>{" "}
              in {categoryName}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {campaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaign/${campaign.slug}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow block border border-gray-100"
                >
                  <div className="relative h-36 bg-gray-200">
                    {campaign.image_url && campaign.image_url.startsWith("http") ? (
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
                      {campaign.days_left !== null && (
                        <span>{campaign.days_left} days left</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}