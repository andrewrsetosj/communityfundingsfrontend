"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function AuthSync() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const sync = async () => {
      const existing = localStorage.getItem("cf_backend_token");
      const syncedEmail = localStorage.getItem("cf_synced_email");
      if (existing && syncedEmail === user.primaryEmailAddress?.emailAddress) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/clerk-sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerk_id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            name: user.fullName || user.firstName || "User",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("cf_backend_token", data.access_token);
          localStorage.setItem("cf_synced_email", user.primaryEmailAddress?.emailAddress || "");
        }
      } catch {
        // Silent fail — will retry on next page load
      }
    };
    sync();
  }, [isSignedIn, user]);

  return null;
}