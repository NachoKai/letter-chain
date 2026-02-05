"use client";

import { cn } from "@/lib/utils";

interface LetterTileProps {
  letter: string;
  variant?: "default" | "highlight" | "muted";
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export function LetterTile({
  letter,
  variant = "default",
  size = "md",
  animate = false,
}: LetterTileProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-mono font-bold uppercase rounded-lg border-2 select-none",
        "transition-all duration-200",
        {
          // Variants
          "bg-card text-card-foreground border-border": variant === "default",
          "bg-primary text-primary-foreground border-primary":
            variant === "highlight",
          "bg-muted text-muted-foreground border-muted": variant === "muted",
          // Sizes
          "w-8 h-8 text-sm": size === "sm",
          "w-12 h-12 text-xl": size === "md",
          "w-16 h-16 text-3xl": size === "lg",
          // Animation
          "animate-bounce": animate,
        }
      )}
    >
      {letter}
    </div>
  );
}
