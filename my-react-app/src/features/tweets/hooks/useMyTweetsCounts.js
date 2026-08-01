// src/features/tweets/hooks/useMyTweetsCounts.js
import { useQueries } from "@tanstack/react-query";
import { getMyTweets } from "../services/tweetService";
import { tweetKeys } from "../../../constants/queryKeys";

// Matches the Figma pill set exactly. "approved" is a real backend status
// (see constants/tweetStatus.js) but isn't one of the Figma pills, so it's
// intentionally left out here too.
export const STATUS_PILLS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "awaiting_approval", label: "Pending" },
  { value: "published", label: "Published" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

// One lightweight request per pill (limit: 1 — we only need pagination.totalCount),
// run in parallel, so counts reflect ALL of your tweets per status, not just
// what's currently loaded via infinite scroll.
export function useMyTweetsCounts() {
  const results = useQueries({
    queries: STATUS_PILLS.map(({ value }) => ({
      queryKey: [...tweetKeys.myTweets(value), "count"],
      queryFn: async () => {
        const res = await getMyTweets({
          limit: 1,
          ...(value !== "all" && { status: value }),
        });
        return res.data.data.pagination.totalCount;
      },
    })),
  });

  const counts = {};
  STATUS_PILLS.forEach(({ value }, i) => {
    counts[value] = results[i].data ?? 0;
  });

  return { counts, isLoading: results.some((r) => r.isLoading) };
}