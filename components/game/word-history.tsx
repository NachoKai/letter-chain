"use client";

import { cn } from "@/lib/utils";

interface WordHistoryProps {
  words: string[];
  maxVisible?: number;
}

export function WordHistory({ words, maxVisible = 10 }: WordHistoryProps) {
  const visibleWords = words.slice(-maxVisible);
  const hasMore = words.length > maxVisible;

  return (
    <div className="w-full max-w-md">
      <div className="text-sm text-muted-foreground mb-2 flex items-center justify-between">
        <span>Historial</span>
        {hasMore && (
          <span className="text-xs">+{words.length - maxVisible} más</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {visibleWords.map((word, index) => {
          const globalIndex = words.length - visibleWords.length + index;
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
}
