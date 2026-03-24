"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProjectCarousel from "./ProjectCarousel";

interface Campaign {
  id: number;
  title: string;
  slug: string | null;
  goal_amount: number;
  raised_amount: number;
  funding_percentage: number;
  days_left: number | null;
  creator_name: string | null;
  donors_count: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ProjectsNearYouSection() {
  const [city, setCity] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);

  const fetchCampaigns = useCallback(async (location: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/campaigns?status=active&location=${encodeURIComponent(location)}&per_page=10`
      );
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      const data = await res.json();
      setCampaigns(data.campaigns);
    } catch (err) {
      console.error("Error fetching nearby campaigns:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("userCity");
    if (saved) {
      setCity(saved);
      fetchCampaigns(saved);
      return;
    }

    if (!navigator.geolocation) {
      setLocationDenied(true);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "User-Agent": "CommunityFundings/1.0" } }
          );
          const data = await res.json();
          const detected =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            null;
          if (detected) {
            setCity(detected);
            localStorage.setItem("userCity", detected);
            fetchCampaigns(detected);
          } else {
            setLocationDenied(true);
            setLoading(false);
          }
        } catch {
          setLocationDenied(true);
          setLoading(false);
        }
      },
      () => {
        setLocationDenied(true);
        setLoading(false);
      }
    );
  }, [fetchCampaigns]);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cityInput.trim();
    if (!trimmed) return;
    setCity(trimmed);
    localStorage.setItem("userCity", trimmed);
    setEditing(false);
    setLocationDenied(false);
    fetchCampaigns(trimmed);
  };

  const startEditing = () => {
    setCityInput(city || "");
    setEditing(true);
  };

  // No city yet and location was denied — show input
  if ((locationDenied || (!city && !loading)) && !editing) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Campaigns Near You
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Enter your city to discover campaigns in your area.
          </p>
          <form onSubmit={handleCitySubmit} className="flex justify-center gap-3 max-w-md mx-auto">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter your city"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-[#8BC34A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7CB342] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>
    );
  }

  // Editing city
  if (editing) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Campaigns Near You
          </h2>
          <form onSubmit={handleCitySubmit} className="flex justify-center gap-3 max-w-md mx-auto">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter your city"
              autoFocus
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-[#8BC34A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7CB342] transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      </section>
    );
  }

  // Loading
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            Campaigns Near You
          </h2>
        </div>
        <div className="flex gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-[calc(25%-18px)] bg-gray-100 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  // No campaigns found
  if (campaigns.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Campaigns Near {city}
            </h2>
            <button
              onClick={startEditing}
              className="text-[#8BC34A] hover:text-[#7CB342] transition-colors"
              aria-label="Change city"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600">No campaigns found near {city}. Try a different location!</p>
        </div>
      </section>
    );
  }

  // Campaigns found
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            Campaigns Near {city}
          </h2>
          <button
            onClick={startEditing}
            className="text-[#8BC34A] hover:text-[#7CB342] transition-colors"
            aria-label="Change city"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </div>

      <ProjectCarousel seeMoreHref={`/projects-near-you?location=${encodeURIComponent(city || "")}`} seeMoreLabel="See More">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            href={`/project/${campaign.slug || campaign.id}`}
            className="flex-shrink-0 w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] min-w-[270px] snap-start bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow block"
          >
            <div className="relative h-36 bg-gray-200 flex items-center justify-center text-gray-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                {campaign.title}
              </h3>
              {campaign.creator_name && (
                <p className="text-xs text-gray-500 mb-1">
                  By: <span className="font-medium">{campaign.creator_name}</span>
                </p>
              )}
              <p className="text-xs text-gray-500 mb-2">
                {campaign.donors_count} backers
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                <div
                  className="bg-[#8BC34A] h-1 rounded-full"
                  style={{ width: `${Math.min(campaign.funding_percentage, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-medium text-[#8BC34A]">
                  {campaign.funding_percentage}% funded
                </span>
                {campaign.days_left !== null && campaign.days_left > 0 && (
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
