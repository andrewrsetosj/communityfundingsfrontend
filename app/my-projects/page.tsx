"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Header from "../components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface OrgCampaign {
  campaign_id: number;
  title: string;
  url: string | null;
  status: string | null;
  category: string | null;
  funding_goal_cents: number;
  amount_raised_cents: number;
  backers: number;
  time_created: string | null;
}

interface Organization {
  organization_id: string;
  name: string;
  bio: string;
  campaigns: OrgCampaign[];
}

interface Campaign {
  id: number;
  title: string;
  slug: string | null;
  status: string | null;
  category: string | null;
  goal_amount: number;
  raised_amount: number;
  funding_percentage: number;
  donors_count: number;
  days_left: number | null;
  created_at: string | null;
}

export default function MyProjectsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"personal" | "organizations">("personal");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const token = localStorage.getItem("cf_backend_token");
    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch(`${API_URL}/api/campaigns/my-campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : [])),
      fetch(`${API_URL}/api/campaigns/my-organizations`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([campaignsData, orgsData]) => {
        setCampaigns(campaignsData);
        setOrganizations(orgsData);
      })
      .catch((err) => console.error("Failed to load projects:", err))
      .finally(() => setLoading(false));
  }, [isLoaded, user, router]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatUSD = (dollars: number) =>
    dollars.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const statusColor = (status: string | null) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "funded":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending_review":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (!isLoaded || loading) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center text-gray-500">
          Loading projects...
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12 flex gap-10">
        {/* Left Sidebar Tabs */}
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab("personal"); setSelectedOrgId(null); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "personal"
                  ? "bg-[#8BC34A]/10 text-[#8BC34A]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              My Personal Projects
            </button>
            <div>
              <button
                onClick={() => { setActiveTab("organizations"); setSelectedOrgId(null); }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "organizations"
                    ? "bg-[#8BC34A]/10 text-[#8BC34A]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                My Organizations
              </button>
              {activeTab === "organizations" && organizations.length > 0 && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                  {organizations.map((org) => (
                    <button
                      key={org.organization_id}
                      onClick={() => setSelectedOrgId(org.organization_id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedOrgId === org.organization_id
                          ? "bg-[#8BC34A]/10 text-[#8BC34A] font-medium"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {org.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                {activeTab === "personal"
                  ? "My Personal Projects"
                  : selectedOrgId
                    ? organizations.find((o) => o.organization_id === selectedOrgId)?.name || "Organization"
                    : "My Organizations"}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === "personal"
                  ? "Manage and track all of your campaigns."
                  : selectedOrgId
                    ? organizations.find((o) => o.organization_id === selectedOrgId)?.bio || "Organization campaigns."
                    : "Select an organization to view its projects."}
              </p>
            </div>
            <Link
              href="/create-project/basics"
              className="bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
            >
              New Project
            </Link>
          </div>

        {activeTab === "organizations" ? (
          organizations.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No organizations yet
              </h3>
              <p className="text-gray-500">
                Organization projects will appear here.
              </p>
            </div>
          ) : !selectedOrgId ? (
            <div className="text-center py-16 text-gray-500">
              <p>Select an organization from the sidebar to view its projects.</p>
            </div>
          ) : (() => {
            const org = organizations.find((o) => o.organization_id === selectedOrgId);
            if (!org) return null;
            return org.campaigns.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No campaigns yet
                </h3>
                <p className="text-gray-500">
                  This organization hasn&apos;t created any campaigns.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {org.campaigns.map((c) => (
                  <Link
                    key={c.campaign_id}
                    href={`/project/${c.url || c.campaign_id}`}
                    className="block border border-gray-200 rounded-xl p-6 hover:border-[#8BC34A] transition-colors bg-white"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                      {c.status && (
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColor(c.status)}`}>
                          {c.status.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      {c.category && (
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{c.category}</span>
                      )}
                      {c.time_created && (
                        <span>Created {formatDate(c.time_created)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">
                        {formatUSD(c.amount_raised_cents / 100)} raised of {formatUSD(c.funding_goal_cents / 100)}
                      </span>
                      <span className="text-[#8BC34A] font-medium">
                        {c.funding_goal_cents > 0 ? Math.round((c.amount_raised_cents / c.funding_goal_cents) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#8BC34A] h-2 rounded-full"
                        style={{ width: `${Math.min(100, c.funding_goal_cents > 0 ? (c.amount_raised_cents / c.funding_goal_cents) * 100 : 0)}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{c.backers} backers</span>
                    </div>
                  </Link>
                ))}
              </div>
            );
          })()
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first campaign and start raising funds.
            </p>
            <Link
              href="/create-project/basics"
              className="inline-block bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
            >
              Start a New Project
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/project/${campaign.slug || campaign.id}`}
                className="block border border-gray-200 rounded-xl p-6 hover:border-[#8BC34A] transition-colors bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {campaign.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColor(campaign.status)}`}
                      >
                        {campaign.status?.replace("_", " ") || "unknown"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {campaign.category && (
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {campaign.category}
                        </span>
                      )}
                      {campaign.created_at && (
                        <span>Created {formatDate(campaign.created_at)}</span>
                      )}
                    </div>

                    {/* Funding progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">
                          {formatUSD(campaign.raised_amount)} raised of {formatUSD(campaign.goal_amount)}
                        </span>
                        <span className="text-[#8BC34A] font-medium">
                          {campaign.funding_percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#8BC34A] h-2 rounded-full"
                          style={{ width: `${Math.min(campaign.funding_percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{campaign.donors_count} backers</span>
                        {campaign.days_left !== null && campaign.days_left > 0 && (
                          <span>{campaign.days_left} days left</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
      </div>
    </>
  );
}
