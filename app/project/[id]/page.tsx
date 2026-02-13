"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

const recommendedProjects = [
  { id: 1, image: "photo-1558618666-fcd25c85cd64", title: "Handcrafted Ceramic Pottery Collection", creator: "SARAH CHEN" },
  { id: 2, image: "photo-1493225457124-a3eb161ffa5f", title: "Independent Music Album: Echoes of Tomorrow", creator: "THE MIDNIGHT COLLECTIVE" },
  { id: 3, image: "photo-1511632765486-a01980e01a18", title: "Community Garden Initiative for Urban Schools", creator: "GREEN FUTURES" },
  { id: 4, image: "photo-1469474968028-56623f02e42e", title: "Documentary: Voices of the Mountains", creator: "WILD LENS FILMS" },
];

export default function ProjectDetail() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-[#8BC34A] hover:text-[#7CB342] transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
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
            Back
          </button>
        </div>

        {/* Project Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          ENCORE: BRONZE - THE ART OF LIAM SHARP
        </h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          A stunning 200-page hardcover art book showcasing three decades of fantasy and comic book
          artwork from acclaimed artist Liam Sharp, featuring never-before-seen sketches and commentary.
        </p>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Media */}
          <div className="lg:col-span-2">
            {/* Main Video/Image */}
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Image
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800"
                alt="Project cover"
                fill
                className="object-cover"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                  <svg
                    className="w-6 h-6 text-gray-800 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Country Flags */}
            <div className="flex items-center gap-2 mb-6">
              {["🇬🇧", "🇺🇸", "🇩🇪", "🇫🇷", "🇪🇸", "🇮🇹", "🇯🇵", "🇰🇷"].map((flag, i) => (
                <span key={i} className="text-xl">
                  {flag}
                </span>
              ))}
            </div>

            {/* Feature Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Over 200 pages of full-color artwork printed on premium archival paper.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Exclusive signed bookplate included with every early bird pledge.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#8BC34A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Worldwide shipping available with eco-friendly packaging materials.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Funding Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Funding Stats */}
              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900">US$ 60,984</p>
                <p className="text-sm text-gray-500 mb-4">pledged of $25,000 goal</p>

                <p className="text-2xl font-bold text-gray-900">427</p>
                <p className="text-sm text-gray-500 mb-4">backers</p>

                <p className="text-2xl font-bold text-gray-900">26</p>
                <p className="text-sm text-gray-500 mb-6">days to go</p>

                <button className="w-full bg-[#8BC34A] text-white py-3 rounded-lg font-medium hover:bg-[#7CB342] transition-colors mb-3">
                  Back this project
                </button>
                <p className="text-xs text-gray-500">
                  All or nothing. This project will only be funded if it reaches its goal by March 15, 2026.
                </p>
              </div>

              {/* Creator Info */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#8BC34A]" />
                  <div>
                    <p className="font-semibold text-gray-900">Liam Sharp</p>
                    <p className="text-xs text-gray-500">4 created · 54 backed</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Award-winning comic book artist known for work on Wonder Woman, Green Lantern, and
                  The Brave and the Bold. Currently based in the UK, creating fantasy worlds and
                  bringing mythical creatures to life through illustration.{" "}
                  <Link href="#" className="text-[#8BC34A] hover:underline">
                    Read More
                  </Link>
                </p>
              </div>

              {/* Support Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                <p className="text-xs text-gray-500 mb-3">Pledge without a reward</p>

                <div className="flex items-center border border-gray-200 rounded-lg mb-4">
                  <span className="px-3 text-gray-500">$</span>
                  <input
                    type="number"
                    defaultValue={10}
                    className="flex-1 py-2 pr-3 border-0 focus:ring-0 focus:outline-none"
                  />
                </div>

                <p className="text-xs text-gray-500">
                  Back it because you believe in it. Support the project for no reward,
                  just because it speaks to you. Your contribution helps bring this
                  creative vision to life and supports independent artists.{" "}
                  <Link href="#" className="text-[#8BC34A] hover:underline">
                    Learn More
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Story</h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            After 30 years in the comic book industry, I&apos;ve accumulated thousands of sketches,
            paintings, and illustrations that have never been seen by the public. This book represents
            my life&apos;s work and my passion for fantasy art and storytelling.
          </p>

          {/* Book Image and Green Circle */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="relative aspect-[3/4] max-w-sm rounded-lg overflow-hidden bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600"
                alt="Book cover"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-start">
              <div className="w-24 h-24 rounded-full bg-[#8BC34A] opacity-80" />
            </div>
          </div>

          {/* About the Book */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">About the Book</h3>
          <p className="text-gray-600 mb-4 max-w-3xl">
            &quot;Encore: Bronze&quot; is a comprehensive retrospective of my artistic journey, from my early
            days working on 2000 AD to my recent work with DC Comics. The book features over 300
            pieces of artwork, including concept sketches, character designs, cover art, and
            personal projects that have never been published.
          </p>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Each chapter explores a different era of my career, with detailed commentary about the
            creative process, the challenges faced, and the stories behind the art. You&apos;ll discover
            how iconic characters evolved from initial sketches to final illustrations, and gain
            insight into the techniques used to create them.
          </p>

          {/* Book Pages Preview */}
          <div className="relative aspect-[16/9] max-w-2xl rounded-lg overflow-hidden bg-gray-100 mb-8">
            <Image
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800"
              alt="Book pages preview"
              fill
              className="object-cover"
            />
          </div>

          <p className="text-gray-600 mb-8 max-w-3xl">
            The book is printed on 170gsm premium art paper with a cloth-bound hardcover and
            embossed gold lettering. Each copy is individually wrapped and shipped in a custom
            protective box to ensure it arrives in perfect condition. Early bird backers will also
            receive an exclusive art print not available anywhere else.
          </p>

          {/* Report Button */}
          <button className="px-6 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Report this project to CF
          </button>
        </section>

        {/* We Also Recommend Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
            We Also Recommend
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProjects.map((project) => (
              <Link key={project.id} href="/project/1" className="group cursor-pointer block">
                {/* Project Image */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 mb-3">
                  <Image
                    src={`https://images.unsplash.com/${project.image}?w=400`}
                    alt="Project thumbnail"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Project Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    78% funded · By:{" "}
                    <span className="font-semibold text-gray-700">{project.creator}</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Raised: <span className="font-medium">$12,450</span>
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span className="flex items-center hover:text-[#8BC34A] transition-colors">
                      <svg
                        className="w-4 h-4 mr-1"
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
                      Save
                    </span>
                    <span className="flex items-center hover:text-[#8BC34A] transition-colors">
                      <span className="mr-1">$</span>
                      Fund
                    </span>
                    <span className="flex items-center hover:text-[#8BC34A] transition-colors">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Skip
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View More Button */}
          <div className="flex justify-center mt-8">
            <button className="px-8 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              View More
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo */}
            <div>
              <span className="text-[#8BC34A] font-bold tracking-widest text-sm uppercase">
                Community Fundings
              </span>
            </div>

            {/* Links Column 1 */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">About</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  About Us
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  Our Charter
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  Stats
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  Press
                </p>
              </div>
            </div>

            {/* Links Column 2 */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Support</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  Help Center
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  Our Rules
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  Creator Resources
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  Brand Assets
                </p>
              </div>
            </div>

            {/* Links Column 3 */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 text-sm">More</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  Newsletter
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  Community Guidelines
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  Privacy Policy
                </p>
                <p className="hover:text-[#8BC34A] cursor-pointer transition-colors">
                  Terms of Use
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; 2011-2026 Community Fundings, PBC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
