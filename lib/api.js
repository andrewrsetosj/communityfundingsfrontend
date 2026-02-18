import { useAuth } from "@clerk/clerk-react";

export function useAuthorizedFetch() {
  const { getToken } = useAuth();

  return async (url, options = {}) => {
    const token = await getToken();

    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };
}
