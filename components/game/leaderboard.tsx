"use client";

import { useLeaderboardQuery } from "@/hooks/use-game-queries";
import { cn } from "@/lib/utils";
import { formatScore } from "@/lib/game/scoring";
import ReactCountryFlag from "react-country-flag";

interface LeaderboardProps {
  className?: string;
  limit?: number;
}

export function Leaderboard({ className, limit = 10 }: LeaderboardProps) {
  const { data, error, isLoading } = useLeaderboardQuery(limit);

  if (isLoading) {
    return (
      <div className={cn("w-full", className)}>
        <h3 className="text-lg font-semibold mb-4 text-center">
          Tabla de Líderes2
        </h3>
        <div className="space-y-2">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors",
                i === 0 && "bg-primary/10 border border-primary/20",
                i === 1 && "bg-secondary",
                i === 2 && "bg-secondary/50",
                i > 2 && "bg-card border"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  i === 0 && "bg-primary/30",
                  i === 1 && "bg-foreground/30",
                  i === 2 && "bg-foreground/20",
                  i > 2 && "bg-muted"
                )}
              >
                <div className="w-3 h-3 bg-muted-foreground/30 rounded animate-pulse" />
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-[1.2em] h-[1.2em] bg-muted/60 rounded-sm animate-pulse" />
                  <div className="h-4 bg-muted/60 rounded animate-pulse w-28" />
                </div>
                <div className="h-3 bg-muted/40 rounded animate-pulse w-36" />
              </div>

              <div className="h-6 w-16 bg-muted/60 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("w-full text-center", className)}>
        <h3 className="text-lg font-semibold mb-4">Tabla de Líderes3</h3>
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
        Tabla de Líderes4
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
                  {entry.country_code && (
                    <ReactCountryFlag
                      countryCode={entry.country_code}
                      svg
                      style={{
                        width: "1.2em",
                        height: "1.2em",
                      }}
                      title={entry.country_name || entry.country_code}
                    />
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
