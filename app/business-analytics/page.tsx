"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
const COLORS = ["#10b981","#3b82f6","#8b5cf6","#f43f5e","#f59e0b","#14b8a6","#ec4899","#6366f1"];

function getInitials(n: string) {
  return n?.split(" ").map(x => x[0]).join("").toUpperCase().slice(0,2) || "?";
}

export default function BusinessAnalyticsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      setLoading(false);
      setError("Please sign in to view your Business Analytics.");
      return;
    }

    const load = async () => {
      try {
        const r = await fetch(`${API}/api/business-analytics-v2/${user.id}`);
        if (!r.ok) {
          if (r.status === 404) {
            setError("No analytics found. Create your first campaign to start tracking.");
          } else {
            setError(`Failed to load analytics (${r.status})`);
          }
          setLoading(false);
          return;
        }
        const j = await r.json();
        setData(j);
      } catch (e) {
        setError("Network error loading analytics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isLoaded, isSignedIn, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md text-center">
          <p className="text-gray-700 mb-4">{error}</p>
          <Link href="/" className="text-emerald-600 hover:underline text-sm">← Back to Home</Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = data.stats || {};
  const campaigns = data.campaigns || [];
  const categoryBreakdown = data.category_breakdown || [];
  const topDonors = data.top_donors || [];
  const recentDonations = data.recent_donations || [];
  const cumulative = data.cumulative_revenue || [];
  const recommendations = data.recommendations || [];

  const isBiz = data.creator?.is_business;

  if (!isBiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Business Accounts Only</h2>
          <p className="text-gray-500 mb-4 text-sm">
            Business Analytics is available to business accounts. Switch your account type in Settings.
          </p>
          <Link href="/settings" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm inline-flex items-center gap-1">← Home</Link>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">Business Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time insights for your campaigns</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
            {[
              { label: "Active Campaigns", value: stats.active_campaigns || 0, grad: "from-emerald-500 to-emerald-700" },
              { label: "Total Raised", value: "$" + (stats.total_raised || 0).toLocaleString(undefined, {maximumFractionDigits:0}), grad: "from-blue-500 to-blue-700" },
              { label: "Total Backers", value: (stats.total_backers || 0).toLocaleString(), grad: "from-violet-500 to-violet-700" },
              { label: "Avg Donation", value: "$" + (stats.avg_donation || 0).toFixed(0), grad: "from-amber-500 to-amber-600" },
              { label: "Net Earnings", value: "$" + (stats.net_earnings || 0).toLocaleString(undefined, {maximumFractionDigits:0}), grad: "from-rose-500 to-rose-600" },
            ].map(({label, value, grad}) => (
              <div key={label} className={`bg-gradient-to-br ${grad} rounded-xl p-4 text-white`}>
                <p className="text-xs opacity-70 font-medium">{label}</p>
                <p className="text-2xl font-extrabold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 pb-16 space-y-6">

        {campaigns.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <p className="text-gray-500 text-sm">No campaigns yet.</p>
            <Link href="/create-project/basics" className="text-emerald-600 underline text-sm mt-2 inline-block">Create your first campaign →</Link>
          </div>
        )}

        {campaigns.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-1">Revenue by Campaign</h3>
              <p className="text-xs text-gray-400 mb-4">Top performers ranked by total raised</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaigns.slice(0, 8).map((c: any) => ({
                  name: c.title.length > 18 ? c.title.slice(0, 18) + "…" : c.title,
                  raised: c.raised,
                }))} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                  <Bar dataKey="raised" radius={[0, 6, 6, 0]}>
                    {campaigns.slice(0, 8).map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-1">Cumulative Revenue Growth</h3>
              <p className="text-xs text-gray-400 mb-4">Total raised over time across all campaigns</p>
              {cumulative.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={cumulative} margin={{ left: 10, right: 20 }}>
                    <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="100%" stopColor="#10b981" stopOpacity={0.02} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                    <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                    <Area type="monotone" dataKey="cumulative" stroke="#10b981" strokeWidth={2.5} fill="url(#grad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-sm py-12 text-center">No donation data yet</p>
              )}
            </div>
          </div>
        )}

        {campaigns.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-1">Revenue by Category</h3>
              <p className="text-xs text-gray-400 mb-4">Which categories perform best</p>
              {categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown.map((c: any) => ({ name: c.category, value: c.total_raised }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryBreakdown.map((_: any, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-sm py-12 text-center">No category data</p>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-1">Top Donors</h3>
              <p className="text-xs text-gray-400 mb-4">Most valuable supporters across campaigns</p>
              {topDonors.length > 0 ? (
                <div className="space-y-2 max-h-[260px] overflow-y-auto">
                  {topDonors.map((d: any, i: number) => {
                    const max = topDonors[0]?.total_amount || 1;
                    return (
                      <div key={d.name + i} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-300 w-5 text-right">{i + 1}</span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                          {getInitials(d.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-sm font-medium text-gray-800 truncate">{d.name}</p>
                            <p className="text-sm font-bold text-gray-900">${d.total_amount.toLocaleString()}</p>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full" style={{ width: `${(d.total_amount / max) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{d.num_donations} donation{d.num_donations !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-sm py-12 text-center">No donor data yet</p>
              )}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-1">Recommendations</h3>
            <p className="text-xs text-gray-400 mb-4">Data-driven insights from your campaigns</p>
            <div className="space-y-3">
              {recommendations.map((rec: any, i: number) => {
                const colorMap: any = {
                  tip: "bg-blue-50 border-blue-200 text-blue-900",
                  celebrate: "bg-emerald-50 border-emerald-200 text-emerald-900",
                  insight: "bg-violet-50 border-violet-200 text-violet-900",
                  info: "bg-gray-50 border-gray-200 text-gray-700",
                };
                return (
                  <div key={i} className={`border rounded-xl p-4 ${colorMap[rec.type] || colorMap.info}`}>
                    <p className="text-sm font-bold mb-1">{rec.title}</p>
                    <p className="text-xs">{rec.message}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {campaigns.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">All Campaigns</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Campaign</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Raised</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Goal</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">%</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Backers</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c: any, i: number) => (
                    <tr key={c.campaign_id} className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-gray-50/50" : ""} hover:bg-emerald-50/30`}>
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-gray-800">{c.title}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-gray-900">${c.raised.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-gray-500">${c.goal.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`text-xs font-bold ${c.percent_funded >= 75 ? "text-emerald-600" : c.percent_funded >= 50 ? "text-blue-600" : c.percent_funded >= 25 ? "text-amber-600" : "text-red-500"}`}>
                          {c.percent_funded.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-gray-700">{c.backers}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 capitalize">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {recentDonations.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">Recent Donations</h3>
            <div className="space-y-2">
              {recentDonations.map((d: any) => (
                <div key={d.donation_id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{d.donor_display}</p>
                    <p className="text-xs text-gray-400">{d.campaign_title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">${d.amount.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400">{d.time_created ? new Date(d.time_created).toLocaleDateString() : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
