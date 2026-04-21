"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import {
  backendJwtExpired,
  syncClerkToBackendToken,
} from "@/lib/backendToken";

export default function AuthSync() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const sync = async () => {
      const existing = localStorage.getItem("cf_backend_token");
      const syncedEmail = localStorage.getItem("cf_synced_email");
      const syncedImage = localStorage.getItem("cf_synced_image");
      const email = user.primaryEmailAddress?.emailAddress;
      const imageUrl = user.imageUrl ?? "";
      const tokenOk =
        existing &&
        syncedEmail === email &&
        syncedImage === imageUrl &&
        !backendJwtExpired(existing);
      if (tokenOk) return;

      await syncClerkToBackendToken(user);
    };
    sync();
  }, [isSignedIn, user, user?.imageUrl]);

  return null;
}