"use client";

import React, { useRef, useEffect, useCallback, useMemo } from "react";
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

  const displayedValue = useMemo(
    () =>
      requiredLetter.length > 0 ? value.substring(requiredLetter.length) : "",
    [requiredLetter, value]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(requiredLetter + e.target.value.toLowerCase());
    },
    [requiredLetter, onChange]
  );

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, requiredLetter]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      }
    },
    [onSubmit]
  );

  const inputClassName = useMemo(
    () =>
      cn(
        "h-14 text-lg font-mono uppercase touch-manipulation",
        error && "border-destructive focus-visible:ring-destructive"
      ),
    [error]
  );

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-primary text-primary-foreground rounded-lg font-mono font-bold text-2xl uppercase touch-manipulation select-none">
          {requiredLetter}
        </div>
        <Input
          ref={inputRef}
          type="text"
          value={displayedValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Palabra con "${requiredLetter.toUpperCase()}"...`}
          disabled={disabled}
          className={inputClassName}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode="text"
          enterKeyHint="send"
        />
        <Button
          onClick={onSubmit}
          disabled={disabled || !displayedValue.trim()}
          className="h-14 px-6 min-w-[80px] touch-manipulation"
          size="lg"
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
