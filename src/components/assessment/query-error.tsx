import { AlertTriangle, Loader2, RotateCw } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/http";

/** A friendly explanation of why a request failed, based on the API error. */
export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.statusCode === 0) {
      return "We couldn't reach the server. Check your internet connection and try again.";
    }
    if (error.statusCode === 502 || error.statusCode === 503 || error.statusCode === 504) {
      return "The server is starting up. Wait a few seconds and try again.";
    }
    if (error.statusCode === 404) return "We couldn't find this information.";
    if (error.statusCode >= 500) return "Something went wrong on our side. Please try again.";
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

export function QueryError({
  title,
  error,
  onRetry,
  retrying = false,
}: {
  title: string;
  error: unknown;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
        <span>{describeError(error)}</span>
        {onRetry && (
          <Button type="button" variant="outline" size="sm" onClick={onRetry} disabled={retrying}>
            {retrying ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : (
              <RotateCw className="mr-1.5 size-4" />
            )}
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
