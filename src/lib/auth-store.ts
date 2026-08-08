import type { AuthSession, AuthUser } from "@/types/domain";

// In-memory only. No localStorage-dependent business logic by design.
let session: AuthSession | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const authStore = {
  getSession(): AuthSession | null {
    return session;
  },
  getToken(): string | null {
    return session?.accessToken ?? null;
  },
  getUser(): AuthUser | null {
    return session?.user ?? null;
  },
  setSession(next: AuthSession | null) {
    session = next;
    emit();
  },
  clear() {
    session = null;
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
