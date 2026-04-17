"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getInitials(n:string){return n?.split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2)||"?"}
function getColor(n:string){const c=["#10b981","#3b82f6","#8b5cf6","#f43f5e","#f59e0b","#14b8a6","#ec4899","#6366f1"];let h=0;for(let i=0;i<(n||"").length;i++)h=n.charCodeAt(i)+((h<<5)-h);return c[Math.abs(h)%c.length]}

function CampaignCard({c,onExpand,expanded,donors,onDelete}:{c:any,onExpand:()=>void,expanded:boolean,donors:any[],onDelete:()=>void}){
  const pct=c.goal>0?Math.min((c.raised/c.goal)*100,100):0;
  return(
    <div className="min-w-[340px] max-w-[340px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 overflow-hidden">
      <div className="h-2 w-full" style={{background:`linear-gradient(90deg, ${getColor(c.title)} ${pct}%, #e5e7eb ${pct}%)`}}/>
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{backgroundColor:getColor(c.title)}}>{getInitials(c.title)}</div>
          <div className="flex-1 min-w-0">
            <Link href={`/project/${c.campaign_id}`} className="font-semibold text-gray-900 hover:text-emerald-600 text-sm leading-tight line-clamp-2">{c.title}</Link>
            <p className="text-xs text-gray-400 mt-0.5">{c.category||"General"} · {c.location||"—"}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-gray-50 rounded-lg p-2 text-center"><p className="text-xs text-gray-400">Raised</p><p className="text-sm font-bold text-gray-900">${(c.raised||0).toFixed(0)}</p></div>
          <div className="bg-gray-50 rounded-lg p-2 text-center"><p className="text-xs text-gray-400">Goal</p><p className="text-sm font-bold text-gray-900">${(c.goal||0).toFixed(0)}</p></div>
          <div className="bg-gray-50 rounded-lg p-2 text-center"><p className="text-xs text-gray-400">Backers</p><p className="text-sm font-bold text-gray-900">{c.backers||0}</p></div>
        </div>
        <div className="flex gap-2">
          <button onClick={onExpand} className="flex-1 py-2 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">{expanded?"Hide Donors":"View Donors"}</button>
          <button onClick={onDelete} className="px-3 py-2 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
        </div>
      </div>
      {expanded&&(
        <div className="border-t border-gray-100 bg-gray-50 max-h-[240px] overflow-y-auto">
          {donors.length===0&&<p className="p-4 text-gray-400 text-xs text-center">No donations yet</p>}
          {donors.map((d:any)=>(
            <div key={d.donation_id} className="px-4 py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{backgroundColor:getColor(d.donor_name)}}>{getInitials(d.donor_name)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{d.donor_name}</p>
                  <p className="text-[10px] text-gray-400">{d.donor_email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${d.amount.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-400">{d.location||"—"}</p>
                </div>
              </div>
              {d.message&&<p className="mt-1.5 text-[11px] text-gray-500 italic bg-white rounded px-2 py-1">"{d.message}"</p>}
              <p className="text-[10px] text-gray-300 mt-1">{new Date(d.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"2-digit"})}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScrollRow({children,title,count}:{children:React.ReactNode,title:string,count:number}){
  const ref=useRef<HTMLDivElement>(null);
  const scroll=(dir:number)=>{ref.current?.scrollBy({left:dir*360,behavior:"smooth"})};
  return(
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">{title} <span className="text-sm font-normal text-gray-400">({count})</span></h2>
        <div className="flex gap-1">
          <button onClick={()=>scroll(-1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600">‹</button>
          <button onClick={()=>scroll(1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600">›</button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide" style={{scrollbarWidth:"none"}}>{children}</div>
    </div>
  );
}

export default function AdminPage(){
  const {user:clerkUser,isLoaded}=useUser();
  const [view,setView]=useState<"campaigns"|"analytics">("campaigns");
  const [myCampaigns,setMyCampaigns]=useState<any[]>([]);
  const [deleted,setDeleted]=useState<any[]>([]);
  const [donors,setDonors]=useState<Record<number,any[]>>({});
  const [expandedCampaign,setExpandedCampaign]=useState<number|null>(null);
  const [loading,setLoading]=useState(true);
  const [msg,setMsg]=useState("");
  const [creatorStats,setCreatorStats]=useState<any>(null);
  const [donorData,setDonorData]=useState<any>(null);

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
    if(!token){setLoading(false);return}
    const h={Authorization:`Bearer ${token}`};
    try{
      const[creatorR,deletedR,donorR]=await Promise.all([
        fetch(`${API}/api/ledger/creator`,{headers:h}).then(r=>r.ok?r.json():null).catch(()=>null),
        fetch(`${API}/api/admin/campaigns/deleted`,{headers:h}).then(r=>r.ok?r.json():[]).catch(()=>[]),
        fetch(`${API}/api/ledger/donor`,{headers:h}).then(r=>r.ok?r.json():null).catch(()=>null),
      ]);
      if(creatorR){setCreatorStats(creatorR);setMyCampaigns(creatorR.campaigns||[])}
      setDeleted(deletedR||[]);
      if(donorR)setDonorData(donorR);
    }catch{}
    setLoading(false);
  }

  useEffect(()=>{if(isLoaded)load()},[isLoaded,clerkUser]);

  async function loadDonors(cid:number){
    if(expandedCampaign===cid){setExpandedCampaign(null);return}
    if(!donors[cid]){
      const r=await fetch(`${API}/api/ledger/campaign/${cid}/donors`,{headers:headers()});
      if(r.ok){const d=await r.json();setDonors(prev=>({...prev,[cid]:d}))}
    }
    setExpandedCampaign(cid);
  }

  async function handleDelete(id:number,title:string){
    if(!confirm(`Delete "${title}"?`))return;
    const reason=prompt("Reason:","No longer needed")||"Removed";
    const r=await fetch(`${API}/api/admin/campaigns/${id}/delete?reason=${encodeURIComponent(reason)}`,{method:"POST",headers:headers()});
    if(r.ok){setMsg(`"${title}" deleted & archived.`);load()}
  }

  async function handleRestore(id:number,title:string){
    if(!confirm(`Restore "${title}"?`))return;
    const r=await fetch(`${API}/api/admin/campaigns/${id}/restore`,{method:"POST",headers:headers()});
    if(r.ok){setMsg(`"${title}" restored!`);load()}
  }

  if(loading||!isLoaded)return<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"/></div>;

  const totalRaised=myCampaigns.reduce((s,c)=>s+(c.raised||0),0);
  const totalBackers=myCampaigns.reduce((s,c)=>s+(c.backers||0),0);
  const avgDonation=totalBackers>0?totalRaised/totalBackers:0;
  const topCampaign=myCampaigns.length>0?[...myCampaigns].sort((a,b)=>(b.raised||0)-(a.raised||0))[0]:null;

  // Analytics data
  const locationMap:Record<string,number>={};
  Object.values(donors).flat().forEach((d:any)=>{if(d.location)locationMap[d.location]=(locationMap[d.location]||0)+d.amount});
  const topLocations=Object.entries(locationMap).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxLoc=topLocations.length>0?topLocations[0][1]:1;

  return(
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm inline-flex items-center gap-1">← Home</Link>
              <h1 className="text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">Business Admin</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setView("campaigns")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view==="campaigns"?"bg-emerald-600 text-white shadow-sm":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Campaigns</button>
              <button onClick={()=>{setView("analytics");myCampaigns.forEach(c=>{if(!donors[c.campaign_id])loadDonors(c.campaign_id)})}} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view==="analytics"?"bg-emerald-600 text-white shadow-sm":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Analytics</button>
            </div>
          </div>
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-4 text-white"><p className="text-xs opacity-70 font-medium">Active Campaigns</p><p className="text-2xl font-extrabold">{myCampaigns.length}</p></div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 text-white"><p className="text-xs opacity-70 font-medium">Total Raised</p><p className="text-2xl font-extrabold">${totalRaised.toFixed(0)}</p></div>
            <div className="bg-gradient-to-br from-violet-500 to-violet-700 rounded-xl p-4 text-white"><p className="text-xs opacity-70 font-medium">Total Backers</p><p className="text-2xl font-extrabold">{totalBackers}</p></div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white"><p className="text-xs opacity-70 font-medium">Avg Donation</p><p className="text-2xl font-extrabold">${avgDonation.toFixed(0)}</p></div>
            <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-4 text-white"><p className="text-xs opacity-70 font-medium">Net Earnings</p><p className="text-2xl font-extrabold">${(creatorStats?.total_net||0).toFixed(0)}</p></div>
          </div>
        </div>
      </div>

      {msg&&<div className="max-w-7xl mx-auto px-6 mt-4"><div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm flex justify-between items-center"><span>{msg}</span><button onClick={()=>setMsg("")} className="text-emerald-400 hover:text-emerald-600 text-lg">×</button></div></div>}

      <div className="max-w-7xl mx-auto px-6 mt-6 pb-16">
        {view==="campaigns"&&(
          <>
            {/* My Campaigns Scroll */}
            <ScrollRow title="My Campaigns" count={myCampaigns.length}>
              {myCampaigns.length===0&&<p className="text-gray-400 py-8 text-sm">No campaigns yet. <Link href="/create-project/basics" className="text-emerald-600 underline">Create one</Link></p>}
              {myCampaigns.map(c=>(
                <CampaignCard key={c.campaign_id} c={c} expanded={expandedCampaign===c.campaign_id} donors={donors[c.campaign_id]||[]}
                  onExpand={()=>loadDonors(c.campaign_id)} onDelete={()=>handleDelete(c.campaign_id,c.title)}/>
              ))}
            </ScrollRow>

            {/* Donations I Made */}
            {donorData&&donorData.donations?.length>0&&(
              <ScrollRow title="My Donations" count={donorData.donations.length}>
                {donorData.donations.map((d:any)=>(
                  <div key={d.donation_id} className="min-w-[280px] max-w-[280px] bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs" style={{backgroundColor:getColor(d.campaign_title)}}>{getInitials(d.campaign_title)}</div>
                      <div className="min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{d.campaign_title}</p><p className="text-xs text-gray-400">By {d.campaign_creator_name}</p></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-emerald-600">${d.amount.toFixed(2)}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${d.status==="succeeded"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{d.status}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">{new Date(d.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p>
                  </div>
                ))}
              </ScrollRow>
            )}

            {/* Deleted Campaigns */}
            {deleted.length>0&&(
              <ScrollRow title="Archived Campaigns" count={deleted.length}>
                {deleted.map(c=>(
                  <div key={c.campaign_id} className="min-w-[300px] max-w-[300px] bg-white rounded-2xl border border-dashed border-gray-300 p-5 flex-shrink-0 opacity-80">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-300 flex items-center justify-center text-white font-bold text-sm">{getInitials(c.title)}</div>
                      <div className="min-w-0"><p className="font-semibold text-gray-500 line-through text-sm truncate">{c.title}</p><p className="text-[10px] text-gray-400">{c.reason}</p></div>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">Deleted {new Date(c.deleted_at).toLocaleDateString()} · ${c.raised?.toFixed(0)} raised · {c.backers} backers</p>
                    <button onClick={()=>handleRestore(c.campaign_id,c.title)} className="w-full py-2 text-xs font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">Restore Campaign</button>
                  </div>
                ))}
              </ScrollRow>
            )}
          </>
        )}

        {view==="analytics"&&(
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Performance</h3>
              <div className="space-y-4">
                {myCampaigns.map(c=>{
                  const pct=c.goal>0?Math.min((c.raised/c.goal)*100,100):0;
                  const donorCount=donors[c.campaign_id]?.length||c.backers||0;
                  return(
                    <div key={c.campaign_id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{backgroundColor:getColor(c.title)}}>{getInitials(c.title)}</div>
                          <div><p className="font-semibold text-sm text-gray-900">{c.title}</p><p className="text-xs text-gray-400">{donorCount} donors · {c.category||"General"}</p></div>
                        </div>
                        <div className="text-right"><p className="text-lg font-bold text-gray-900">${(c.raised||0).toFixed(0)}</p><p className="text-xs text-gray-400">of ${(c.goal||0).toFixed(0)}</p></div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden"><div className="h-3 rounded-full transition-all duration-500" style={{width:`${pct}%`,background:`linear-gradient(90deg, ${getColor(c.title)}, ${getColor(c.title)}dd)`}}/></div>
                      <div className="flex justify-between mt-1"><span className="text-xs text-gray-400">{pct.toFixed(1)}% funded</span>
                        <span className="text-xs font-medium" style={{color:pct>=75?"#10b981":pct>=50?"#f59e0b":pct>=25?"#f97316":"#ef4444"}}>{pct>=75?"Excellent":pct>=50?"Good":pct>=25?"Needs attention":"Boost needed"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location Heatmap */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Donor Locations</h3>
              <p className="text-xs text-gray-400 mb-4">Where your donations come from — target these areas for marketing</p>
              {topLocations.length===0&&<p className="text-gray-400 text-sm py-4">Click "View Donors" on campaigns first to load location data</p>}
              <div className="space-y-3">
                {topLocations.map(([loc,amt])=>(
                  <div key={loc}>
                    <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{loc}</span><span className="font-bold text-gray-900">${amt.toFixed(0)}</span></div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5"><div className="bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full h-2.5 transition-all" style={{width:`${(amt/maxLoc)*100}%`}}/></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Growth Recommendations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {myCampaigns.map(c=>{
                  const pct=c.goal>0?(c.raised/c.goal)*100:0;
                  const tips=pct<25?["Share on social media to increase visibility","Add compelling images and video","Offer early-bird incentives","Reach out to local community groups"]:pct<50?["Send updates to existing backers","Partner with influencers in your space","Cross-promote with similar campaigns","Add stretch goals to maintain momentum"]:pct<75?["Celebrate milestones publicly","Feature top donors (with permission)","Launch a referral program","Engage with comments and questions"]:["Thank every backer personally","Plan delivery and fulfillment","Share success story for future campaigns","Consider increasing your goal"];
                  return(
                    <div key={c.campaign_id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-[10px]" style={{backgroundColor:getColor(c.title)}}>{getInitials(c.title)}</div>
                        <p className="font-semibold text-sm text-gray-900">{c.title}</p>
                      </div>
                      <ul className="space-y-2">
                        {tips.map((t,i)=>(
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">{i+1}</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
