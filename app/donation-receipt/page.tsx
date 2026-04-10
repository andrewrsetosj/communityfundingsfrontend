"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function ReceiptContent() {
  const params = useSearchParams();
  const donationId = params.get("donation_id");
  const campaignId = params.get("campaign_id");
  const [donation, setDonation] = useState<any>(null);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (donationId) {
      fetch(`${API}/api/stripe/donation/${donationId}`).then(r=>r.json()).then(setDonation).catch(()=>{});
    } else if (campaignId) {
      const token = localStorage.getItem("cf_backend_token");
      if (token) {
        fetch(`${API}/api/ledger/donor`,{headers:{Authorization:`Bearer ${token}`}})
          .then(r=>r.json())
          .then(data=>{
            const latest = data.donations?.find((d:any)=>String(d.campaign_id)===campaignId);
            if(latest) setDonation(latest);
            else fetch(`${API}/api/campaigns/${campaignId}`).then(r=>r.json()).then(c=>setDonation({amount:0,campaign_title:c.title,campaign_creator_name:c.creator_name||c.creator_id,status:"pending",created_at:new Date().toISOString()}));
          });
      }
    }
  }, [donationId, campaignId]);

  useEffect(() => {
    if (!donation) return;
    const timer = setInterval(() => setCountdown(p => { if (p<=1){clearInterval(timer);window.location.href="/";return 0;} return p-1; }), 1000);
    return () => clearInterval(timer);
  }, [donation]);

  if (!donation) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7CB342]"/></div>;

  const amt = donation.amount || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        <div className="bg-[#7CB342] px-8 py-10 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
          </div>
          <h1 className="text-2xl font-bold">Thank You!</h1>
          <p className="text-green-100 mt-1">Your donation was successful</p>
        </div>
        <div className="px-8 py-6">
          <div className="border-b border-dashed border-gray-200 pb-4 mb-4"><p className="text-sm text-gray-400 uppercase tracking-wide">Donation Receipt</p></div>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-500">Campaign</span><span className="font-semibold text-gray-900 text-right max-w-[200px] truncate">{donation.campaign_title}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Creator</span><span className="text-gray-700">{donation.campaign_creator_name || donation.creator_name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="text-2xl font-bold text-[#7CB342]">${amt.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${donation.status==="succeeded"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{donation.status==="succeeded"?"Succeeded":"Processing"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="text-gray-700">{new Date(donation.created_at).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="text-gray-700">•••• •••• •••• 4242</span></div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100"><p className="text-xs text-gray-400 text-center">A confirmation email will be sent to your registered email address.</p></div>
          <div className="mt-6 space-y-3">
            <Link href="/ledger" className="block w-full text-center bg-[#7CB342] text-white py-3 rounded-lg font-medium hover:bg-[#689F38] transition-colors">View My Ledger</Link>
            <Link href="/" className="block w-full text-center bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">Return Home ({countdown}s)</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonationReceipt() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7CB342]"/></div>}><ReceiptContent/></Suspense>;
}
