"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";

const categories = [
  { name: "Comics & Illustration", slug: "comics-illustration" },
  { name: "Design & Tech", slug: "design-tech" },
  { name: "Food & Craft", slug: "food-craft" },
  { name: "Arts", slug: "arts" },
  { name: "Film", slug: "film" },
  { name: "Game", slug: "game" },
  { name: "Music", slug: "music" },
  { name: "Publishing", slug: "publishing" },
];

export default function Header() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
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
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-700 flex-1">
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
                            className="px-3 py-2 text-sm text-gray-700 hover:bg-[#8BC34A]/10 hover:text-[#8BC34A] rounded-md transition-colors"
                          >
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
                <span className="text-[#8BC34A] font-bold tracking-widest text-lg uppercase">
                  Community Fundings
                </span>
              </Link>

              {/* Right Side */}
              <div className="flex items-center space-x-4 flex-1 justify-end">
                {/* Search Icon */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-500 hover:text-[#8BC34A] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.fullName || user?.firstName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
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
                        <div className="border-t border-gray-100 mt-2 pt-2">
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
