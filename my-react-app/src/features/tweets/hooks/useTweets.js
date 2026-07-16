// src/features/tweets/hooks/useTweets.js
import { useState, useEffect, useCallback } from "react";
import {
  createTweet,
  getMyTweets,
  updateTweet,
  deleteTweet,
} from "../services/tweetService";

export function useTweets() {
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extracts a safe, user-facing message — never render raw backend error objects (Rules.md)
  const getErrorMessage = (err) =>
    err.response?.data?.message || "Something went wrong. Please try again.";

  const fetchTweets = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getMyTweets(params);
      setTweets(res.data.data.tweets ?? res.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  const create = useCallback(
    async (formData) => {
      try {
        await createTweet(formData);
        await fetchTweets(); // keep list in sync
      } catch (err) {
        setError(getErrorMessage(err));
        throw err; // let the calling form know it failed, so it can stay open
      }
    },
    [fetchTweets]
  );

  const update = useCallback(
    async (id, data) => {
      try {
        await updateTweet(id, data);
        await fetchTweets();
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      }
    },
    [fetchTweets]
  );

  const remove = useCallback(
    async (id) => {
      try {
        await deleteTweet(id);
        await fetchTweets();
      } catch (err) {
        setError(getErrorMessage(err));
        throw err;
      }
    },
    [fetchTweets]
  );

  return { tweets, isLoading, error, refetch: fetchTweets, create, update, remove };
}