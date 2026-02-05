"use client";

import React from "react";

import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  requiredLetter: string;
  error?: string | null;
  disabled?: boolean;
}

export function WordInput({
  value,
  onChange,
  onSubmit,
  requiredLetter,
  error,
  disabled,
}: WordInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, requiredLetter]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground rounded-lg font-mono font-bold text-2xl uppercase">
          {requiredLetter}
        </div>
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Palabra con "${requiredLetter.toUpperCase()}"...`}
          disabled={disabled}
          className={cn(
            "h-12 text-lg font-mono uppercase",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <Button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="h-12 px-6"
        >
          Enviar
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive text-center animate-shake">
          {error}
        </p>
      )}
    </div>
  );
}
