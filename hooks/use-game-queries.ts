"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LeaderboardEntry, SubmitScorePayload } from "@/lib/game/types";

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
}

export function useLeaderboardQuery(limit: number = 10) {
  return useQuery<LeaderboardResponse>({
    queryKey: ["leaderboard", limit],
    queryFn: async () => {
      const response = await fetch(`/api/leaderboard?limit=${limit}`);

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      return (await response.json()) as LeaderboardResponse;
    },
    refetchInterval: 30000,
  });
}

export function useSubmitScoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitScorePayload) => {
      const response = await fetch("/api/game/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit score");
      }

      return data as { success: boolean };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
