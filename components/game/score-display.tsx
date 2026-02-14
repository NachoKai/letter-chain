"use client";

import { memo } from "react";

import { formatScore } from "@/lib/game/scoring";

interface ScoreDisplayProps {
  score: number;
  wordsCount: number;
  chainLength: number;
  combo?: {
    multiplier: number;
    label: string;
  } | null;
}

const comboColors: Record<number, string> = {
  3: "text-blue-500",
  2: "text-green-500",
  1.5: "text-yellow-500",
  1.25: "text-orange-500",
  1.1: "text-red-500",
};

export const ScoreDisplay = memo(function ScoreDisplay({
  score,
  wordsCount,
  chainLength,
  combo,
}: ScoreDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-8">
      <div className="text-center relative">
        <div className="text-sm text-muted-foreground uppercase tracking-wider">
          Puntos
        </div>
        <div className="text-3xl font-bold font-mono tabular-nums flex items-center gap-2">
          {formatScore(score)}
          {combo && (
            <span
              className={`text-lg font-bold animate-pulse ${
                comboColors[combo.multiplier] ?? "text-amber-500"
              }`}
            >
              {combo.label}
            </span>
          )}
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground uppercase tracking-wider">
          Palabras
        </div>
        <div className="text-3xl font-bold font-mono tabular-nums">
          {wordsCount}
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground uppercase tracking-wider">
          Cadena
        </div>
        <div className="text-3xl font-bold font-mono tabular-nums">
          {chainLength}
        </div>
      </div>
    </div>
  );
});
