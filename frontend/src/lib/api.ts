/**
 * API utility: centralized fetch with auth token injection
 */

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: object | FormData;
  auth?: boolean; // attach Bearer token (default: true)
};

export async function apiFetch(path: string, options: FetchOptions = {}) {
  const { auth = true, body, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {};

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let fetchBody: RequestInit["body"];
  if (body instanceof FormData) {
    fetchBody = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(body);
  }

  const res = await fetch(`/api/v1${path}`, {
    ...rest,
    headers: { ...headers, ...(extraHeaders as Record<string, string>) },
    body: fetchBody,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }
  return data;
}
