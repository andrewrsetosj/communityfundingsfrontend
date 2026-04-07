"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

type FollowListUser = {
  creator_id: string;
  name: string;
  last_name?: string | null;
  user_type?: number | null;
  avatar_url?: string | null;
  follows_you: boolean;
  is_friend: boolean;
  is_you: boolean;
};

type FollowingResponse = {
  creator_id: string;
  following: FollowListUser[];
};

function getFullName(user: FollowListUser) {
  return [user.name, user.last_name].filter(Boolean).join(" ").trim() || "Unknown User";
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("cf_backend_token");
  if (!token || token === "undefined" || token === "null") return {};
  return { Authorization: `Bearer ${token}` };
}

export default function FollowingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [data, setData] = useState<FollowingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setError(null);

        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

        const res = await fetch(`${API_BASE}/api/follows/${id}/following`, {
          cache: "no-store",
          headers: getAuthHeaders(),
        });

        if (!res.ok) {
          throw new Error(`Failed: ${res.status}`);
        }

        const json = (await res.json()) as FollowingResponse;
        setData(json);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      }
    })();
  }, [id]);

  const following = data?.following ?? [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-[#8BC34A] hover:text-[#7CB342] transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Following</h1>

        {!data && !error && <p className="text-gray-600">Loading…</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {data && (
          <div className="border border-gray-200 rounded-2xl bg-white divide-y divide-gray-100">
            {following.length === 0 ? (
              <div className="p-6 text-gray-600">Not following anyone yet.</div>
            ) : (
              following.map((person) => (
                <Link
                  key={person.creator_id}
                  href={`/profile/${person.creator_id}`}
                  className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
                >
                  {person.avatar_url ? (
                    <Image
                      src={person.avatar_url}
                      alt={getFullName(person)}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {person.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900 truncate">
                        {getFullName(person)}
                      </p>

                      {person.is_you && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                          You
                        </span>
                      )}

                      {person.is_friend && !person.is_you && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#F5F9F0] text-[#6E9E36] border border-[#8BC34A]/20">
                          Friend
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 truncate">{person.creator_id}</p>
                  </div>

                  <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}