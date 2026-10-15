import { useEffect, useState } from "react";

/**
 * False during server rendering and until React has taken over the page in the browser; true after.
 * Before that, a form submit would be handled by the browser itself, not by our code.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
