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
import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

export default function SignInWatcher() {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    async function send() {
      try {
        console.log("SignInWatcher: user object:", user);
        const token = await getToken({ template: "standard" });
        console.log("SignInWatcher: token present? ", !!token, "len:", token?.length);

        const payload = {
          id: user.id,
          first_name: user.firstName ?? null,
          last_name: user.lastName ?? null,
          email: user.primaryEmailAddress?.emailAddress ?? null,
          image_url: user.profileImageUrl ?? null
        };

        console.log("SignInWatcher: payload to send:", payload);

        const res = await fetch("http://localhost:4000/api/auth/verify-and-store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ source: "SignInWatcher", user: payload }),
        });

        console.log("SignInWatcher: response status", res.status);
        const json = await res.json().catch(() => null);
        console.log("SignInWatcher: response body", json);
      } catch (err) {
        console.error("SignInWatcher: error sending token:", err);
      }
    }

    send();
  }, [isSignedIn, user, getToken]);

  return null;
}