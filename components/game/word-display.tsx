"use client";

import { LetterTile } from "./letter-tile";
import { cn } from "@/lib/utils";

interface WordDisplayProps {
  word: string;
  highlightLast?: boolean;
  className?: string;
}

export function WordDisplay({
  word,
  highlightLast = true,
  className,
}: WordDisplayProps) {
  const letters = word.split("");

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {letters.map((letter, index) => (
        <LetterTile
          key={`${letter}-${index}`}
          letter={letter}
          variant={
            highlightLast && index === letters.length - 1
              ? "highlight"
              : "default"
          }
          size="lg"
        />
      ))}
    </div>
  );
}
