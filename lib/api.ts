const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  token?: string | null;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { headers, ...rest });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `API error ${res.status}`);
  }

  return res.json();
}

export async function createBackendSession(email: string, name: string): Promise<string> {
  try {
    const data = await apiFetch<{ access_token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, name, password: `clerk_${Date.now()}_auto` }),
    });
    return data.access_token;
  } catch {
    const data = await apiFetch<{ access_token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: `clerk_${Date.now()}_auto` }),
    });
    return data.access_token;
  }
}