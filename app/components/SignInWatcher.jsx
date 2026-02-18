// SignInWatcher.jsx
import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

export default function SignInWatcher() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const hasSentRef = useRef(false);

  useEffect(() => {
    if (!isSignedIn || hasSentRef.current) return;
    let mounted = true;
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch("/api/proxy/api/auth/verify-and-store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ email: user?.primaryEmailAddress?.emailAddress ?? null }),
        });
        if (res.ok && mounted) hasSentRef.current = true;
      } catch (err) {
        console.error("SignInWatcher error:", err);
      }
    })();
    return () => { mounted = false; };
  }, [isSignedIn, getToken, user]);

  return null;
}
