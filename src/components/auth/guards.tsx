import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

function Redirecting() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-16">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { ready, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until the saved session has been read, or a refresh would bounce to /login.
    if (ready && !isAuthenticated) void navigate({ to: "/login", replace: true });
  }, [ready, isAuthenticated, navigate]);

  if (!ready || !isAuthenticated) return <Redirecting />;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { ready, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) void navigate({ to: "/login", replace: true });
    else if (!isAdmin) void navigate({ to: "/", replace: true });
  }, [ready, isAuthenticated, isAdmin, navigate]);

  if (!ready || !isAuthenticated || !isAdmin) return <Redirecting />;
  return <>{children}</>;
}
