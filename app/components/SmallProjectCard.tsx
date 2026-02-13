"use client";

import Image from "next/image";

interface SmallProjectCardProps {
  image: string;
  title: string;
  creator: string;
  funded: string;
}

export default function SmallProjectCard({
  image,
  title,
  creator,
  funded,
}: SmallProjectCardProps) {
  return (
    <div className="flex gap-3 group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-1 truncate">
          Lorem ipsum dolor sit amet, consectetur
        </p>
        <p className="text-xs text-gray-500 mb-1">
          Funded 1/10 Project By: <span className="font-medium">{creator}</span>
        </p>
        <p className="text-xs text-gray-500">Funders: {funded}</p>

        {/* Stats */}
        <div className="flex items-center text-xs text-gray-400 space-x-3 mt-1">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Save
          </span>
          <span>0 Fund</span>
          <span>&gt; Mty</span>
        </div>
      </div>
    </div>
  );
}
