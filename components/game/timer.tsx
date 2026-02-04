"use client";

import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/game/scoring";

interface TimerProps {
  timeRemaining: number;
  totalTime?: number;
}

export function Timer({ timeRemaining, totalTime = 60 }: TimerProps) {
  const percentage = (timeRemaining / totalTime) * 100;
  const isLow = timeRemaining <= 10;
  const isCritical = timeRemaining <= 5;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "text-4xl font-mono font-bold tabular-nums transition-colors duration-300",
          {
            "text-foreground": !isLow,
            "text-warning": isLow && !isCritical,
            "text-destructive animate-pulse": isCritical,
          }
        )}
      >
        {formatTime(timeRemaining)}
      </div>
      <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-linear rounded-full",
            {
              "bg-primary": !isLow,
              "bg-warning": isLow && !isCritical,
              "bg-destructive": isCritical,
            }
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
