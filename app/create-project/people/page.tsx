"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Collaborator {
  id: number;
  email: string;
  role: string;
  status: "pending" | "verified";
}

export default function PeoplePage() {
  const [vanityUrl, setVanityUrl] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const [newCollaboratorRole, setNewCollaboratorRole] = useState("collaborator");

  const handleAddCollaborator = () => {
    if (!newCollaboratorEmail) return;

    const newCollaborator: Collaborator = {
      id: Date.now(),
      email: newCollaboratorEmail,
      role: newCollaboratorRole,
      status: "pending",
    };

    setCollaborators([...collaborators, newCollaborator]);
    setNewCollaboratorEmail("");
    setNewCollaboratorRole("collaborator");
  };

  const handleRemoveCollaborator = (id: number) => {
    setCollaborators(collaborators.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
        Introduce yourself
      </h1>
      <p className="text-gray-600 mb-8">
        Help backers get to know you and your team.
      </p>

      <div className="space-y-8">
        {/* Creator Profile Card */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Creator Profile
          </label>
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <div className="flex items-start gap-6">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#8BC34A] rounded-full flex items-center justify-center text-white hover:bg-[#7CB342] transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  Your Name
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Creator • 0 projects created
                </p>
                <Link
                  href="/settings"
                  className="text-sm text-[#8BC34A] font-medium hover:underline"
                >
                  Edit profile settings
                </Link>
              </div>
            </div>

            {/* Creator Bio */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Short Bio
              </label>
              <textarea
                placeholder="Tell backers a bit about yourself..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent resize-none bg-white"
              />
            </div>
          </div>
        </div>

        {/* Vanity URL */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Vanity URL
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
              communityfundings.com/project/
            </span>
            <input
              type="text"
              value={vanityUrl}
              onChange={(e) => setVanityUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="my-awesome-project"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Create a custom URL for your project page. Use only lowercase letters, numbers, and hyphens.
          </p>
        </div>

        {/* Collaborators Section */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Collaborators
          </label>

          {/* Existing Collaborators */}
          {collaborators.length > 0 && (
            <div className="space-y-3 mb-6">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {collaborator.email}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {collaborator.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {collaborator.status === "pending" ? (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                        Pending
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                    <button
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Collaborator Form */}
          <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Invite a collaborator
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newCollaboratorEmail}
                  onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                  placeholder="collaborator@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Role
                </label>
                <select
                  value={newCollaboratorRole}
                  onChange={(e) => setNewCollaboratorRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent bg-white"
                >
                  <option value="collaborator">Collaborator</option>
                  <option value="co-creator">Co-Creator</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <button
                onClick={handleAddCollaborator}
                className="w-full bg-white border border-[#8BC34A] text-[#8BC34A] px-4 py-3 rounded-lg font-medium hover:bg-[#F5F9F0] transition-colors"
              >
                Send Invite
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Collaborators will receive an email invitation to join your project.
            </p>
          </div>
        </div>
      </div>

      {/* Save & Continue Button */}
      <div className="mt-12 flex justify-end">
        <Link
          href="/create-project/payment"
          className="bg-[#8BC34A] text-white px-8 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
        >
          Save & Continue
        </Link>
      </div>
    </div>
  );
}
