"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import { backendJwtExpired, syncClerkToBackendToken } from "@/lib/backendToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type BusinessRole = "owner" | "admin" | "viewer" | "editor" | "campaign_editor" | "finance";

interface BusinessMembership {
  organization_id: string;
  name: string;
  bio: string;
  logo_url: string | null;
  role: BusinessRole;
}

const ROLE_LABEL: Record<string, string> = {
  owner:            "Owner",
  admin:            "Admin",
  finance:          "Finance",
  campaign_editor:  "Editor",
  viewer:           "Viewer",
};

const roleBadgeStyle = (role: string) => {
  const styles: Record<string, string> = {
    owner:           "bg-purple-100 text-purple-700",
    admin:           "bg-red-100 text-red-700",
    finance:         "bg-yellow-100 text-yellow-700",
    campaign_editor: "bg-blue-100 text-blue-700",
    viewer:          "bg-gray-100 text-gray-600",
  };
  return styles[role] ?? "bg-gray-100 text-gray-600";
};

const categories = [
  {
    name: "Comics & Illustration",
    slug: "comics-illustration",
    iconPath: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  },
  {
    name: "Design & Tech",
    slug: "design-tech",
    iconPath: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    name: "Food & Craft",
    slug: "food-craft",
    iconPath: "M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z",
  },
  {
    name: "Arts",
    slug: "arts",
    iconPath: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
  },
  {
    name: "Film",
    slug: "film",
    iconPath: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z",
  },
  {
    name: "Game",
    slug: "game",
    iconPath: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
  },
  {
    name: "Music",
    slug: "music",
    iconPath: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
  },
  {
    name: "Publishing",
    slug: "publishing",
    iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
];

export default function Header() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [myBusinesses, setMyBusinesses] = useState<BusinessMembership[]>([]);
  const [businessesLoading, setBusinessesLoading] = useState(false);
  const [isBizExpanded, setIsBizExpanded] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeSearch]);

  // Focus the input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
    }
  };

  // Fetch businesses when dropdown opens — ensures token is ready first
  useEffect(() => {
    if (!isDropdownOpen || !user) return;
    let cancelled = false;
    const run = async () => {
      setBusinessesLoading(true);
      try {
        let token = localStorage.getItem("cf_backend_token");
        if (!token || backendJwtExpired(token)) {
          await syncClerkToBackendToken(user);
          token = localStorage.getItem("cf_backend_token");
        }
        if (!token || cancelled) return;
        const res = await fetch(`${API_URL}/api/organizations/my-memberships`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        const data = res.ok ? await res.json() : [];
        setMyBusinesses(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setMyBusinesses([]);
      } finally {
        if (!cancelled) setBusinessesLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [isDropdownOpen, user]);

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <header className="w-full">
      {/* Top Banner */}
      <div className="bg-[#8BC34A] text-white text-center py-2 text-sm">
        Community Funding is a project we&apos;re building together. Stay informed with our new blog, Project Updates.
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 px-20 py-4">
        <div className="mx-auto flex items-center justify-between">
          {isSearchOpen ? (
            /* Search Bar (replaces nav content) */
            <div ref={searchRef} className="flex items-center gap-3 w-full">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 w-full">
                <div className="relative flex-1">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
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
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") closeSearch();
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={closeSearch}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
          ) : (
            /* Normal nav content */
            <>
              {/* Left Nav Links */}
              <div className="hidden md:flex items-center space-x-10 text-md text-gray-700 flex-1">
                  <Link href="/about-us" className="hover:text-[#8BC34A] transition-colors">
                  About Us
                </Link>
                <Link href="/how-it-works" className="hover:text-[#8BC34A] transition-colors">
                  How it Works
                </Link>
                <Link href="/projects-we-love" className="hover:text-[#8BC34A] transition-colors">
                  Projects We Love
                </Link>
                <div className="relative" ref={categoriesRef}>
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="flex items-center hover:text-[#8BC34A] transition-colors"
                  >
                    Categories
                    <svg
                      className={`w-4 h-4 ml-1 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isCategoriesOpen && (
                    <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-3 z-50">
                      <div className="grid grid-cols-2 gap-1 px-2">
                        {categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/categories/${category.slug}`}
                            onClick={() => setIsCategoriesOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-[#8BC34A]/10 hover:text-[#8BC34A] rounded-md transition-colors"
                          >
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={category.iconPath}
                              />
                            </svg>
                            {category.name}
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 mt-2 pt-2 px-2">
                        <Link
                          href="/categories"
                          onClick={() => setIsCategoriesOpen(false)}
                          className="block px-3 py-2 text-sm font-medium text-[#8BC34A] hover:bg-[#8BC34A]/10 rounded-md transition-colors"
                        >
                          View All Categories
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Center Logo */}
              <Link href="/" className="flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Community Fundings"
                  width={160}
                  height={48}
                  className="object-contain"
                  priority
                />
              </Link>

              {/* Right Side */}
              <div className="flex items-center space-x-10 flex-1 justify-end">
                {/* Search Icon */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-500 hover:text-[#8BC34A] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
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
                </button>

                {/* Auth Buttons */}
                <SignedOut>
                  <Link
                    href="/sign-in"
                    className="bg-[#8BC34A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#7CB342] transition-colors"
                  >
                    Log In
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className="relative" ref={dropdownRef}>
                    {/* Profile Button */}
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center focus:outline-none"
                    >
                      {user?.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt="Profile"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <Link
                        href={`/profile/${user?.id}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                        <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.fullName || user?.firstName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                        {user?.primaryEmailAddress?.emailAddress}
                        </p>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Settings
                        </Link>
                        <Link
                          href="/my-projects"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400"
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
                          My Projects
                        </Link>
                        <Link
                          href="/drafts"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Drafts
                        </Link>
                        <Link
                          href="/saved"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                          Saved Projects
                        </Link>
                        {/* My Businesses */}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={() => setIsBizExpanded((v) => !v)}
                            className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              My Businesses
                            </span>
                            <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isBizExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {isBizExpanded && (
                            <div className="mx-3 mb-2 rounded-lg border border-gray-100 overflow-hidden">
                              {/* Business list */}
                              {businessesLoading ? (
                                <div className="flex items-center justify-center py-4">
                                  <svg className="w-4 h-4 animate-spin text-[#8BC34A]" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                  </svg>
                                </div>
                              ) : myBusinesses.length === 0 ? (
                                <p className="text-xs text-gray-400 text-center py-3 px-3">
                                  No businesses yet.
                                </p>
                              ) : (
                                <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto">
                                  {myBusinesses.map((biz) => (
                                    <Link key={biz.organization_id} href={`/business/${biz.organization_id}`} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors">
                                      <div className="w-7 h-7 rounded-md bg-[#F5F9F0] flex items-center justify-center shrink-0 overflow-hidden">
                                        {biz.logo_url ? (
                                          <Image src={biz.logo_url} alt={biz.name} width={28} height={28} className="object-cover w-full h-full" />
                                        ) : (
                                          <svg className="w-3.5 h-3.5 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                          </svg>
                                        )}
                                      </div>
                                      <span className="flex-1 text-xs font-medium text-gray-800 truncate">{biz.name}</span>
                                      <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleBadgeStyle(biz.role)}`}>
                                        {ROLE_LABEL[biz.role] ?? biz.role}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              )}

                              {/* Create Business link */}
                              <div className="border-t border-gray-100">
                                <Link
                                  href="/settings?tab=create-business"
                                  onClick={() => setIsDropdownOpen(false)}
                                  className="flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-medium text-[#8BC34A] hover:bg-[#F5F9F0] transition-colors"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                  Create Business
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </SignedIn>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
