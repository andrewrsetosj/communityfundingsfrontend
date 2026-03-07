"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

const interests = [
  { name: "Art", icon: "🎨" },
  { name: "Comics", icon: "💬" },
  { name: "Crafts", icon: "✂️" },
  { name: "Dance", icon: "💃" },
  { name: "Design", icon: "🖌️" },
  { name: "Fashion", icon: "👗" },
  { name: "Film & Video", icon: "🎬" },
  { name: "Food", icon: "🍽️" },
  { name: "Games", icon: "🎮" },
  { name: "Journalism", icon: "📰" },
  { name: "Music", icon: "🎵" },
  { name: "Photography", icon: "📷" },
  { name: "Publishing", icon: "📚" },
  { name: "Technology", icon: "💻" },
  { name: "Theater", icon: "🎭" },
];

const MAX_INTERESTS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (name: string) => {
    setSelected((prev) => {
      if (prev.includes(name)) {
        return prev.filter((i) => i !== name);
      }
      if (prev.length >= MAX_INTERESTS) {
        return prev;
      }
      return [...prev, name];
    });
  };

  const handleContinue = () => {
    // TODO: save selected interests to user profile
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3 sm:mb-4">
            What Are You Interested In?
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-2">
            Pick up to {MAX_INTERESTS} interests so we can show you campaigns and projects you&apos;ll love. You can always change these later.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {selected.length} of {MAX_INTERESTS} selected
          </p>
        </div>

        {/* Interest Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {interests.map((interest) => {
            const isSelected = selected.includes(interest.name);
            const isDisabled = !isSelected && selected.length >= MAX_INTERESTS;

            return (
              <button
                key={interest.name}
                onClick={() => toggleInterest(interest.name)}
                disabled={isDisabled}
                className={`
                  relative flex flex-col items-center justify-center gap-2 p-4 sm:p-6 rounded-xl border-2 transition-all
                  ${
                    isSelected
                      ? "border-[#8BC34A] bg-[#8BC34A]/10 shadow-md"
                      : isDisabled
                        ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                        : "border-gray-200 bg-white hover:border-[#8BC34A]/50 hover:shadow-sm cursor-pointer"
                  }
                `}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-[#8BC34A] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                <span className="text-2xl sm:text-3xl">{interest.icon}</span>
                <span className={`text-xs sm:text-sm font-medium ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                  {interest.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex flex-col items-center gap-3 px-4">
          <button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className={`
              w-full max-w-md py-3 sm:py-4 rounded-lg font-medium transition-colors
              ${
                selected.length > 0
                  ? "bg-[#8BC34A] text-white hover:bg-[#7CB342]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Continue
          </button>
          <button
            onClick={handleContinue}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </main>
    </div>
  );
}
