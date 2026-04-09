"use client";

import { useEffect, useMemo, useState } from "react";
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

interface InviteCampaign {
  campaign_id: number;
  title: string;
  url: string | null;
  status: string | null;
  category: string | null;
  funding_goal_cents?: number | null;
  amount_raised_cents?: number | null;
  backers?: number | null;
  time_created?: string | null;
  creator_id?: string | null;
}

interface InviteCreator {
  creator_id?: string | null;
  username?: string | null;
  name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
}

interface CollaboratorInvite {
  collaborator_id: number;
  email: string;
  status: string;
  time_created: string | null;
  campaign: InviteCampaign | null;
  inviter?: InviteCreator | null;
}

interface CollaborationCampaign {
  campaign_id: number;
  title: string;
  url: string | null;
  status: string | null;
  category: string | null;
  funding_goal_cents: number;
  amount_raised_cents: number;
  backers: number;
  time_created: string | null;
  creator_id?: string | null;
  owner_name?: string | null;
  owner_last_name?: string | null;
  owner_username?: string | null;
}

type ProjectFilterValue = "all" | "active" | "draft" | "pending_review" | "inactive";
type ProjectSortValue = "newest" | "oldest" | "ending_soonest";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("cf_backend_token");
  if (!token || token === "undefined" || token === "null") return {};
  return { Authorization: `Bearer ${token}` };
}

function getProfileHref(person?: { username?: string | null; creator_id?: string | null }) {
  if (person?.username) return `/profile/${person.username}`;
  if (person?.creator_id) return `/profile/${person.creator_id}`;
  return "#";
}

function getInviterName(inviter?: InviteCreator | null) {
  if (!inviter) return "Unknown creator";
  return [inviter.name, inviter.last_name].filter(Boolean).join(" ").trim() || inviter.username || inviter.creator_id || "Unknown creator";
}

function getInviterHandle(inviter?: InviteCreator | null) {
  if (!inviter) return "";
  const handle = inviter.username || inviter.creator_id;
  return handle ? `@${handle}` : "";
}

function matchesProjectFilter(status: string | null | undefined, filterValue: ProjectFilterValue) {
  if (filterValue === "all") return true;
  if (filterValue === "active") return status === "active";
  if (filterValue === "draft") return status === "draft";
  if (filterValue === "pending_review") return status === "pending_review";
  if (filterValue === "inactive") return status === "inactive";
  return true;
}

function compareNullableDates(a?: string | null, b?: string | null, ascending = false) {
  const aTime = a ? new Date(a).getTime() : 0;
  const bTime = b ? new Date(b).getTime() : 0;
  return ascending ? aTime - bTime : bTime - aTime;
}

function sortPersonalCampaigns(items: Campaign[], sortValue: ProjectSortValue) {
  const copy = [...items];
  copy.sort((a, b) => {
    if (sortValue === "oldest") {
      return compareNullableDates(a.created_at, b.created_at, true);
    }

    if (sortValue === "ending_soonest") {
      const aDays = a.days_left ?? Number.POSITIVE_INFINITY;
      const bDays = b.days_left ?? Number.POSITIVE_INFINITY;
      if (aDays !== bDays) return aDays - bDays;
      return compareNullableDates(a.created_at, b.created_at, false);
    }

    return compareNullableDates(a.created_at, b.created_at, false);
  });
  return copy;
}

function sortCollaborationCampaigns(items: CollaborationCampaign[], sortValue: ProjectSortValue) {
  const copy = [...items];
  copy.sort((a, b) => {
    if (sortValue === "oldest") {
      return compareNullableDates(a.time_created, b.time_created, true);
    }

    if (sortValue === "ending_soonest") {
      const rank = (status?: string | null) => {
        if (status === "active") return 0;
        if (status === "draft") return 1;
        if (status === "pending_review") return 2;
        if (status === "inactive") return 3;
        return 4;
      };
      const aRank = rank(a.status);
      const bRank = rank(b.status);
      if (aRank !== bRank) return aRank - bRank;
      return compareNullableDates(a.time_created, b.time_created, false);
    }

    return compareNullableDates(a.time_created, b.time_created, false);
  });
  return copy;
}

function FilterAndSortControls({
  filterValue,
  sortValue,
  onFilterChange,
  onSortChange,
}: {
  filterValue: ProjectFilterValue;
  sortValue: ProjectSortValue;
  onFilterChange: (value: ProjectFilterValue) => void;
  onSortChange: (value: ProjectSortValue) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <span>Status</span>
        <select
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value as ProjectFilterValue)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#8BC34A] focus:border-[#8BC34A]"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="pending_review">Pending review</option>
          <option value="inactive">Inactive / Ended</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <span>Sort</span>
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value as ProjectSortValue)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#8BC34A] focus:border-[#8BC34A]"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="ending_soonest">Ending soonest</option>
        </select>
      </label>
    </div>
  );
}

export default function MyProjectsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [invites, setInvites] = useState<CollaboratorInvite[]>([]);
  const [collaborations, setCollaborations] = useState<CollaborationCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"personal" | "organizations" | "invites" | "collaborating">("personal");
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [processingInviteId, setProcessingInviteId] = useState<number | null>(null);

  const [personalFilter, setPersonalFilter] = useState<ProjectFilterValue>("all");
  const [personalSort, setPersonalSort] = useState<ProjectSortValue>("newest");
  const [collabFilter, setCollabFilter] = useState<ProjectFilterValue>("all");
  const [collabSort, setCollabSort] = useState<ProjectSortValue>("newest");

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
      fetch(`${API_URL}/api/campaigns/invites/received`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : [])),
      fetch(`${API_URL}/api/campaigns/my-collaborations`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([campaignsData, orgsData, invitesData, collaborationsData]) => {
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
        setOrganizations(Array.isArray(orgsData) ? orgsData : []);
        setInvites(Array.isArray(invitesData) ? invitesData : Array.isArray((invitesData as any)?.invites) ? (invitesData as any).invites : []);
        setCollaborations(Array.isArray(collaborationsData) ? collaborationsData : []);
      })
      .catch((err) => console.error("Failed to load campaigns:", err))
      .finally(() => setLoading(false));
  }, [isLoaded, user, router]);

  const formatDate = (dateStr: string | null | undefined) => {
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

  const statusColor = (status: string | null | undefined) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "funded":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending_review":
        return "bg-yellow-100 text-yellow-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "declined":
        return "bg-red-100 text-red-700";
      case "inactive":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  async function handleInviteAction(collaboratorId: number, action: "accept" | "decline") {
    try {
      setProcessingInviteId(collaboratorId);

      const response = await fetch(
        `${API_URL}/api/campaigns/invites/${collaboratorId}/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      if (!response.ok) {
        let detail = `Failed to ${action} invite`;
        try {
          const errorData = await response.json();
          if (errorData?.detail) detail = errorData.detail;
        } catch {}
        throw new Error(detail);
      }

      setInvites((prev) => prev.filter((invite) => invite.collaborator_id !== collaboratorId));

      if (action === "accept") {
        const token = localStorage.getItem("cf_backend_token");
        if (token) {
          const res = await fetch(`${API_URL}/api/campaigns/my-collaborations`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const collaborationsData = await res.json();
            setCollaborations(Array.isArray(collaborationsData) ? collaborationsData : []);
          }
        }
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : `Failed to ${action} invite`);
    } finally {
      setProcessingInviteId(null);
    }
  }

  const visiblePersonalCampaigns = useMemo(() => {
    const filtered = campaigns.filter((campaign) => matchesProjectFilter(campaign.status, personalFilter));
    return sortPersonalCampaigns(filtered, personalSort);
  }, [campaigns, personalFilter, personalSort]);

  const visibleCollaborationCampaigns = useMemo(() => {
    const filtered = collaborations.filter((campaign) => matchesProjectFilter(campaign.status, collabFilter));
    return sortCollaborationCampaigns(filtered, collabSort);
  }, [collaborations, collabFilter, collabSort]);

  if (!isLoaded || loading) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center text-gray-500">
          Loading campaigns...
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12 flex gap-10">
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
              My Personal Campaigns
            </button>

            <button
              onClick={() => { setActiveTab("collaborating"); setSelectedOrgId(null); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "collaborating"
                  ? "bg-[#8BC34A]/10 text-[#8BC34A]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Collaborating On
              {collaborations.length > 0 && (
                <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[#8BC34A] px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {collaborations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab("invites"); setSelectedOrgId(null); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "invites"
                  ? "bg-[#8BC34A]/10 text-[#8BC34A]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Invites Received
              {invites.length > 0 && (
                <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-[#8BC34A] px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {invites.length}
                </span>
              )}
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

        <div className="flex-1">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                {activeTab === "personal"
                  ? "My Personal Campaigns"
                  : activeTab === "collaborating"
                    ? "Collaborating On"
                    : activeTab === "invites"
                      ? "Invites Received"
                      : selectedOrgId
                        ? organizations.find((o) => o.organization_id === selectedOrgId)?.name || "Organization"
                        : "My Organizations"}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === "personal"
                  ? "Manage and track all of your campaigns."
                  : activeTab === "collaborating"
                    ? "Campaigns where you've joined as a collaborator."
                    : activeTab === "invites"
                      ? "Review collaboration invites and choose whether to join each campaign."
                      : selectedOrgId
                        ? organizations.find((o) => o.organization_id === selectedOrgId)?.bio || "Organization campaigns."
                        : "Select an organization to view its campaign."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {(activeTab === "personal" || activeTab === "collaborating") && (
                <FilterAndSortControls
                  filterValue={activeTab === "personal" ? personalFilter : collabFilter}
                  sortValue={activeTab === "personal" ? personalSort : collabSort}
                  onFilterChange={activeTab === "personal" ? setPersonalFilter : setCollabFilter}
                  onSortChange={activeTab === "personal" ? setPersonalSort : setCollabSort}
                />
              )}

              <Link
                href="/create-project/basics"
                className="inline-flex items-center justify-center bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
              >
                New Campaign
              </Link>
            </div>
          </div>

          {activeTab === "collaborating" ? (
            visibleCollaborationCampaigns.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No matching collaborations
                </h3>
                <p className="text-gray-500">
                  Try changing the filter or sort options.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleCollaborationCampaigns.map((campaign) => (
                  <Link
                    key={campaign.campaign_id}
                    href={`/project/${campaign.url || campaign.campaign_id}`}
                    className="block border border-gray-200 rounded-xl p-6 hover:border-[#8BC34A] transition-colors bg-white"
                  >
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColor(campaign.status)}`}>
                        {campaign.status?.replaceAll("_", " ") || "unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-wrap">
                      {campaign.category && (
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{campaign.category}</span>
                      )}
                      {campaign.time_created && <span>Created {formatDate(campaign.time_created)}</span>}
                      {(campaign.owner_name || campaign.owner_username) && (
                        <span>By {[campaign.owner_name, campaign.owner_last_name].filter(Boolean).join(" ").trim() || campaign.owner_username}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">
                        {formatUSD((campaign.amount_raised_cents || 0) / 100)} raised of {formatUSD((campaign.funding_goal_cents || 0) / 100)}
                      </span>
                      <span className="text-[#8BC34A] font-medium">
                        {campaign.funding_goal_cents > 0 ? Math.round(((campaign.amount_raised_cents || 0) / campaign.funding_goal_cents) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#8BC34A] h-2 rounded-full"
                        style={{ width: `${Math.min(100, campaign.funding_goal_cents > 0 ? ((campaign.amount_raised_cents || 0) / campaign.funding_goal_cents) * 100 : 0)}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{campaign.backers || 0} backers</span>
                    </div>
                  </Link>
                ))}
              </div>
            )
          ) : activeTab === "invites" ? (
            invites.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No invites yet
                </h3>
                <p className="text-gray-500">
                  Campaign collaboration invites will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {invites.map((invite) => {
                  const campaign = invite.campaign;
                  const inviter = invite.inviter;
                  const isProcessing = processingInviteId === invite.collaborator_id;

                  return (
                    <div
                      key={invite.collaborator_id}
                      className="border border-gray-200 rounded-xl p-6 bg-white"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {campaign?.title || "Untitled campaign"}
                            </h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColor(invite.status)}`}>
                              {invite.status}
                            </span>
                            {campaign?.status && (
                              <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColor(campaign.status)}`}>
                                {campaign.status.replaceAll("_", " ")}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                            {campaign?.category && (
                              <span className="bg-gray-100 px-2 py-1 rounded text-xs">{campaign.category}</span>
                            )}
                            {invite.time_created && (
                              <span>Invited {formatDate(invite.time_created)}</span>
                            )}
                            {campaign?.time_created && (
                              <span>Campaign created {formatDate(campaign.time_created)}</span>
                            )}
                          </div>

                          {inviter && (
                            <div className="mt-4 text-sm text-gray-700">
                              Invited by{" "}
                              <Link
                                href={getProfileHref(inviter)}
                                className="font-medium text-gray-900 hover:text-[#8BC34A] transition-colors"
                              >
                                {getInviterName(inviter)}
                              </Link>
                              {getInviterHandle(inviter) ? (
                                <span className="text-gray-500"> ({getInviterHandle(inviter)})</span>
                              ) : null}
                            </div>
                          )}

                          {campaign ? (
                            <div className="mt-4">
                              <Link
                                href={`/project/${campaign.url || campaign.campaign_id}`}
                                className="inline-flex items-center text-sm font-medium text-[#8BC34A] hover:text-[#7CB342]"
                              >
                                View campaign
                              </Link>
                            </div>
                          ) : null}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleInviteAction(invite.collaborator_id, "decline")}
                            className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isProcessing ? "Working..." : "Decline"}
                          </button>
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleInviteAction(invite.collaborator_id, "accept")}
                            className="px-5 py-2.5 rounded-full bg-[#8BC34A] text-white hover:bg-[#7CB342] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isProcessing ? "Working..." : "Accept"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : activeTab === "organizations" ? (
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
                  Organization campaign will appear here.
                </p>
              </div>
            ) : !selectedOrgId ? (
              <div className="text-center py-16 text-gray-500">
                <p>Select an organization from the sidebar to view its campaigns.</p>
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
          ) : visiblePersonalCampaigns.length === 0 ? (
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
                No matching campaigns
              </h3>
              <p className="text-gray-500 mb-6">
                Try changing the filter or sort options.
              </p>
              <Link
                href="/create-project/basics"
                className="inline-block bg-[#8BC34A] text-white px-6 py-3 rounded-full font-medium hover:bg-[#7CB342] transition-colors"
              >
                Start a New Campaign
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {visiblePersonalCampaigns.map((campaign) => (
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
