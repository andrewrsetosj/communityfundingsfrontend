import React from "react";
import { useAuth } from "@clerk/clerk-react";

export default function SendTokenButton() {
  const { getToken } = useAuth();

  async function sendTokenToBackend() {
    try {
      // obtain the JWT for the currently signed-in user
      const token = await getToken({ template: "single" }); // default template; you may omit template
      // POST to backend
      const res = await fetch("http://localhost:4000/api/auth/verify-and-store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ someContext: "optional" }),
      });

      const data = await res.json();
      console.log("backend response:", data);
    } catch (err) {
      console.error("error sending token to backend:", err);
    }
  }

  return <button onClick={sendTokenToBackend}>Send token to backend</button>;
}
