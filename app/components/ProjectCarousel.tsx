"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface ProjectCarouselProps {
  children: React.ReactNode;
  seeMoreHref: string;
  seeMoreLabel?: string;
}

export default function ProjectCarousel({
  children,
  seeMoreHref,
  seeMoreLabel = "See More",
}: ProjectCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(":scope > *")?.offsetWidth ?? 300;
    const gap = 24;
    const scrollAmount = (cardWidth + gap) * 2;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
        className="flex-shrink-0 hidden sm:block"
      >
        <svg className={`w-6 h-6 transition-colors ${canScrollLeft ? "text-gray-900" : "text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}

        {/* See More Card */}
        <Link
          href={seeMoreHref}
          className="flex-shrink-0 w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] snap-start rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 hover:border-[#8BC34A] hover:bg-[#8BC34A]/5 transition-colors min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-500">{seeMoreLabel}</span>
        </Link>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        aria-label="Scroll right"
        className="flex-shrink-0 hidden sm:block"
      >
        <svg className={`w-6 h-6 transition-colors ${canScrollRight ? "text-gray-900" : "text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
