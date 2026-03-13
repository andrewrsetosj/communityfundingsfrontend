"use client";

import Image from "next/image";

interface ProjectCardProps {
  image: string;
  title: string;
  creator: string;
  fundedPercent: number;
  funded: string;
  daysLeft?: number;
  size?: "small" | "medium" | "large";
}

export default function ProjectCard({
  image,
  title,
  creator,
  fundedPercent,
  funded,
  daysLeft,
  size = "medium",
}: ProjectCardProps) {
  const isSmall = size === "small";

  return (
    <div className="bg-white rounded-lg overflow-hidden group">
      {/* Image */}
      <div
        className={`relative overflow-hidden ${
          isSmall ? "h-32" : "h-48"
        } bg-gray-200`}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className={`font-medium text-gray-900 mb-1 line-clamp-2 ${
            isSmall ? "text-sm" : "text-base"
          }`}
        >
          {title}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Funded 1/10 Project By: <span className="font-medium">{creator}</span>
        </p>
        <p className="text-xs text-gray-500 mb-2">Funders: {funded}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
          <div
            className="bg-[#8BC34A] h-1 rounded-full"
            style={{ width: `${Math.min(fundedPercent, 100)}%` }}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center text-xs text-gray-500 space-x-4">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Save
          </span>
          <span>0 Fund</span>
          {daysLeft !== undefined && <span>&gt; {daysLeft}d</span>}
        </div>
      </div>
    </div>
  );
}
