// src/features/tweets/hooks/useTweets.js
import { useState, useEffect, useCallback } from "react";
import {
  createTweet,
  getMyTweets,
  updateTweet,
  deleteTweet,
} from "../services/tweetService";
import { useErrorToast } from "../../../hooks/useErrorToast";

export function useTweets() {
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useErrorToast();

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
      showError(err, "Couldn't load your tweets");
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  const create = useCallback(
    async (formData) => {
      try {
        await createTweet(formData);
        await fetchTweets();
      } catch (err) {
        setError(getErrorMessage(err));
        showError(err, "Couldn't post tweet");
        throw err;
      }
    },
    [fetchTweets, showError]
  );

  const update = useCallback(
    async (id, data) => {
      try {
        await updateTweet(id, data);
        await fetchTweets();
      } catch (err) {
        setError(getErrorMessage(err));
        showError(err, "Couldn't update tweet");
        throw err;
      }
    },
    [fetchTweets, showError]
  );

  const remove = useCallback(
    async (id) => {
      try {
        await deleteTweet(id);
        await fetchTweets();
      } catch (err) {
        setError(getErrorMessage(err));
        showError(err, "Couldn't delete tweet");
        throw err;
      }
    },
    [fetchTweets, showError]
  );

  return { tweets, isLoading, error, refetch: fetchTweets, create, update, remove };
}