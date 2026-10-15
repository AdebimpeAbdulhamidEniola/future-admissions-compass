import type { AuthSession, AuthUser } from "@/types/domain";

// The session is kept in localStorage so a page refresh (or a new tab) stays signed in. It is
// dropped as soon as the token expires or the API rejects it.
const STORAGE_KEY = "placeright.session";

let session: AuthSession | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

/** True when the JWT's `exp` claim is in the past (or the token can't be read). */
function isExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as {
      exp?: number;
    };
    return typeof json.exp === "number" && json.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function readStored(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as AuthSession;
    if (!stored?.accessToken || !stored.user || isExpired(stored.accessToken)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return stored;
  } catch {
    return null;
  }
}

function writeStored(next: AuthSession | null) {
  try {
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode etc.) — the session still works until the page is reloaded.
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  session = readStored();
}

export const authStore = {
  getSession(): AuthSession | null {
    ensureLoaded();
    return session;
  },
  getToken(): string | null {
    return authStore.getSession()?.accessToken ?? null;
  },
  getUser(): AuthUser | null {
    return authStore.getSession()?.user ?? null;
  },
  setSession(next: AuthSession | null) {
    loaded = true;
    session = next;
    writeStored(next);
    emit();
  },
  clear() {
    authStore.setSession(null);
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    // Signing in or out in another tab updates this one too.
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      session = readStored();
      listener();
    };
    if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
    };
  },
};
