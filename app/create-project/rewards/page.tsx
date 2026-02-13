"use client";

import { useState } from "react";
import Link from "next/link";

interface Reward {
  id: number;
  title: string;
  amount: string;
  description: string;
  deliveryDate: string;
  limit: string;
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [limit, setLimit] = useState("");

  const handleAddReward = () => {
    if (!title || !amount) return;

    const newReward: Reward = {
      id: Date.now(),
      title,
      amount,
      description,
      deliveryDate,
      limit,
    };

    setRewards([...rewards, newReward]);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDescription("");
    setDeliveryDate("");
    setLimit("");
    setShowForm(false);
    setEditingReward(null);
  };

  const handleDeleteReward = (id: number) => {
    setRewards(rewards.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Add rewards
      </h1>
      <p className="text-gray-600 mb-8">
        Offer tangible or intangible items to backers as a thank you for their support.
      </p>

      {/* Existing Rewards */}
      {rewards.length > 0 && (
        <div className="space-y-4 mb-8">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="border border-gray-200 rounded-lg p-6 hover:border-[#8BC34A] transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-[#8BC34A]">
                      ${reward.amount}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">
                      {reward.title}
                    </h3>
                  </div>
                  {reward.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {reward.description}
                    </p>
                  )}
                  <div className="flex gap-4 text-sm text-gray-500">
                    {reward.deliveryDate && (
                      <span>Delivery: {reward.deliveryDate}</span>
                    )}
                    {reward.limit && <span>Limit: {reward.limit} backers</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteReward(reward.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Reward Form */}
      {showForm ? (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            New Reward Tier
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Reward Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Early Bird Special"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Pledge Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="25"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what backers will receive..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Estimated Delivery
                </label>
                <input
                  type="month"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Limit (optional)
                </label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="Leave blank for unlimited"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReward}
                className="bg-[#8BC34A] text-white px-6 py-2 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
              >
                Add Reward
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#8BC34A] transition-colors group"
        >
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#F5F9F0] transition-colors">
              <svg
                className="w-6 h-6 text-gray-400 group-hover:text-[#8BC34A] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-gray-600 group-hover:text-[#8BC34A] transition-colors font-medium">
              Add a reward tier
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Create incentives for your backers
            </p>
          </div>
        </button>
      )}

      {/* Tips Section */}
      <div className="mt-8 bg-[#F5F9F0] rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Tips for great rewards</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#8BC34A] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Offer a range of price points to appeal to different backers
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#8BC34A] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Include early bird specials to encourage quick pledges
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#8BC34A] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Be realistic about delivery dates
          </li>
        </ul>
      </div>

      {/* Save & Continue Button */}
      <div className="mt-12 flex justify-end">
        <Link
          href="/create-project/story"
          className="bg-[#8BC34A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
        >
          Save & Continue
        </Link>
      </div>
    </div>
  );
}
