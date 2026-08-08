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

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = authStore.getToken();
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new ApiError(0, "Network unavailable. Check your connection and try again.", "NetworkError");
  }

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const envelope = (payload ?? {}) as NestErrorEnvelope;
    const message = Array.isArray(envelope.message)
      ? envelope.message.join(", ")
      : envelope.message ?? response.statusText ?? "Request failed";
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
