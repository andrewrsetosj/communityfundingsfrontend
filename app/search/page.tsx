"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const ALL_CATEGORIES = [
  "Art",
  "Comics",
  "Crafts",
  "Dance",
  "Design",
  "Environment",
  "Education",
  "Health",
  "Fashion",
  "Film & Video",
  "Food",
  "Games",
  "Journalism",
  "Music",
  "Photography",
  "Publishing",
  "Technology",
  "Theater",
] as const;

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
  image_url: string | null;
}

interface UserResult {
  id: string;
  name: string | null;
  last_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string | null;
}

// Module-level guard — resets only on a true full-page reload (when the JS
// bundle is re-evaluated). Prevents the reload check from firing again on
// subsequent client-side navigations within the same browser session.
let reloadCheckRan = false;

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const locationParam = searchParams.get("location") || "";
  const categoryParam = searchParams.get("category") || "";
  const viewParam: "campaigns" | "users" =
    searchParams.get("view") === "users" ? "users" : "campaigns";
  const selectedCategories = categoryParam
    ? categoryParam.split(",").filter(Boolean)
    : [];

  const [searchInput, setSearchInput] = useState(queryParam);
  const [locationInput, setLocationInput] = useState(locationParam);
  const [pendingCategories, setPendingCategories] =
    useState<string[]>(selectedCategories);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignTotal, setCampaignTotal] = useState(0);
  const [campaignPages, setCampaignPages] = useState(1);
  const [campaignPage, setCampaignPage] = useState(1);

  const [users, setUsers] = useState<UserResult[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [userPages, setUserPages] = useState(1);
  const [userPage, setUserPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("recent");

  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationHighlight, setLocationHighlight] = useState(-1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reloadCheckRan) return;
    reloadCheckRan = true;
    const navEntries = performance.getEntriesByType("navigation");
    const navType = (navEntries[0] as PerformanceNavigationTiming | undefined)
      ?.type;
    const legacyType = (
      performance as unknown as { navigation?: { type: number } }
    ).navigation?.type;
    const isReload = navType === "reload" || legacyType === 1;
    if (isReload && window.location.search) {
      window.location.replace("/search");
    }
  }, []);

  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  useEffect(() => {
    setLocationInput(locationParam);
  }, [locationParam]);

  useEffect(() => {
    setPendingCategories(
      categoryParam ? categoryParam.split(",").filter(Boolean) : []
    );
  }, [categoryParam]);

  useEffect(() => {
    const term = locationInput.trim();
    if (!term) {
      setLocationSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(
        `${API_URL}/api/locations?q=${encodeURIComponent(term)}&limit=10`,
        { signal: controller.signal }
      )
        .then((res) => (res.ok ? res.json() : { locations: [] }))
        .then((data) => {
          setLocationSuggestions(data.locations || []);
          setLocationHighlight(-1);
        })
        .catch(() => {});
    }, 200);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [locationInput]);

  useEffect(() => {
    setCampaignPage(1);
    setUserPage(1);
  }, [queryParam, locationParam, categoryParam, sort]);

  useEffect(() => {
    setLoading(true);

    const campaignParams = new URLSearchParams({
      sort,
      page: String(campaignPage),
      per_page: "12",
    });
    if (queryParam) campaignParams.set("q", queryParam);
    if (locationParam) campaignParams.set("location", locationParam);
    if (categoryParam) campaignParams.set("category", categoryParam);

    const userParams = new URLSearchParams({
      page: String(userPage),
      per_page: "12",
    });
    if (queryParam) userParams.set("q", queryParam);
    if (locationParam) userParams.set("state", locationParam);

    const campaignsPromise = fetch(`${API_URL}/api/campaigns?${campaignParams}`)
      .then((res) => (res.ok ? res.json() : { campaigns: [], total: 0, page: 1 }))
      .catch(() => ({ campaigns: [], total: 0, page: 1 }));

    const usersPromise = fetch(`${API_URL}/api/users?${userParams}`)
      .then((res) => (res.ok ? res.json() : { users: [], total: 0 }))
      .catch(() => ({ users: [], total: 0 }));

    Promise.all([campaignsPromise, usersPromise])
      .then(([cData, uData]) => {
        setCampaigns(cData.campaigns || []);
        setCampaignTotal(cData.total || 0);
        setCampaignPages(Math.max(1, Math.ceil((cData.total || 0) / 12)));
        setUsers(uData.users || []);
        setUserTotal(uData.total || 0);
        setUserPages(Math.max(1, Math.ceil((uData.total || 0) / 12)));
      })
      .finally(() => setLoading(false));
  }, [queryParam, locationParam, categoryParam, sort, campaignPage, userPage]);

  const pushParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    });
    router.push(`/search?${next.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pushParams({
      q: searchInput.trim() || null,
      location: locationInput.trim() || null,
      category: pendingCategories.join(",") || null,
    });
  };

  const handleCategorySelect = (category: string) => {
    setPendingCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleApplyFilters = () => {
    pushParams({
      location: locationInput.trim() || null,
      category: pendingCategories.join(",") || null,
    });
  };

  const clearFilters = () => {
    setLocationInput("");
    setPendingCategories([]);
    pushParams({ location: null, category: null });
  };

  const filtersDirty =
    locationInput.trim() !== locationParam ||
    pendingCategories.join(",") !== categoryParam;

  const setView = (view: "campaigns" | "users") => {
    if (view === viewParam) return;
    const next = new URLSearchParams(searchParams.toString());
    if (view === "campaigns") next.delete("view");
    else next.set("view", "users");
    router.replace(`/search?${next.toString()}`, { scroll: false });
  };

  const activeTotal = viewParam === "users" ? userTotal : campaignTotal;
  const activeLabel = viewParam === "users" ? "user" : "campaign";

  const formatUSD = (dollars: number) =>
    dollars.toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const hasActiveFilters = Boolean(locationParam || categoryParam);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero / Search bar */}
      <section className="bg-[#F5F5F5] py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Search
          </h1>

          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center justify-center gap-3"
          >
            <div className="relative w-full max-w-md">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search campaigns and users..."
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-[#8BC34A] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#7CB342] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <main className="min-h-[60vh] max-w-7xl mx-auto px-6 py-12 w-full flex gap-10">
        {/* Sidebar: Filters */}
        <aside className="w-60 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#8BC34A] hover:text-[#7CB342] font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Location */}
          <div className="mb-6 relative">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value);
                setLocationDropdownOpen(true);
              }}
              onFocus={() => setLocationDropdownOpen(true)}
              onBlur={() =>
                setTimeout(() => setLocationDropdownOpen(false), 120)
              }
              onKeyDown={(e) => {
                if (
                  locationDropdownOpen &&
                  locationSuggestions.length > 0
                ) {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setLocationHighlight((h) =>
                      Math.min(h + 1, locationSuggestions.length - 1)
                    );
                    return;
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setLocationHighlight((h) => Math.max(h - 1, 0));
                    return;
                  }
                  if (e.key === "Escape") {
                    setLocationDropdownOpen(false);
                    return;
                  }
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (
                    locationDropdownOpen &&
                    locationHighlight >= 0 &&
                    locationSuggestions[locationHighlight]
                  ) {
                    setLocationInput(locationSuggestions[locationHighlight]);
                    setLocationDropdownOpen(false);
                    return;
                  }
                  handleApplyFilters();
                }
              }}
              placeholder="City or state"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            />
            {locationDropdownOpen && locationSuggestions.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {locationSuggestions.map((loc, i) => (
                  <li
                    key={loc}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setLocationInput(loc);
                      setLocationDropdownOpen(false);
                    }}
                    onMouseEnter={() => setLocationHighlight(i)}
                    className={`px-3 py-1.5 text-sm cursor-pointer ${
                      i === locationHighlight
                        ? "bg-[#8BC34A] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {loc}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[11px] text-gray-400 mt-1">
              Applies to campaigns and users
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Category{" "}
              <span className="text-gray-400 font-normal">— campaigns only</span>
            </label>
            <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
              {ALL_CATEGORIES.map((cat) => {
                const active = pendingCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-[#8BC34A] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplyFilters}
            disabled={!filtersDirty}
            className="mt-6 w-full bg-[#8BC34A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#7CB342] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Apply filters
          </button>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {loading && (
            <div className="text-center py-16 text-gray-500">Loading...</div>
          )}

          {!loading && (
            <>
              <div className="mb-8 flex items-center justify-between gap-4">
                <p className="text-gray-600">
                  {activeTotal} {activeLabel}
                  {activeTotal === 1 ? "" : "s"}
                  {queryParam && <> for &ldquo;{queryParam}&rdquo;</>}
                </p>
                <div className="bg-gray-100 rounded-full p-1 flex shrink-0">
                  <button
                    type="button"
                    onClick={() => setView("campaigns")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      viewParam === "campaigns"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Campaigns
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("users")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      viewParam === "users"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Users
                  </button>
                </div>
              </div>

              {activeTotal === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No {activeLabel}s found
                  </h3>
                  <p className="text-gray-500">
                    Try a different search term or clear your filters.
                  </p>
                </div>
              )}

              {/* Users section */}
              {viewParam === "users" && users.length > 0 && (
                <section className="mb-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                      <Link
                        key={user.id}
                        href={`/profile/${user.id}`}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 block p-4"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {user.avatar_url ? (
                            <Image
                              src={user.avatar_url}
                              alt={user.name || "User"}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover shrink-0"
                              unoptimized
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shrink-0">
                              {(user.name || "?").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate text-sm">
                              {[user.name, user.last_name]
                                .filter(Boolean)
                                .join(" ") || "Anonymous"}
                            </h3>
                            {user.created_at && (
                              <p className="text-[11px] text-gray-500">
                                Joined{" "}
                                {new Date(user.created_at).toLocaleDateString(
                                  undefined,
                                  { month: "short", year: "numeric" }
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                        {user.bio && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {user.bio}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>

                  {userPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-12">
                      <button
                        onClick={() =>
                          setUserPage((p) => Math.max(1, p - 1))
                        }
                        disabled={userPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {userPage} of {userPages}
                      </span>
                      <button
                        onClick={() =>
                          setUserPage((p) => Math.min(userPages, p + 1))
                        }
                        disabled={userPage === userPages}
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </section>
              )}

              {/* Campaigns section */}
              {viewParam === "campaigns" && campaigns.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    {[
                      { value: "recent", label: "Most Recent" },
                      { value: "most_funded", label: "Most Funded" },
                      { value: "ending_soon", label: "Ending Soon" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSort(option.value)}
                        className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                          sort === option.value
                            ? "bg-[#8BC34A] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                      <Link
                        key={campaign.id}
                        href={`/project/${campaign.slug || campaign.id}`}
                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 block"
                      >
                        <div className="relative h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                          {campaign.image_url ? (
                            <Image
                              src={campaign.image_url}
                              alt={campaign.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
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
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                            {campaign.title}
                          </h3>
                          {campaign.creator_name && (
                            <p className="text-xs text-gray-500 mb-1">
                              By{" "}
                              <span className="font-medium">
                                {campaign.creator_name}
                              </span>
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
                                style={{
                                  width: `${Math.min(
                                    campaign.funding_percentage,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                              <span>{campaign.donors_count} backers</span>
                              {campaign.days_left !== null &&
                                campaign.days_left > 0 && (
                                  <span>{campaign.days_left} days left</span>
                                )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {campaignPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-12">
                      <button
                        onClick={() =>
                          setCampaignPage((p) => Math.max(1, p - 1))
                        }
                        disabled={campaignPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {campaignPage} of {campaignPages}
                      </span>
                      <button
                        onClick={() =>
                          setCampaignPage((p) => Math.min(campaignPages, p + 1))
                        }
                        disabled={campaignPage === campaignPages}
                        className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}
