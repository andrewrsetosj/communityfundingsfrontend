"use client";

import { useState } from "react";
import Link from "next/link";

export default function BasicsPage() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [location, setLocation] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [duration, setDuration] = useState("");

  const categories = [
    "Art",
    "Comics",
    "Crafts",
    "Dance",
    "Design",
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
  ];

  const subcategories: { [key: string]: string[] } = {
    Art: ["Ceramics", "Conceptual Art", "Digital Art", "Illustration", "Installations", "Mixed Media", "Painting", "Performance Art", "Public Art", "Sculpture"],
    Music: ["Blues", "Classical", "Country", "Electronic", "Folk", "Hip-Hop", "Indie Rock", "Jazz", "Pop", "Rock", "World Music"],
    Technology: ["3D Printing", "Apps", "Camera Equipment", "DIY Electronics", "Fabrication Tools", "Flight", "Gadgets", "Hardware", "Robots", "Software", "Wearables"],
    Film: ["Action", "Animation", "Comedy", "Documentary", "Drama", "Horror", "Science Fiction", "Shorts", "Thrillers", "Webseries"],
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Start with the basics
      </h1>
      <p className="text-gray-600 mb-8">
        Make it easy for people to learn about your project.
      </p>

      <div className="space-y-8">
        {/* Project Title */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Project Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your project title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
          />
          <p className="mt-2 text-sm text-gray-500">
            Write a clear, brief title that helps people quickly understand your project.
          </p>
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter a short subtitle"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
          />
          <p className="mt-2 text-sm text-gray-500">
            A brief description that appears below your title.
          </p>
        </div>

        {/* Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory("");
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Subcategory
            </label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
              disabled={!category}
            >
              <option value="">Select a subcategory</option>
              {category &&
                subcategories[category]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Project Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city or region"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
          />
          <p className="mt-2 text-sm text-gray-500">
            Where is your project based? This helps backers find local projects.
          </p>
        </div>

        {/* Project Image */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Project Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#8BC34A] transition-colors cursor-pointer">
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-600 mb-2">
                Drag and drop an image, or{" "}
                <span className="text-[#8BC34A] font-medium">browse</span>
              </p>
              <p className="text-sm text-gray-400">
                Recommended: 1024 x 576 pixels (16:9)
              </p>
            </div>
          </div>
        </div>

        {/* Funding Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Funding Goal
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="text"
              value={fundingGoal}
              onChange={(e) => setFundingGoal(e.target.value)}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Set a realistic funding goal that covers your project costs.
          </p>
        </div>

        {/* Campaign Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Campaign Duration
          </label>
          <div className="relative">
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
              min="1"
              max="60"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              days
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Campaigns can run for 1-60 days. Shorter campaigns create urgency.
          </p>
        </div>
      </div>

      {/* Save & Continue Button */}
      <div className="mt-12 flex justify-end">
        <Link
          href="/create-project/rewards"
          className="bg-[#8BC34A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
        >
          Save & Continue
        </Link>
      </div>
    </div>
  );
}
