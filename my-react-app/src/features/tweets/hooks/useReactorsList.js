// src/features/tweets/hooks/useReactorsList.js
import { useState, useEffect, useCallback, useRef } from "react";

const PAGE_SIZE = 10;

// fetchFn: one of getTweetLikes / getTweetDislikes / getTweetReposts from tweetService
// Generic so all three reactor lists share one hook, following the same infinite-scroll
// pattern as useTweetFeed.js (Phase 7) — per Rules.md's "always infinite scroll" rule.
export function useReactorsList(fetchFn, tweetId, enabled) {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);

  const fetchPage = useCallback(
    async (pageToFetch) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchFn(tweetId, { page: pageToFetch, limit: PAGE_SIZE });
        const { users: newUsers, pagination } = res.data.data;
        setUsers((prev) => (pageToFetch === 1 ? newUsers : [...prev, ...newUsers]));
        setTotalPages(pagination.totalPages);
        setPage(pageToFetch);
      } catch (err) {
        setError(err.response?.data?.message || "Couldn't load list. Please try again.");
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [fetchFn, tweetId]
  );

  // Only fetch once the dialog is actually open (enabled=true) — no point fetching in the background
  useEffect(() => {
    if (enabled) {
      setUsers([]);
      setPage(1);
      setTotalPages(1);
      fetchPage(1);
    }
  }, [enabled, fetchPage]);

  const hasMore = page < totalPages;
  const loadMore = useCallback(() => {
    if (hasMore && !isFetchingRef.current) fetchPage(page + 1);
  }, [hasMore, page, fetchPage]);

  return { users, isLoading, error, hasMore, loadMore };
}