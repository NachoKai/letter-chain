"use client";

import useSWR from "swr";
import { cn } from "@/lib/utils";
import { formatScore } from "@/lib/game/scoring";
import type { LeaderboardEntry } from "@/lib/game/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface LeaderboardProps {
  className?: string;
  limit?: number;
}

export function Leaderboard({ className, limit = 10 }: LeaderboardProps) {
  const { data, error, isLoading } = useSWR<{ entries: LeaderboardEntry[] }>(
    `/api/leaderboard?limit=${limit}`,
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30 seconds
  );

  if (isLoading) {
    return (
      <div className={cn("w-full", className)}>
        <h3 className="text-lg font-semibold mb-4 text-center">
          Tabla de Líderes
        </h3>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("w-full text-center", className)}>
        <h3 className="text-lg font-semibold mb-4">Tabla de Líderes</h3>
        <p className="text-muted-foreground text-sm">
          Error al cargar la tabla
        </p>
      </div>
    );
  }

  const entries = data?.entries || [];

  return (
    <div className={cn("w-full", className)}>
      <h3 className="text-lg font-semibold mb-4 text-center">
        Tabla de Líderes
      </h3>
      {entries.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center">
          Sin puntuaciones todavía. ¡Sé el primero!
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                index === 0 && "bg-primary/10 border border-primary/20",
                index === 1 && "bg-secondary",
                index === 2 && "bg-secondary/50",
                index > 2 && "bg-card border"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  index === 0 && "bg-primary text-primary-foreground",
                  index === 1 && "bg-foreground/80 text-background",
                  index === 2 && "bg-foreground/60 text-background",
                  index > 2 && "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {entry.country_flag && (
                    <span className="text-lg">{entry.country_flag}</span>
                  )}
                  <div className="font-medium truncate">
                    {entry.player_name}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {entry.words_count} palabras · cadena de {entry.longest_chain}
                </div>
              </div>
              <div className="font-mono font-bold text-lg">
                {formatScore(entry.score)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
