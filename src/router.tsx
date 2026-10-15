import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { ApiError } from "./lib/http";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // The API client already waits for a sleeping server to wake up, and a 4xx won't change
        // on retry — so retry only unexpected failures, once.
        retry: (failureCount, error) =>
          !(error instanceof ApiError && (error.statusCode === 0 || error.statusCode < 500)) &&
          failureCount < 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
