import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Building2, ListChecks, MapPinned, LayoutDashboard, Scale, ScrollText } from "lucide-react";

import { RequireAdmin } from "@/components/auth/guards";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — PlaceRight" }] }),
  component: AdminRoute,
});

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/universities", label: "Universities", icon: Building2 },
  { to: "/admin/courses", label: "Courses", icon: ScrollText },
  { to: "/admin/requirements", label: "Requirements", icon: ListChecks },
  { to: "/admin/scoring-policies", label: "Scoring policies", icon: Scale },
  { to: "/admin/catchment-rules", label: "Catchment rules", icon: MapPinned },
] as const;

function AdminRoute() {
  return (
    <RequireAdmin>
      <AdminLayout />
    </RequireAdmin>
  );
}

function AdminNavLink({ to, label, icon: Icon }: (typeof NAV)[number]) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = to === "/admin" ? pathname === "/admin" : pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
        isActive && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  );
}

function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-7xl">
        <aside className="hidden w-56 shrink-0 border-r border-border py-6 pr-4 md:block">
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Policy management
          </p>
          <nav className="mt-3 space-y-0.5">
            {NAV.map((item) => (
              <AdminNavLink key={item.to} {...item} />
            ))}
          </nav>
        </aside>

        <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 py-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              activeProps={{ className: "border-primary text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
