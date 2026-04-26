"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend, LineChart, Line,
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const COLORS = ["#10b981","#3b82f6","#8b5cf6","#f43f5e","#f59e0b","#14b8a6","#ec4899","#6366f1","#84cc16","#06b6d4","#e11d48","#7c3aed"];

function getInitials(n:string){return n?.split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2)||"?"}
function getColor(n:string){let h=0;for(let i=0;i<(n||"").length;i++)h=n.charCodeAt(i)+((h<<5)-h);return COLORS[Math.abs(h)%COLORS.length]}

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
          <div className="bg-gray-50 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-400">Raised</p><p className="text-sm font-bold text-gray-900">${(c.raised||0).toLocaleString()}</p></div>
          <div className="bg-gray-50 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-400">Goal</p><p className="text-sm font-bold text-gray-900">${(c.goal||0).toLocaleString()}</p></div>
          <div className="bg-gray-50 rounded-lg p-2 text-center"><p className="text-[10px] text-gray-400">Backers</p><p className="text-sm font-bold text-gray-900">{c.backers||0}</p></div>
        </div>
        <div className="flex gap-2">
          <button onClick={onExpand} className="flex-1 py-2 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">{expanded?"Hide":"Donors"}</button>
          <button onClick={onDelete} className="px-3 py-2 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
        </div>
      </div>
      {expanded&&(
        <div className="border-t border-gray-100 bg-gray-50 max-h-[240px] overflow-y-auto">
          {donors.length===0&&<p className="p-4 text-gray-400 text-xs text-center">No donations yet</p>}
          {donors.map((d:any,i:number)=>(
            <div key={d.donation_id||i} className="px-4 py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{backgroundColor:getColor(d.donor_name)}}>{getInitials(d.donor_name)}</div>
                <div className="flex-1 min-w-0"><p className="text-xs font-medium text-gray-800 truncate">{d.donor_name}</p><p className="text-[10px] text-gray-400">{d.donor_email}</p></div>
                <div className="text-right"><p className="text-sm font-bold text-gray-900">${d.amount?.toFixed(2)}</p><p className="text-[10px] text-gray-400">{d.location||"—"}</p></div>
              </div>
              {d.message&&<p className="mt-1.5 text-[11px] text-gray-500 italic bg-white rounded px-2 py-1">&ldquo;{d.message}&rdquo;</p>}
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
          <button onClick={()=>scroll(-1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 text-lg">‹</button>
          <button onClick={()=>scroll(1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 text-lg">›</button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2" style={{scrollbarWidth:"none"}}>{children}</div>
    </div>
  );
}

const CustomTooltip=({active,payload,label}:any)=>{
  if(!active||!payload?.length) return null;
  return <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg"><p className="font-medium">{label}</p>{payload.map((p:any,i:number)=>(<p key={i} style={{color:p.color}}>{p.name}: ${p.value?.toLocaleString()}</p>))}</div>;
};

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
      const r=await fetch(`${API}/api/auth/clerk-sync`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:clerkUser.primaryEmailAddress.emailAddress,name:clerkUser.fullName||"Admin"})});
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

  async function loadAllDonors(){
    const h=headers();
    const promises=myCampaigns.filter(c=>!donors[c.campaign_id]).map(c=>
      fetch(`${API}/api/ledger/campaign/${c.campaign_id}/donors`,{headers:h}).then(r=>r.ok?r.json():[]).then(d=>({cid:c.campaign_id,donors:d})).catch(()=>({cid:c.campaign_id,donors:[]}))
    );
    const results=await Promise.all(promises);
    const newDonors={...donors};
    results.forEach(r=>{newDonors[r.cid]=r.donors});
    setDonors(newDonors);
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

  // ─── Analytics computed data ───
  const analytics = useMemo(()=>{
    const allDonors=Object.values(donors).flat();
    const totalRaised=myCampaigns.reduce((s,c)=>s+(c.raised||0),0);
    const totalBackers=myCampaigns.reduce((s,c)=>s+(c.backers||0),0);
    const avgDonation=allDonors.length>0?allDonors.reduce((s,d)=>s+(d.amount||0),0)/allDonors.length:totalBackers>0?totalRaised/totalBackers:0;

    // Campaign performance bar chart
    const campaignPerf=myCampaigns.map(c=>({name:c.title.length>18?c.title.slice(0,18)+"…":c.title,raised:c.raised||0,goal:c.goal||0,backers:c.backers||0,pct:c.goal>0?Math.round((c.raised/c.goal)*100):0})).sort((a,b)=>b.raised-a.raised).slice(0,12);

    // Location breakdown
    const locMap:Record<string,{amount:number,count:number}>={};
    allDonors.forEach(d=>{const loc=d.location||"Unknown";if(!locMap[loc])locMap[loc]={amount:0,count:0};locMap[loc].amount+=d.amount||0;locMap[loc].count++});
    const locationData=Object.entries(locMap).map(([name,v])=>({name,value:Math.round(v.amount),count:v.count})).sort((a,b)=>b.value-a.value).slice(0,8);

    // Donation size distribution
    const sizeRanges=[{label:"$1-50",min:1,max:50},{label:"$51-100",min:51,max:100},{label:"$101-250",min:101,max:250},{label:"$251-500",min:251,max:500},{label:"$501-1K",min:501,max:1000},{label:"$1K-5K",min:1001,max:5000},{label:"$5K+",min:5001,max:Infinity}];
    const sizeDist=sizeRanges.map(r=>({name:r.label,count:allDonors.filter(d=>d.amount>=r.min&&d.amount<=r.max).length,total:Math.round(allDonors.filter(d=>d.amount>=r.min&&d.amount<=r.max).reduce((s,d)=>s+d.amount,0))}));

    // Top donors
    const donorMap:Record<string,{amount:number,count:number,email:string}>={};
    allDonors.forEach(d=>{const n=d.donor_name||"Anonymous";if(!donorMap[n])donorMap[n]={amount:0,count:0,email:d.donor_email||""};donorMap[n].amount+=d.amount||0;donorMap[n].count++});
    const topDonors=Object.entries(donorMap).map(([name,v])=>({name,amount:Math.round(v.amount),count:v.count,email:v.email})).sort((a,b)=>b.amount-a.amount).slice(0,10);

    // Category breakdown
    const catMap:Record<string,{raised:number,count:number}>={};
    myCampaigns.forEach(c=>{const cat=c.category||"Other";if(!catMap[cat])catMap[cat]={raised:0,count:0};catMap[cat].raised+=c.raised||0;catMap[cat].count++});
    const categoryData=Object.entries(catMap).map(([name,v])=>({name,value:Math.round(v.raised),count:v.count})).sort((a,b)=>b.value-a.value);

    // Radar chart - campaign health scores
    const radarData=myCampaigns.slice(0,6).map(c=>{
      const pct=c.goal>0?(c.raised/c.goal)*100:0;
      const donorCount=donors[c.campaign_id]?.length||c.backers||0;
      const avgD=donorCount>0?(c.raised||0)/donorCount:0;
      return{campaign:c.title.length>12?c.title.slice(0,12)+"…":c.title,funding:Math.min(pct,100),engagement:Math.min(donorCount*10,100),avgDonation:Math.min(avgD/10,100),momentum:Math.min(pct*1.2,100)};
    });

    // Funding progress over campaigns (cumulative)
    let cumulative=0;
    const cumulativeData=myCampaigns.map((c,i)=>{cumulative+=c.raised||0;return{name:`C${i+1}`,total:Math.round(cumulative),campaign:c.title}});

    return{totalRaised,totalBackers,avgDonation,campaignPerf,locationData,sizeDist,topDonors,categoryData,radarData,cumulativeData,allDonorsCount:allDonors.length};
  },[myCampaigns,donors]);

  if(loading||!isLoaded)return<div className="min-h-screen flex items-center justify-center bg-[#fafbfc]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"/></div>;

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
              <button onClick={()=>setView("campaigns")} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${view==="campaigns"?"bg-emerald-600 text-white shadow-md shadow-emerald-200":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Campaigns</button>
              <button onClick={()=>{setView("analytics");loadAllDonors()}} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${view==="analytics"?"bg-emerald-600 text-white shadow-md shadow-emerald-200":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Analytics</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
            {[
              ["Active Campaigns",myCampaigns.length,"from-emerald-500 to-emerald-700"],
              ["Total Raised","$"+analytics.totalRaised.toLocaleString(),"from-blue-500 to-blue-700"],
              ["Total Backers",analytics.totalBackers,"from-violet-500 to-violet-700"],
              ["Avg Donation","$"+analytics.avgDonation.toFixed(0),"from-amber-500 to-amber-600"],
              ["Net Earnings","$"+(creatorStats?.total_net||0).toFixed(0),"from-rose-500 to-rose-600"],
            ].map(([label,val,grad])=>(
              <div key={label as string} className={`bg-gradient-to-br ${grad} rounded-xl p-4 text-white`}><p className="text-xs opacity-70 font-medium">{label}</p><p className="text-2xl font-extrabold">{val}</p></div>
            ))}
          </div>
        </div>
      </div>

      {msg&&<div className="max-w-7xl mx-auto px-6 mt-4"><div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm flex justify-between items-center"><span>{msg}</span><button onClick={()=>setMsg("")} className="text-emerald-400 text-lg">×</button></div></div>}

      <div className="max-w-7xl mx-auto px-6 mt-6 pb-16">
        {/* ═══════════ CAMPAIGNS VIEW ═══════════ */}
        {view==="campaigns"&&(
          <>
            <ScrollRow title="My Campaigns" count={myCampaigns.length}>
              {myCampaigns.length===0&&<p className="text-gray-400 py-8 text-sm">No campaigns yet. <Link href="/create-project/basics" className="text-emerald-600 underline">Create one</Link></p>}
              {myCampaigns.map(c=>(<CampaignCard key={c.campaign_id} c={c} expanded={expandedCampaign===c.campaign_id} donors={donors[c.campaign_id]||[]} onExpand={()=>loadDonors(c.campaign_id)} onDelete={()=>handleDelete(c.campaign_id,c.title)}/>))}
            </ScrollRow>
            {donorData&&donorData.donations?.length>0&&(
              <ScrollRow title="My Donations" count={donorData.donations.length}>
                {donorData.donations.map((d:any)=>(
                  <div key={d.donation_id} className="min-w-[280px] max-w-[280px] bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs" style={{backgroundColor:getColor(d.campaign_title)}}>{getInitials(d.campaign_title)}</div>
                      <div className="min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{d.campaign_title}</p><p className="text-xs text-gray-400">By {d.campaign_creator_name}</p></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-emerald-600">${d.amount?.toFixed(2)}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${d.status==="succeeded"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{d.status}</span>
                    </div>
                  </div>
                ))}
              </ScrollRow>
            )}
            {deleted.length>0&&(
              <ScrollRow title="Archived" count={deleted.length}>
                {deleted.map(c=>(
                  <div key={c.campaign_id} className="min-w-[300px] max-w-[300px] bg-white rounded-2xl border border-dashed border-gray-300 p-5 flex-shrink-0 opacity-80">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-300 flex items-center justify-center text-white font-bold text-sm">{getInitials(c.title)}</div>
                      <div className="min-w-0"><p className="font-semibold text-gray-500 line-through text-sm truncate">{c.title}</p><p className="text-[10px] text-gray-400">{c.reason}</p></div>
                    </div>
                    <button onClick={()=>handleRestore(c.campaign_id,c.title)} className="w-full py-2 text-xs font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">Restore</button>
                  </div>
                ))}
              </ScrollRow>
            )}
          </>
        )}

        {/* ═══════════ ANALYTICS VIEW ═══════════ */}
        {view==="analytics"&&(
          <div className="space-y-6">

            {/* Row 1: Revenue by Campaign + Cumulative Growth */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-1">Revenue by Campaign</h3>
                <p className="text-xs text-gray-400 mb-4">Top performing campaigns ranked by total raised</p>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={analytics.campaignPerf} layout="vertical" margin={{left:10,right:20}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <XAxis type="number" tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} tick={{fontSize:11}} stroke="#9ca3af"/>
                    <YAxis type="category" dataKey="name" width={130} tick={{fontSize:11}} stroke="#9ca3af"/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="raised" name="Raised" radius={[0,6,6,0]}>
                      {analytics.campaignPerf.map((_:any,i:number)=>(<Cell key={i} fill={COLORS[i%COLORS.length]}/>))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-1">Cumulative Revenue Growth</h3>
                <p className="text-xs text-gray-400 mb-4">Total platform revenue across all campaigns</p>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={analytics.cumulativeData} margin={{left:10,right:20}}>
                    <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="100%" stopColor="#10b981" stopOpacity={0.02}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <XAxis dataKey="name" tick={{fontSize:11}} stroke="#9ca3af"/>
                    <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} tick={{fontSize:11}} stroke="#9ca3af"/>
                    <Tooltip content={({active,payload}:any)=>active&&payload?.[0]?<div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg"><p className="font-medium">{payload[0].payload.campaign}</p><p className="text-emerald-400">${payload[0].value?.toLocaleString()}</p></div>:null}/>
                    <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2.5} fill="url(#areaGrad)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 2: Location Pie + Donation Size Distribution */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-1">Donor Locations</h3>
                <p className="text-xs text-gray-400 mb-4">Geographic distribution of donations — target these markets</p>
                {analytics.locationData.length===0?<p className="text-gray-400 text-sm py-12 text-center">Loading donor data...</p>:(
                  <div className="flex items-center">
                    <ResponsiveContainer width="55%" height={280}>
                      <PieChart>
                        <Pie data={analytics.locationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={3} strokeWidth={0}>
                          {analytics.locationData.map((_:any,i:number)=>(<Cell key={i} fill={COLORS[i%COLORS.length]}/>))}
                        </Pie>
                        <Tooltip formatter={(v:number)=>`$${v.toLocaleString()}`}/>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="w-[45%] space-y-2 pl-2">
                      {analytics.locationData.map((l:any,i:number)=>(
                        <div key={l.name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:COLORS[i%COLORS.length]}}/>
                          <span className="text-xs text-gray-600 flex-1 truncate">{l.name}</span>
                          <span className="text-xs font-bold text-gray-900">${l.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-1">Donation Size Distribution</h3>
                <p className="text-xs text-gray-400 mb-4">Breakdown of donation amounts — optimize pricing tiers</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={analytics.sizeDist} margin={{left:0,right:10}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <XAxis dataKey="name" tick={{fontSize:10}} stroke="#9ca3af"/>
                    <YAxis yAxisId="left" tick={{fontSize:11}} stroke="#9ca3af"/>
                    <YAxis yAxisId="right" orientation="right" tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} tick={{fontSize:11}} stroke="#9ca3af"/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar yAxisId="left" dataKey="count" name="Donations" fill="#3b82f6" radius={[4,4,0,0]} barSize={28}/>
                    <Line yAxisId="right" type="monotone" dataKey="total" name="Revenue" stroke="#f59e0b" strokeWidth={2.5} dot={{r:4,fill:"#f59e0b"}}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 3: Top Donors + Campaign Health Radar */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-1">Top Donors</h3>
                <p className="text-xs text-gray-400 mb-4">Your most valuable supporters across all campaigns</p>
                <div className="space-y-2">
                  {analytics.topDonors.map((d:any,i:number)=>{
                    const maxAmt=analytics.topDonors[0]?.amount||1;
                    return(
                      <div key={d.name} className="flex items-center gap-3 group">
                        <span className="text-xs font-bold text-gray-300 w-5 text-right">{i+1}</span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{backgroundColor:COLORS[i%COLORS.length]}}>{getInitials(d.name)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-sm font-medium text-gray-800 truncate">{d.name}</p>
                            <p className="text-sm font-bold text-gray-900">${d.amount.toLocaleString()}</p>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="h-1.5 rounded-full transition-all" style={{width:`${(d.amount/maxAmt)*100}%`,backgroundColor:COLORS[i%COLORS.length]}}/></div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{d.count} donation{d.count!==1?"s":""}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-1">Campaign Health Index</h3>
                <p className="text-xs text-gray-400 mb-4">Multi-metric health comparison of top campaigns</p>
                {analytics.radarData.length>0?(
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={analytics.radarData}>
                      <PolarGrid stroke="#e5e7eb"/>
                      <PolarAngleAxis dataKey="campaign" tick={{fontSize:10}} stroke="#9ca3af"/>
                      <PolarRadiusAxis tick={{fontSize:9}} stroke="#d1d5db" domain={[0,100]}/>
                      <Radar name="Funding %" dataKey="funding" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2}/>
                      <Radar name="Engagement" dataKey="engagement" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2}/>
                      <Radar name="Avg Donation" dataKey="avgDonation" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2}/>
                      <Legend wrapperStyle={{fontSize:11}}/>
                      <Tooltip/>
                    </RadarChart>
                  </ResponsiveContainer>
                ):<p className="text-gray-400 text-sm py-12 text-center">Not enough data</p>}
              </div>
            </div>

            {/* Row 4: Category Breakdown + Campaign Performance Table */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-1">Revenue by Category</h3>
                <p className="text-xs text-gray-400 mb-4">Which categories perform best for your business</p>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={analytics.categoryData} margin={{left:0,right:10}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <XAxis dataKey="name" tick={{fontSize:10}} stroke="#9ca3af"/>
                    <YAxis tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} tick={{fontSize:11}} stroke="#9ca3af"/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="value" name="Revenue" radius={[6,6,0,0]}>
                      {analytics.categoryData.map((_:any,i:number)=>(<Cell key={i} fill={COLORS[i%COLORS.length]}/>))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-1">Growth Recommendations</h3>
                <p className="text-xs text-gray-400 mb-4">Data-driven suggestions to maximize campaign performance</p>
                <div className="space-y-3 max-h-[280px] overflow-y-auto">
                  {myCampaigns.slice(0,4).map(c=>{
                    const pct=c.goal>0?(c.raised/c.goal)*100:0;
                    const status=pct>=75?"text-emerald-600 bg-emerald-50":pct>=50?"text-blue-600 bg-blue-50":pct>=25?"text-amber-600 bg-amber-50":"text-red-600 bg-red-50";
                    const tip=pct<25?"Boost social media presence and add video content":pct<50?"Send backer updates and launch referral incentives":pct<75?"Celebrate milestones publicly, add stretch goals":"Prepare fulfillment plan and thank supporters";
                    return(
                      <div key={c.campaign_id} className="border border-gray-100 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[9px] font-bold" style={{backgroundColor:getColor(c.title)}}>{getInitials(c.title)}</div>
                          <p className="text-xs font-semibold text-gray-800 flex-1 truncate">{c.title}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status}`}>{pct.toFixed(0)}%</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{tip}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 5: Campaign Detail Table */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4">All Campaigns Overview</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Campaign</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Raised</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Goal</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">%</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Backers</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Avg</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Status</th>
                  </tr></thead>
                  <tbody>
                    {myCampaigns.map((c,i)=>{
                      const pct=c.goal>0?((c.raised/c.goal)*100):0;
                      const avg=c.backers>0?c.raised/c.backers:0;
                      return(
                        <tr key={c.campaign_id} className={`border-b border-gray-50 ${i%2===0?"bg-gray-50/50":""} hover:bg-emerald-50/30`}>
                          <td className="py-2.5 px-3"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded flex items-center justify-center text-white text-[9px] font-bold" style={{backgroundColor:getColor(c.title)}}>{getInitials(c.title)}</div><span className="font-medium text-gray-800 truncate max-w-[180px]">{c.title}</span></div></td>
                          <td className="py-2.5 px-3 text-right font-bold text-gray-900">${(c.raised||0).toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right text-gray-500">${(c.goal||0).toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right"><span className={`text-xs font-bold ${pct>=75?"text-emerald-600":pct>=50?"text-blue-600":pct>=25?"text-amber-600":"text-red-500"}`}>{pct.toFixed(1)}%</span></td>
                          <td className="py-2.5 px-3 text-right text-gray-700">{c.backers||0}</td>
                          <td className="py-2.5 px-3 text-right text-gray-700">${avg.toFixed(0)}</td>
                          <td className="py-2.5 px-3"><span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Active</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
