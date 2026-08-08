import { Link } from "@tanstack/react-router";
import { DisclaimerCallout } from "./disclaimer-callout";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12">
        <DisclaimerCallout />
        <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            PlaceRight — an intelligent decision support system for university admission placement.
          </p>
          <nav className="flex gap-5">
            <Link to="/login" className="hover:text-foreground">
              Sign in
            </Link>
            <Link to="/register" className="hover:text-foreground">
              Create account
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
