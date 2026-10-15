import { authStore } from "./auth-store";

export const USE_MOCKS = import.meta.env["VITE_USE_MOCKS"] !== "false";
const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] ?? "http://localhost:3000";

export class ApiError extends Error {
  statusCode: number;
  error: string | undefined;
  details: unknown;

  constructor(statusCode: number, message: string, error?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.error = error;
    this.details = details;
  }
}

type NestErrorEnvelope = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};

/** Render's free tier sleeps when idle; waking it takes up to about a minute. */
const WAKE_UP_TIMEOUT_MS = 120_000;
const WAKE_UP_RETRY_DELAY_MS = 3_000;
const WAKING_STATUSES = new Set([502, 503, 504]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * fetch() that keeps trying while the server is still waking up (connection refused, or the host
 * answering 502/503/504), so the page simply keeps loading instead of showing an error.
 */
async function fetchUntilAwake(url: string, init: RequestInit): Promise<Response> {
  const startedAt = Date.now();
  for (;;) {
    const timedOut = () => Date.now() - startedAt + WAKE_UP_RETRY_DELAY_MS > WAKE_UP_TIMEOUT_MS;
    try {
      const response = await fetch(url, init);
      if (!WAKING_STATUSES.has(response.status) || timedOut()) return response;
    } catch {
      if (timedOut()) {
        throw new ApiError(
          0,
          "We couldn't reach the server. Check your internet connection and try again.",
          "NetworkError",
        );
      }
    }
    await sleep(WAKE_UP_RETRY_DELAY_MS);
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = authStore.getToken();

  const response = await fetchUntilAwake(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const text = await response.text().catch(() => "");
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      // Not JSON — e.g. a host's HTML error page.
      if (response.ok) {
        throw new ApiError(response.status, "The server sent a reply we couldn't read.", "BadResponse");
      }
    }
  }

  if (!response.ok) {
    // A token the API no longer accepts (expired, or signed with an old secret): sign out so the
    // guards send the user to /login instead of failing on every page.
    if (response.status === 401 && token && authStore.getToken() === token) authStore.clear();

    const envelope = (payload ?? {}) as NestErrorEnvelope;
    const message = Array.isArray(envelope.message)
      ? envelope.message.join(", ")
      : envelope.message || response.statusText || "Request failed";
    throw new ApiError(envelope.statusCode ?? response.status, message, envelope.error, payload);
  }

  return payload as T;
}

export const http = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};

/** Simulates 400–900ms of Nigerian mobile-data latency. */
export function mockDelay<T>(value: T, ms?: number): Promise<T> {
  const latency = ms ?? 400 + Math.floor(Math.random() * 500);
  return new Promise((resolve) => setTimeout(() => resolve(value), latency));
}

/** Simulated failure path so error states are reachable with mocks on. */
export function mockFailure(statusCode: number, message: string, error = "Bad Request"): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new ApiError(statusCode, message, error)), 500);
  });
}
