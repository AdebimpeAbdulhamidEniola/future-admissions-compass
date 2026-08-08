import { useSyncExternalStore } from "react";
import { authStore } from "@/lib/auth-store";

export function useAuth() {
  const session = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSession,
    () => null, // SSR: never authenticated on the server (in-memory store)
  );

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session),
    isAdmin: session?.user.role === "ADMIN",
    setSession: authStore.setSession,
    logout: authStore.clear,
  };
}
