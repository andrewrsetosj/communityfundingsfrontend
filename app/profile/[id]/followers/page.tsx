"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

type FollowListUser = {
  creator_id: string;
  username?: string | null;
  name: string;
  last_name?: string | null;
  user_type?: number | null;
  avatar_url?: string | null;
  follows_you: boolean;
  is_friend: boolean;
  is_you: boolean;
};

type FollowersResponse = {
  creator_id: string;
  username?: string | null;
  followers: FollowListUser[];
};

function getFullName(user: FollowListUser) {
  return [user.name, user.last_name].filter(Boolean).join(" ").trim() || "Unknown User";
}

function getProfileHref(user?: { username?: string | null; creator_id?: string | null }) {
  if (user?.username) return `/profile/${user.username}`;
  if (user?.creator_id) return `/profile/${user.creator_id}`;
  return "#";
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("cf_backend_token");
  if (!token || token === "undefined" || token === "null") return {};
  return { Authorization: `Bearer ${token}` };
}

export default function FollowersPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [data, setData] = useState<FollowersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setError(null);

        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let followLookupId = id;
try {
  const profileRes = await fetch(`${API_BASE}/api/profile-page/${id}`, {
    cache: "no-store",
    headers: getAuthHeaders(),
  });
  if (profileRes.ok) {
    const profileJson = await profileRes.json();
    followLookupId = profileJson?.creator?.creator_id || id;
  }
} catch (err) {
  console.error("Error resolving profile id:", err);
}

const res = await fetch(`${API_BASE}/api/follows/${followLookupId}/followers`, {
  cache: "no-store",
  headers: getAuthHeaders(),
});

        if (!res.ok) {
          throw new Error(`Failed: ${res.status}`);
        }

        const json = (await res.json()) as FollowersResponse;
        setData(json);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      }
    })();
  }, [id]);

  const followers = data?.followers ?? [];

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

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Followers</h1>

        {!data && !error && <p className="text-gray-600">Loading…</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {data && (
          <div className="border border-gray-200 rounded-2xl bg-white divide-y divide-gray-100">
            {followers.length === 0 ? (
              <div className="p-6 text-gray-600">No followers yet.</div>
            ) : (
              followers.map((person) => (
                <Link
                  key={person.username ? `@${person.username}` : person.creator_id}
                  href={getProfileHref(person)}
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

                    <p className="text-sm text-gray-500 truncate">{person.username ? `@${person.username}` : person.creator_id}</p>
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