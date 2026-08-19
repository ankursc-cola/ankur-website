import { useState, useEffect } from "react";

/**
 * Fetches from Sanity via `fetchFn`, and falls back to `fallbackData`
 * if the fetch returns nothing (empty Sanity dataset, not set up yet,
 * a network error already caught inside sanity.js's safeFetch — OR a
 * query that legitimately found no match).
 *
 * IMPORTANT: this handles TWO different shapes of Sanity result:
 *   - a LIST query (e.g. fetchEvents, fetchCommittee) returns an array
 *   - a single-item query ending in [0] (e.g. fetchFeaturedEvent)
 *     returns one plain object, or null if nothing matched
 *
 * An earlier version of this hook only checked `result.length > 0`,
 * which works for arrays but is always false for a plain object
 * (objects have no .length) — so it silently ignored every real
 * single-object result and used the fallback forever, even after
 * real Sanity content existed. Checking `Array.isArray` first is
 * what fixes that.
 */
export default function useSanityData(fetchFn, fallbackData, deps = []) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchFn().then((result) => {
      if (cancelled) return;

      const isEmpty =
        result == null ||
        (Array.isArray(result) && result.length === 0);

      setData(isEmpty ? fallbackData : result);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading };
}