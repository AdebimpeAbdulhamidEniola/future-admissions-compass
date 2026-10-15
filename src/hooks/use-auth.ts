import { useSyncExternalStore } from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { authStore } from "@/lib/auth-store";

export function useAuth() {
  const hydrated = useHydrated();
  const stored = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSession,
    () => null, // SSR: the saved session lives in the browser only
  );
  const session = hydrated ? stored : null;

  return {
    session,
    /** Until this is true, "not signed in" may just mean the saved session hasn't been read yet. */
    ready: hydrated,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session),
    isAdmin: session?.user.role === "ADMIN",
    setSession: authStore.setSession,
    logout: authStore.clear,
  };
}
