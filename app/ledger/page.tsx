"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface DonorDonation {
  donation_id: number; amount: number; status: string; currency: string;
  platform_fee: number; net_amount: number; created_at: string;
  campaign_id: number; campaign_title: string; campaign_slug: string;
  campaign_creator_name: string;
}
interface CreatorDonation {
  donation_id: number; amount: number; status: string; currency: string;
  platform_fee: number; net_amount: number; donor_name: string;
  donor_email: string | null; created_at: string; campaign_id: number;
  campaign_title: string;
}
interface CampaignSummary {
  campaign_id: number; title: string; goal: number; raised: number; backers: number;
}

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}
function getAvatarColor(name: string) {
  const colors = ["bg-emerald-500","bg-blue-500","bg-purple-500","bg-rose-500","bg-amber-500","bg-teal-500","bg-indigo-500","bg-pink-500"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}
function formatDate(d: string) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function formatTime(d: string) { return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }
function StatusBadge({ status }: { status: string }) {
  const s: Record<string,string> = { succeeded:"bg-green-100 text-green-700", pending:"bg-yellow-100 text-yellow-700", failed:"bg-red-100 text-red-700" };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s[status]||"bg-gray-100 text-gray-600"}`}>{status.charAt(0).toUpperCase()+status.slice(1)}</span>;
}

export default function LedgerPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const [tab, setTab] = useState<"donor"|"creator">("donor");
  const [donorData, setDonorData] = useState<any>(null);
  const [creatorData, setCreatorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    async function loadLedger() {
      let token = localStorage.getItem("cf_backend_token");
      // If no token but Clerk user exists, sync first
      if (!token && clerkUser?.primaryEmailAddress?.emailAddress) {
        try {
          const syncRes = await fetch(`${API}/api/auth/clerk-sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: clerkUser.primaryEmailAddress.emailAddress, name: clerkUser.fullName || clerkUser.firstName || "User" }),
          });
          const syncData = await syncRes.json();
          if (syncData.access_token) {
            token = syncData.access_token;
            localStorage.setItem("cf_backend_token", token!);
          }
        } catch (e) { console.error("Clerk sync failed", e); }
      }
      if (!token) { setError("Please sign in to view your ledger."); setLoading(false); return; }
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [donorRes, creatorRes] = await Promise.all([
          fetch(`${API}/api/ledger/donor`, { headers }),
          fetch(`${API}/api/ledger/creator`, { headers }),
        ]);
        if (donorRes.status === 401 || creatorRes.status === 401) {
          localStorage.removeItem("cf_backend_token");
          setError("Session expired. Please sign in again.");
          setLoading(false);
          return;
        }
        setDonorData(await donorRes.json());
        setCreatorData(await creatorRes.json());
      } catch (e) { setError("Failed to load ledger."); }
      setLoading(false);
    }
    loadLedger();
  }, [isLoaded, clerkUser]);

  if (loading || !isLoaded) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7CB342]"/></div>;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-4">{error}</p>
        <Link href="/sign-in" className="bg-[#7CB342] text-white px-6 py-2 rounded-lg hover:bg-[#689F38]">Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">← Back to Home</Link>
          </div>
          <div className="flex items-center gap-4">
            {clerkUser?.imageUrl ? (
              <img src={clerkUser.imageUrl} className="w-14 h-14 rounded-full" alt="avatar" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#7CB342] flex items-center justify-center text-white text-xl font-bold">
                {getInitials(clerkUser?.fullName || donorData?.user_name || "U")}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{clerkUser?.fullName || donorData?.user_name || "My"}&apos;s Ledger</h1>
              <p className="text-gray-500">{clerkUser?.primaryEmailAddress?.emailAddress || "Track your donations and campaign earnings"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-[#7CB342] to-[#558B2F] rounded-xl p-4 text-white">
              <p className="text-sm opacity-80">Total Donated</p>
              <p className="text-2xl font-bold">${donorData?.total_donated?.toFixed(2)||"0.00"}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 text-white">
              <p className="text-sm opacity-80">Campaigns Supported</p>
              <p className="text-2xl font-bold">{donorData?.donation_count||0}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-4 text-white">
              <p className="text-sm opacity-80">Total Received</p>
              <p className="text-2xl font-bold">${creatorData?.total_received?.toFixed(2)||"0.00"}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl p-4 text-white">
              <p className="text-sm opacity-80">Net Earnings</p>
              <p className="text-2xl font-bold">${creatorData?.total_net?.toFixed(2)||"0.00"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="flex gap-1 bg-gray-200 rounded-lg p-1 w-fit">
          <button onClick={()=>setTab("donor")} className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${tab==="donor"?"bg-white text-gray-900 shadow-sm":"text-gray-600 hover:text-gray-900"}`}>My Donations</button>
          <button onClick={()=>setTab("creator")} className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${tab==="creator"?"bg-white text-gray-900 shadow-sm":"text-gray-600 hover:text-gray-900"}`}>Received (Business)</button>
        </div>
        {tab==="donor"&&(<div className="mt-6 space-y-3 pb-12">
          {donorData?.donations?.length===0&&<div className="text-center py-12 text-gray-400"><p className="text-lg">No donations yet</p><Link href="/" className="text-[#7CB342] hover:underline mt-2 inline-block">Browse campaigns</Link></div>}
          {donorData?.donations?.map((d:DonorDonation)=>(
            <Link key={d.donation_id} href={`/project/${d.campaign_id}`}>
              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(d.campaign_title)}`}>{getInitials(d.campaign_title)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{d.campaign_title}</p>
                    <p className="text-sm text-gray-500">By {d.campaign_creator_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${d.amount.toFixed(2)}</p>
                    <StatusBadge status={d.status}/>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>{formatDate(d.created_at)} at {formatTime(d.created_at)}</span>
                  <span>Fee: ${d.platform_fee.toFixed(2)} · Net: ${d.net_amount.toFixed(2)}</span>
                </div>
              </div>
            </Link>
          ))}
          {donorData?.donations?.length>0&&(
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 text-white mt-4">
              <div className="flex justify-between items-center">
                <div><p className="text-sm text-gray-300">Grand Total Donated</p><p className="text-3xl font-bold">${donorData.total_donated.toFixed(2)}</p></div>
                <div className="text-right"><p className="text-sm text-gray-300">{donorData.donation_count} successful donation{donorData.donation_count!==1?"s":""}</p></div>
              </div>
            </div>
          )}
        </div>)}
        {tab==="creator"&&(<div className="mt-6 space-y-6 pb-12">
          {creatorData?.campaigns?.map((c:CampaignSummary)=>(
            <div key={c.campaign_id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${getAvatarColor(c.title)}`}>{getInitials(c.title)}</div>
                  <div className="flex-1">
                    <Link href={`/project/${c.campaign_id}`} className="font-semibold text-gray-900 hover:text-[#7CB342]">{c.title}</Link>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1"><span>${c.raised.toFixed(0)} raised of ${c.goal.toFixed(0)}</span><span>{c.backers} backer{c.backers!==1?"s":""}</span></div>
                  </div>
                  <div className="w-20">
                    <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-[#7CB342] rounded-full h-2" style={{width:`${Math.min((c.raised/c.goal)*100,100)}%`}}/></div>
                    <p className="text-xs text-gray-400 text-right mt-1">{((c.raised/c.goal)*100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {creatorData.donations_received.filter((d:CreatorDonation)=>d.campaign_id===c.campaign_id).map((d:CreatorDonation)=>(
                  <div key={d.donation_id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${getAvatarColor(d.donor_name)}`}>{getInitials(d.donor_name)}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900">{d.donor_name}</p><p className="text-xs text-gray-400">{formatDate(d.created_at)} at {formatTime(d.created_at)}</p></div>
                    <div className="text-right"><p className="text-sm font-semibold">${d.amount.toFixed(2)}</p><StatusBadge status={d.status}/></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {creatorData?.campaigns?.length===0&&<div className="text-center py-12 text-gray-400"><p className="text-lg">No campaigns yet</p><Link href="/create-project/basics" className="text-[#7CB342] hover:underline mt-2 inline-block">Create a campaign</Link></div>}
          {creatorData?.donations_received?.length>0&&(
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 text-white">
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-sm text-gray-300">Total Received</p><p className="text-2xl font-bold">${creatorData.total_received.toFixed(2)}</p></div>
                <div><p className="text-sm text-gray-300">Platform Fees</p><p className="text-2xl font-bold text-red-400">-${creatorData.total_fees.toFixed(2)}</p></div>
                <div><p className="text-sm text-gray-300">Net Earnings</p><p className="text-2xl font-bold text-[#7CB342]">${creatorData.total_net.toFixed(2)}</p></div>
              </div>
            </div>
          )}
        </div>)}
      </div>
    </div>
  );
}
