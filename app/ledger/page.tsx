"use client";

/* v100_ledger_modern — Modern UI ledger with stats + cade-branch design */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";

type Donation = {
  donation_id: number;
  campaign_id: number;
  campaign_title?: string;
  campaign_url?: string;
  amount: number | string;
  status: string;
  time_created?: string;
  created_at?: string;  // v100_date_field_fix
  
  donor_name?: string;
  is_anonymous?: boolean;
  message?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

function parseAmount(amt: number | string): number {
  const n = typeof amt === "string" ? parseFloat(amt) : amt;
  return isNaN(n) ? 0 : n;
}

function fmtMoney(amt: number | string) {
  const n = parseAmount(amt);
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Bulletproof date parser — handles undefined, ISO, Postgres-format, etc. */
function fmtDate(s: string | undefined | null): string {
  if (!s) return "—";
  let d = new Date(s);
  if (isNaN(d.getTime())) {
    // Try Postgres timestamp format (space instead of T)
    d = new Date(String(s).replace(" ", "T"));
  }
  if (isNaN(d.getTime())) return String(s);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const lower = (status || "").toLowerCase();
  const map: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    succeeded: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-600",
  };
  const cls = map[lower] || "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}
    >
      {status || "unknown"}
    </span>
  );
}

export default function LedgerPage() {
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoaded) return;
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const token = await getToken();
        if (!token) {
          setError("Authentication token unavailable. Try refreshing.");
          setLoading(false);
          return;
        }
        const res = await fetch(`${API_URL}/api/ledger-v2/donor`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
        }
        const data = await res.json();
        if (cancelled) return;
        const list: Donation[] =
          data.donations || data.results || (Array.isArray(data) ? data : []);
        setDonations(list);
      } catch (e: unknown) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userLoaded, isSignedIn, getToken]);

  // ─── Stats calculation ────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = donations.reduce(
      (sum, d) => sum + parseAmount(d.amount),
      0,
    );
    const count = donations.length;
    const completed = donations.filter(
      (d) => (d.status || "").toLowerCase() === "completed" ||
             (d.status || "").toLowerCase() === "succeeded",
    ).length;
    const uniqueCampaigns = new Set(donations.map((d) => d.campaign_id)).size;
    return { total, count, completed, uniqueCampaigns };
  }, [donations]);

  // ─── States ────────────────────────────────────────────────────────

  if (!userLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading…</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to view your donations
          </h1>
          <p className="text-gray-500 mb-6">
            Your donation history is private to your account.
          </p>
          <Link
            href="/sign-in"
            className="inline-block bg-[#8BC34A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7CB342] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/"
            className="block mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading your donations…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Donations</h1>
          <p className="text-gray-500 text-sm mb-4">
            Signed in as {user?.primaryEmailAddress?.emailAddress || "you"}
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">
              Could not load your donations.
            </p>
            <p className="text-xs text-red-600 mt-1 font-mono break-all">
              {error}
            </p>
          </div>
          <Link
            href="/"
            className="inline-block mt-6 text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  // ─── Modern UI ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Donations</h1>
            <p className="text-sm text-gray-500 mt-1">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span className="mr-1">←</span> Home
          </Link>
        </div>

        {donations.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F0F7E8] rounded-full flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8BC34A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No donations yet
            </h2>
            <p className="text-gray-500 mb-6">
              When you back a campaign, it&apos;ll show up here.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#8BC34A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7CB342] transition-colors"
            >
              Browse campaigns
            </Link>
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Total donated"
                value={fmtMoney(stats.total)}
                accent="green"
              />
              <StatCard
                label="Donations"
                value={String(stats.count)}
                accent="blue"
              />
              <StatCard
                label="Completed"
                value={String(stats.completed)}
                accent="emerald"
              />
              <StatCard
                label="Campaigns supported"
                value={String(stats.uniqueCampaigns)}
                accent="purple"
              />
            </div>

            {/* Donations table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  History
                </p>
                <p className="text-xs text-gray-400">
                  {donations.length} donation
                  {donations.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Date</th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-right font-semibold">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {donations.map((d) => (
                      <tr
                        key={d.donation_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {fmtDate((d.created_at || d.time_created))}
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          {d.campaign_url ? (
                            <Link
                              href={`/project/${d.campaign_url}`}
                              className="hover:text-[#8BC34A] transition-colors"
                            >
                              {d.campaign_title || `Campaign #${d.campaign_id}`}
                            </Link>
                          ) : (
                            d.campaign_title || `Campaign #${d.campaign_id}`
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900 whitespace-nowrap">
                          {fmtMoney(d.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={d.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "green" | "blue" | "emerald" | "purple";
}) {
  const accentMap: Record<string, string> = {
    green: "from-[#8BC34A]/10 to-[#8BC34A]/5 text-[#558B2F]",
    blue: "from-blue-100 to-blue-50 text-blue-700",
    emerald: "from-emerald-100 to-emerald-50 text-emerald-700",
    purple: "from-purple-100 to-purple-50 text-purple-700",
  };
  const accentCls = accentMap[accent] || accentMap.green;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div
        className={`inline-block px-2.5 py-0.5 rounded-md bg-gradient-to-r ${accentCls} text-xs font-medium uppercase tracking-wider mb-2`}
      >
        {label}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
