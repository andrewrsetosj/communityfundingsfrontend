"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getInitials(n:string){return n.split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2)}
function getColor(n:string){const c=["bg-emerald-500","bg-blue-500","bg-purple-500","bg-rose-500","bg-amber-500","bg-teal-500"];let h=0;for(let i=0;i<n.length;i++)h=n.charCodeAt(i)+((h<<5)-h);return c[Math.abs(h)%c.length]}

export default function AdminPage(){
  const {user:clerkUser,isLoaded}=useUser();
  const [tab,setTab]=useState<"my"|"deleted">("my");
  const [myCampaigns,setMyCampaigns]=useState<any[]>([]);
  const [deleted,setDeleted]=useState<any[]>([]);
  const [donors,setDonors]=useState<Record<number,any[]>>({});
  const [expandedCampaign,setExpandedCampaign]=useState<number|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [msg,setMsg]=useState("");
  const [creatorStats,setCreatorStats]=useState<any>(null);

  const getToken=()=>localStorage.getItem("cf_backend_token")||"";
  const headers=()=>({Authorization:`Bearer ${getToken()}`,"Content-Type":"application/json"});

  async function load(){
    let token=getToken();
    if(!token&&clerkUser?.primaryEmailAddress?.emailAddress){
      const r=await fetch(`${API}/api/auth/clerk-sync`,{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:clerkUser.primaryEmailAddress.emailAddress,name:clerkUser.fullName||"Admin"})});
      const d=await r.json();
      if(d.access_token){localStorage.setItem("cf_backend_token",d.access_token);token=d.access_token}
    }
    if(!token){setError("Please sign in.");setLoading(false);return}
    const h={Authorization:`Bearer ${token}`};
    try{
      const[creatorR,deletedR]=await Promise.all([
        fetch(`${API}/api/ledger/creator`,{headers:h}).then(r=>r.ok?r.json():null).catch(()=>null),
        fetch(`${API}/api/admin/campaigns/deleted`,{headers:h}).then(r=>r.ok?r.json():[]).catch(()=>[]),
      ]);
      if(creatorR){setCreatorStats(creatorR);setMyCampaigns(creatorR.campaigns||[])}
      setDeleted(deletedR||[]);
    }catch{setError("Failed to load.")}
    setLoading(false);
  }

  useEffect(()=>{if(isLoaded)load()},[isLoaded,clerkUser]);

  async function loadDonors(campaignId:number){
    if(expandedCampaign===campaignId){setExpandedCampaign(null);return}
    if(donors[campaignId]){setExpandedCampaign(campaignId);return}
    const r=await fetch(`${API}/api/ledger/campaign/${campaignId}/donors`,{headers:headers()});
    if(r.ok){const d=await r.json();setDonors(prev=>({...prev,[campaignId]:d}));setExpandedCampaign(campaignId)}
  }

  async function handleDelete(id:number,title:string){
    if(!confirm(`Delete "${title}"?`))return;
    const reason=prompt("Reason:","No longer needed")||"Admin removal";
    const r=await fetch(`${API}/api/admin/campaigns/${id}/delete?reason=${encodeURIComponent(reason)}`,{method:"POST",headers:headers()});
    if(r.ok){setMsg(`"${title}" deleted.`);load()}else setMsg("Failed.");
  }

  async function handleRestore(id:number,title:string){
    if(!confirm(`Restore "${title}"?`))return;
    const r=await fetch(`${API}/api/admin/campaigns/${id}/restore`,{method:"POST",headers:headers()});
    if(r.ok){setMsg(`"${title}" restored!`);load()}else setMsg("Failed.");
  }

  if(loading||!isLoaded)return<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7CB342]"/></div>;
  if(error&&!creatorStats)return<div className="min-h-screen flex items-center justify-center flex-col gap-4"><p className="text-gray-500">{error}</p><Link href="/" className="text-[#7CB342] underline">Home</Link></div>;

  const totalRaised=myCampaigns.reduce((s,c)=>s+(c.raised||0),0);
  const totalBackers=myCampaigns.reduce((s,c)=>s+(c.backers||0),0);

  return(
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">← Back to Home</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Campaign Admin</h1>
          <p className="text-gray-500">Manage your campaigns</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-[#7CB342] to-[#558B2F] rounded-xl p-4 text-white"><p className="text-sm opacity-80">My Campaigns</p><p className="text-2xl font-bold">{myCampaigns.length}</p></div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 text-white"><p className="text-sm opacity-80">Total Raised</p><p className="text-2xl font-bold">${totalRaised.toFixed(0)}</p></div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-4 text-white"><p className="text-sm opacity-80">Total Backers</p><p className="text-2xl font-bold">{totalBackers}</p></div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl p-4 text-white"><p className="text-sm opacity-80">Net Earnings</p><p className="text-2xl font-bold">${(creatorStats?.total_net||0).toFixed(0)}</p></div>
          </div>
        </div>
      </div>
      {msg&&<div className="max-w-5xl mx-auto px-6 mt-4"><div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm flex justify-between"><span>{msg}</span><button onClick={()=>setMsg("")}>×</button></div></div>}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="flex gap-1 bg-gray-200 rounded-lg p-1 w-fit">
          <button onClick={()=>setTab("my")} className={`px-6 py-2 rounded-md text-sm font-medium ${tab==="my"?"bg-white text-gray-900 shadow-sm":"text-gray-600"}`}>My Campaigns ({myCampaigns.length})</button>
          <button onClick={()=>setTab("deleted")} className={`px-6 py-2 rounded-md text-sm font-medium ${tab==="deleted"?"bg-white text-gray-900 shadow-sm":"text-gray-600"}`}>Deleted ({deleted.length})</button>
        </div>
        {tab==="my"&&(
          <div className="mt-6 space-y-3 pb-12">
            {myCampaigns.length===0&&<p className="text-gray-400 text-center py-8">No campaigns yet</p>}
            {myCampaigns.map((c:any)=>(
              <div key={c.campaign_id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${getColor(c.title)}`}>{getInitials(c.title)}</div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/project/${c.campaign_id}`} className="font-semibold text-gray-900 hover:text-[#7CB342]">{c.title}</Link>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span>${c.raised?.toFixed(0)} / ${c.goal?.toFixed(0)}</span>
                        <span>{c.backers} backer{c.backers!==1?"s":""}</span>
                        <span>{c.goal>0?((c.raised/c.goal)*100).toFixed(1):0}% funded</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2"><div className="bg-[#7CB342] rounded-full h-1.5" style={{width:`${Math.min((c.raised/c.goal)*100,100)}%`}}/></div>
                    </div>
                    <button onClick={()=>loadDonors(c.campaign_id)} className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">{expandedCampaign===c.campaign_id?"Hide":"Donors"}</button>
                    <button onClick={()=>handleDelete(c.campaign_id,c.title)} className="px-4 py-2 text-sm font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Delete</button>
                  </div>
                </div>
                {expandedCampaign===c.campaign_id&&donors[c.campaign_id]&&(
                  <div className="border-t border-gray-100 bg-gray-50">
                    <div className="px-5 py-3 text-xs font-medium text-gray-500 uppercase flex"><span className="flex-1">Donor</span><span className="w-24 text-right">Amount</span><span className="w-28 text-right">Location</span><span className="w-24 text-right">Date</span></div>
                    {donors[c.campaign_id].map((d:any)=>(
                      <div key={d.donation_id} className="px-5 py-3 flex items-center border-t border-gray-100 hover:bg-white">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${getColor(d.donor_name)}`}>{getInitials(d.donor_name)}</div>
                          <div><p className="text-sm font-medium text-gray-900">{d.donor_name}</p><p className="text-xs text-gray-400">{d.donor_email}</p></div>
                        </div>
                        <span className="w-24 text-right text-sm font-semibold text-gray-900">${d.amount.toFixed(2)}</span>
                        <span className="w-28 text-right text-xs text-gray-500">{d.location||"—"}</span>
                        <span className="w-24 text-right text-xs text-gray-400">{new Date(d.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
                      </div>
                    ))}
                    {donors[c.campaign_id].length===0&&<p className="px-5 py-4 text-gray-400 text-sm">No donations yet</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {tab==="deleted"&&(
          <div className="mt-6 space-y-3 pb-12">
            {deleted.length===0&&<p className="text-gray-400 text-center py-8">No deleted campaigns</p>}
            {deleted.map((c:any)=>(
              <div key={c.campaign_id} className="bg-white rounded-xl border border-dashed border-gray-300 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-sm">{getInitials(c.title)}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-500 line-through">{c.title}</p>
                    <p className="text-sm text-gray-400">Deleted {new Date(c.deleted_at).toLocaleDateString()} · {c.reason}</p>
                    <p className="text-xs text-gray-400">${c.raised?.toFixed(0)} raised · {c.backers} backers</p>
                  </div>
                  <button onClick={()=>handleRestore(c.campaign_id,c.title)} className="px-4 py-2 text-sm font-medium bg-[#7CB342] text-white rounded-lg hover:bg-[#689F38]">Restore</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
