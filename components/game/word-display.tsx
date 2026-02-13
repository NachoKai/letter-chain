"use client";

import { memo } from "react";

import { LetterTile } from "./letter-tile";
import { cn } from "@/lib/utils";

interface WordDisplayProps {
  word: string;
  highlightLast?: boolean;
  className?: string;
}

export const WordDisplay = memo(function WordDisplay({
  word,
  highlightLast = true,
  className,
}: WordDisplayProps) {
  const letters = word.split("");

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1 flex-wrap max-w-full",
        className
      )}
    >
      {letters.map((letter, index) => (
        <LetterTile
          key={`${letter}-${index}`}
          letter={letter}
          variant={
            highlightLast &&
            (index === letters.length - 1 || index === letters.length - 2)
              ? "highlight"
              : "default"
          }
          size="lg"
          className="flex-shrink-0"
        />
      ))}
    </div>
  );
});
