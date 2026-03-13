"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Stats {
  projects_funded: number;
  total_raised_cents: number;
  total_pledges: number;
}

export default function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_URL}/api/stats`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchStats();
  }, []);

  const projectsFunded = stats?.projects_funded ?? 0;
  const totalRaised = stats ? (stats.total_raised_cents / 100) : 0;
  const totalPledges = stats?.total_pledges ?? 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <p className="text-3xl md:text-4xl font-bold text-gray-900">
            {projectsFunded.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm">Projects funded</p>
        </div>
        <div className="text-center border-x border-gray-200">
          <p className="text-3xl md:text-4xl font-bold text-gray-900">
            ${totalRaised.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm">Towards creative work</p>
        </div>
        <div className="text-center">
          <p className="text-3xl md:text-4xl font-bold text-gray-900">
            {totalPledges.toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm">Pledges</p>
        </div>
      </div>
    </div>
  );
}
