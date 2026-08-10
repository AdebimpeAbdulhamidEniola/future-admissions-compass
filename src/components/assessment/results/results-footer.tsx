import { Link } from "@tanstack/react-router";
import { ArrowLeftRight, Printer, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ResultsFooter() {
  return (
    <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <Button variant="outline" size="sm" asChild>
          <Link to="/assessment/new">
            <ArrowLeftRight />
            Compare another university
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to="/assessment/new">
            <RotateCcw />
            Start a new assessment
          </Link>
        </Button>
        <Button size="sm" onClick={() => window.print()}>
          <Printer />
          Download as PDF
        </Button>
      </div>
    </div>
  );
}
