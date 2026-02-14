"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  startTransition,
} from "react";
import type { GameState } from "@/lib/game/types";
import { calculateWordScore } from "@/lib/game/scoring";
import { getRandomStartingWord, isValidWord } from "@/lib/utils";

const GAME_DURATION = 60; // 60 seconds

function getComboMultiplier(
  elapsedMs: number
): { multiplier: number; label: string } | null {
  if (elapsedMs < 1000) return { multiplier: 3, label: "x3" };
  if (elapsedMs < 2000) return { multiplier: 2, label: "x2" };
  if (elapsedMs < 3000) return { multiplier: 1.5, label: "x1.5" };
  if (elapsedMs < 4000) return { multiplier: 1.25, label: "x1.25" };
  if (elapsedMs < 5000) return { multiplier: 1.1, label: "x1.1" };

  return null;
}

function generateSessionToken(): string {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.getRandomValues
  ) {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }

  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0")
  ).join("");
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    status: "idle",
    currentWord: "",
    lastTwoLetters: "",
    words: [],
    score: 0,
    timeRemaining: GAME_DURATION,
    chainLength: 0,
    longestChain: 0,
    sessionToken: null,
    wordStartTime: 0,
    combo: null,
  });

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wordsSetRef = useRef<Set<string>>(new Set());

  const startGame = useCallback(async () => {
    const sessionToken = generateSessionToken();
    const startingWord = getRandomStartingWord();

    try {
      await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken, language: "es" }),
      });
    } catch (e) {
      console.error("Failed to create session:", e);
    }

    setGameState({
      status: "playing",
      currentWord: startingWord,
      lastTwoLetters: startingWord.slice(-2).toLowerCase(),
      words: [startingWord],
      score: 10, // Starting word gives 10 points
      timeRemaining: GAME_DURATION,
      chainLength: 1,
      longestChain: 1,
      sessionToken,
      wordStartTime: Date.now(),
      combo: null,
    });
    setInputValue("");
    setError(null);
  }, []);

  const submitWord = useCallback(() => {
    if (gameState.status !== "playing" || isSubmitting) return;

    const word = inputValue.toLowerCase().trim();

    if (!word) {
      setError("Escribe una palabra");
      return;
    }

    if (word.length < 2) {
      setError("La palabra debe tener al menos 2 letras");
      return;
    }

    if (!word.startsWith(gameState.lastTwoLetters)) {
      setError(
        `La palabra debe empezar con "${gameState.lastTwoLetters.toUpperCase()}"`
      );
      return;
    }

    if (wordsSetRef.current.has(word)) {
      setError("Ya usaste esta palabra");
      return;
    }

    if (!isValidWord(word)) {
      setError("Palabra no válida en español");
      return;
    }

    const newChainLength = gameState.chainLength + 1;
    const wordScore = calculateWordScore(word, newChainLength);
    const elapsedMs = Date.now() - gameState.wordStartTime;
    const combo = getComboMultiplier(elapsedMs);
    const finalWordScore = combo ? wordScore * combo.multiplier : wordScore;

    setInputValue("");
    setError(null);

    startTransition(() => {
      setGameState((prev) => ({
        ...prev,
        currentWord: word,
        lastTwoLetters: word.slice(-2).toLowerCase(),
        words: [...prev.words, word],
        score: prev.score + finalWordScore,
        chainLength: newChainLength,
        longestChain: Math.max(prev.longestChain, newChainLength),
        wordStartTime: Date.now(),
        combo,
      }));
    });
  }, [gameState, inputValue, isSubmitting]);

  const endGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: "finished",
    }));

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      status: "idle",
      currentWord: "",
      lastTwoLetters: "",
      words: [],
      score: 0,
      timeRemaining: GAME_DURATION,
      chainLength: 0,
      longestChain: 0,
      sessionToken: null,
      wordStartTime: 0,
      combo: null,
    });
    setInputValue("");
    setError(null);
  }, []);

  useEffect(() => {
    wordsSetRef.current = new Set(gameState.words);
  }, [gameState.words]);

  useEffect(() => {
    if (gameState.status === "playing") {
      timerRef.current = setInterval(() => {
        startTransition(() => {
          setGameState((prev) => {
            if (prev.timeRemaining <= 1) {
              return { ...prev, status: "finished", timeRemaining: 0 };
            }
            return { ...prev, timeRemaining: prev.timeRemaining - 1 };
          });
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState.status]);

  useEffect(() => {
    if (gameState.status === "playing" && gameState.timeRemaining === 0) {
      endGame();
    }
  }, [gameState.status, gameState.timeRemaining, endGame]);

  return {
    gameState,
    inputValue,
    setInputValue,
    error,
    isSubmitting,
    setIsSubmitting,
    startGame,
    submitWord,
    endGame,
    resetGame,
  };
}
