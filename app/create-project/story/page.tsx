"use client";

import { useState } from "react";
import Link from "next/link";

export default function StoryPage() {
  const [description, setDescription] = useState("");
  const [risks, setRisks] = useState("");

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Tell your story
      </h1>
      <p className="text-gray-600 mb-8">
        Describe what you&apos;re creating, why it matters, and how backers can help.
      </p>

      <div className="space-y-8">
        {/* Project Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Project Description
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent">
            {/* Simple Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex gap-2">
              <button className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded transition-colors font-bold text-sm">
                B
              </button>
              <button className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded transition-colors italic text-sm">
                I
              </button>
              <button className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-[#8BC34A] hover:bg-gray-100 rounded transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell potential backers about your project. What are you creating? Why does it matter? What makes it unique?

Include details about:
• The inspiration behind your project
• What you'll create with the funding
• Your timeline and milestones
• Your experience and qualifications"
              rows={12}
              className="w-full px-4 py-4 focus:outline-none resize-none"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            A compelling story is key to a successful campaign. Be authentic and specific.
          </p>
        </div>

        {/* Project Video */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Project Video (optional)
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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-600 mb-2">
                Drag and drop a video, or{" "}
                <span className="text-[#8BC34A] font-medium">browse</span>
              </p>
              <p className="text-sm text-gray-400">
                Projects with videos raise 2x more than those without
              </p>
            </div>
          </div>
        </div>

        {/* Risks and Challenges */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Risks and Challenges
          </label>
          <textarea
            value={risks}
            onChange={(e) => setRisks(e.target.value)}
            placeholder="What are the potential risks and challenges of this project, and how do you plan to address them?"
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent resize-none"
          />
          <p className="mt-2 text-sm text-gray-500">
            Being transparent about challenges builds trust with backers.
          </p>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-900">
              FAQ (optional)
            </label>
            <button className="text-sm text-[#8BC34A] font-medium hover:underline">
              + Add FAQ
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 text-center">
            <p className="text-gray-500 text-sm">
              No FAQs added yet. Add common questions and answers to help backers.
            </p>
          </div>
        </div>
      </div>

      {/* Save & Continue Button */}
      <div className="mt-12 flex justify-end">
        <Link
          href="/create-project/people"
          className="bg-[#8BC34A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
        >
          Save & Continue
        </Link>
      </div>
    </div>
  );
}
