"use client";

import { memo } from "react";

import { cn } from "@/lib/utils";

interface WordHistoryProps {
  words: string[];
  maxVisible?: number;
}

export const WordHistory = memo(function WordHistory({
  words,
  maxVisible = 10,
}: WordHistoryProps) {
  const wordsLength = words.length;
  const visibleWords = words.slice(-maxVisible);
  const hasMore = wordsLength > maxVisible;

  return (
    <div className="w-full max-w-md">
      <div className="text-sm text-muted-foreground mb-2 flex items-center justify-between">
        <span>Historial</span>
        {hasMore && (
          <span className="text-xs">+{wordsLength - maxVisible} más</span>
        )}
      </div>
      <div
        className="flex flex-wrap gap-2 justify-center"
        style={{ contentVisibility: "auto" }}
      >
        {visibleWords.map((word, index) => {
          const globalIndex = wordsLength - visibleWords.length + index;
          return (
            <div
              key={`${word}-${globalIndex}`}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-mono uppercase transition-all",
                "bg-secondary text-secondary-foreground",
                index === visibleWords.length - 1 &&
                  "bg-primary text-primary-foreground"
              )}
            >
              {word}
            </div>
          );
        })}
      </div>
    </div>
  );
});
