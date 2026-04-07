const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/** Backend JWT payload exp check (no signature verification). */
export function backendJwtExpired(token: string, skewSeconds = 120): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as { exp?: number };
    if (!payload.exp) return true;
    return payload.exp * 1000 < Date.now() + skewSeconds * 1000;
  } catch {
    return true;
  }
}

export type ClerkLikeUser = {
  id: string;
  primaryEmailAddress?: { emailAddress?: string } | null;
  fullName?: string | null;
  firstName?: string | null;
  imageUrl?: string | null;
};

/** POST /api/auth/clerk-sync — stores cf_backend_token for API calls. */
export async function syncClerkToBackendToken(user: ClerkLikeUser): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/auth/clerk-sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerk_id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || user.firstName || "User",
        image_url: user.imageUrl, 
      }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { access_token: string };
    localStorage.setItem("cf_backend_token", data.access_token);
    localStorage.setItem(
      "cf_synced_email",
      user.primaryEmailAddress?.emailAddress || "",
    );
    return true;
  } catch {
    return false;
  }
}
