// src/features/tweets/hooks/useTweetFeed.js
import { useState, useEffect, useCallback, useRef } from "react";
import { getAllTweets } from "../services/tweetService";
import { useErrorToast } from "../../../hooks/useErrorToast";

const PAGE_SIZE = 10;

export function useTweetFeed({ search = "", status = "", sortBy = "-createdAt" } = {}) {
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useErrorToast();

  const isFetchingRef = useRef(false);

  const getErrorMessage = (err) =>
    err.response?.data?.message || "Something went wrong. Please try again.";

  const fetchPage = useCallback(
    async (pageToFetch, replace) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);
      try {
        const res = await getAllTweets({
          page: pageToFetch,
          limit: PAGE_SIZE,
          search: search || undefined,
          status: status || undefined,
          sortBy,
        });
        const { tweets: newTweets, pagination } = res.data.data;
        setTweets((prev) => (replace ? newTweets : [...prev, ...newTweets]));
        setTotalPages(pagination.totalPages);
        setPage(pageToFetch);
      } catch (err) {
        setError(getErrorMessage(err));
        showError(err, "Couldn't load the feed");
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [search, status, sortBy, showError]
  );

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  const hasMore = page < totalPages;

  const loadMore = useCallback(() => {
    if (hasMore && !isFetchingRef.current) {
      fetchPage(page + 1, false);
    }
  }, [hasMore, page, fetchPage]);

  return { tweets, isLoading, error, hasMore, loadMore };
}