"use client";

import { formatScore } from "@/lib/game/scoring";

interface ScoreDisplayProps {
  score: number;
  wordsCount: number;
  chainLength: number;
}

export function ScoreDisplay({ score, wordsCount, chainLength }: ScoreDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-8">
      <div className="text-center">
        <div className="text-sm text-muted-foreground uppercase tracking-wider">Puntos</div>
        <div className="text-3xl font-bold font-mono tabular-nums">{formatScore(score)}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground uppercase tracking-wider">Palabras</div>
        <div className="text-3xl font-bold font-mono tabular-nums">{wordsCount}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground uppercase tracking-wider">Cadena</div>
        <div className="text-3xl font-bold font-mono tabular-nums">{chainLength}</div>
      </div>
    </div>
  );
}
