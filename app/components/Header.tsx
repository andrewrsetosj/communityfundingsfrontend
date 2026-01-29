"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="w-full">
      {/* Top Banner */}
      <div className="bg-[#8BC34A] text-white text-center py-2 text-sm">
        Community Funding is a project we&apos;re building together. Stay informed with our new blog, Project Updates.
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-[#8BC34A] font-bold tracking-widest text-lg uppercase">
              Community Fundings
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
            <Link href="/" className="hover:text-[#8BC34A] transition-colors">
              Comics & Illustration
            </Link>
            <Link href="/" className="hover:text-[#8BC34A] transition-colors">
              Design & Tech
            </Link>
            <Link href="/" className="hover:text-[#8BC34A] transition-colors">
              Food & Craft
            </Link>
            <Link href="/" className="hover:text-[#8BC34A] transition-colors">
              Arts
            </Link>
            <Link href="/" className="hover:text-[#8BC34A] transition-colors">
              Film
            </Link>
            <Link href="/" className="hover:text-[#8BC34A] transition-colors">
              Game
            </Link>
            <Link href="/" className="hover:text-[#8BC34A] transition-colors">
              Music
            </Link>
            <Link href="/" className="hover:text-[#8BC34A] transition-colors">
              Publishing
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="text-gray-500 hover:text-[#8BC34A] transition-colors">
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
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  );
}
