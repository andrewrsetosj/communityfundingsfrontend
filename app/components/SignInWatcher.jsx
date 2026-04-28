// "use client";
// import React, { useEffect } from "react";
// import { useAuth } from "@clerk/nextjs";

// export default function SignInWatcher() {
//   const { getToken, isSignedIn, userId } = useAuth(); 

//   useEffect(() => {
//     let cancelled = false;

//     async function sendToken() {
//       try {
//         // wait until signed in (optional)
//         if (!isSignedIn) {
//           console.log("SignInWatcher: user not signed in yet");
//           return;
//         }

//         // getToken() returns a JWT string (client-side)
//         const token = await getToken();
//         console.log("DEBUG: token present?", !!token, "len:", token ? token.length : 0);

//         // If no token, bail (you may want to retry later)
//         if (!token) {
//           console.warn("SignInWatcher: no token returned from Clerk");
//           return;
//         }

//         // call your backend
//         const res = await fetch("http://localhost:4000/api/auth/verify-and-store", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//           body: JSON.stringify({ source: "SignInWatcher", userId }),
//         });

//         console.log("SignInWatcher: backend status", res.status);
//         const text = await res.text();
//         console.log("SignInWatcher: backend response:", text);
//       } catch (err) {
//         console.error("SignInWatcher: error sending token:", err);
//       }
//     }

//     // call once on mount — if you need to wait until user becomes signed in,
//     // rely on isSignedIn reactive value (this effect runs on mount and on changes)
//     sendToken();

//     return () => {
//       cancelled = true;
//     };
//   }, [getToken, isSignedIn, userId]);

//   return null; // invisible component, or return UI if you want
// }

// SignInWatcher.jsx (client component)
"use client";
import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

export default function SignInWatcher() {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  /** Clerk user id we already finished verify-and-store for (success or terminal failure). */
  const verifyDoneForUserId = useRef(null);

  useEffect(() => {
    if (!isSignedIn || !user) {
      verifyDoneForUserId.current = null;
      return;
    }
    if (verifyDoneForUserId.current === user.id) return;

    async function send() {
      try {
        // Default session JWT — verifiable with CLERK_JWKS_URI on the backend.
        // Named templates (e.g. template: "standard") only work if that JWT template exists in Clerk.
        let token = await getToken();
        if (!token) {
          await new Promise((r) => setTimeout(r, 400));
          token = await getToken();
        }
        if (!token) {
          console.warn("SignInWatcher: no Clerk JWT after retry; skipping verify-and-store.");
          verifyDoneForUserId.current = user.id;
          return;
        }

        // If the user typed their full name in Clerk's first name field
        // suffix so we only store the true first name.
        const rawFirst = user.firstName ?? null;
        const rawLast = user.lastName ?? null;
        let firstName = rawFirst;
        if (rawFirst && rawLast && rawFirst.includes(" ")) {
          const parts = rawFirst.trim().split(/\s+/);
          const lastPart = parts[parts.length - 1];
          if (lastPart.toLowerCase() === rawLast.trim().toLowerCase()) {
            firstName = parts.slice(0, -1).join(" ");
          }
        }

        const payload = {
          id: user.id,
          first_name: firstName,
          last_name: rawLast,
          email: user.primaryEmailAddress?.emailAddress ?? null,
          image_url: user.profileImageUrl ?? null,
        };

        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiBase}/api/auth/verify-and-store`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user: payload }),
        });

        const text = await res.text();
        let parsed = null;
        try {
          parsed = JSON.parse(text);
        } catch (_) {
          parsed = text;
        }

        verifyDoneForUserId.current = user.id;

        if (!res.ok) {
          const detail =
            parsed && typeof parsed === "object" && "detail" in parsed
              ? parsed.detail
              : null;
          const errBody =
            detail ?? parsed ?? (text ? text.slice(0, 500) : "");
          console.error(
            "SignInWatcher: verify-and-store failed:",
            res.status,
            errBody || "(empty body)",
          );
          return;
        }
      } catch (err) {
        verifyDoneForUserId.current = user.id;
        console.error("SignInWatcher: error sending token:", err);
      }
    }

    send();
  }, [isSignedIn, user, getToken]);

  return null;
}