"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { GameState } from "@/lib/game/types";
import { isValidSpanishWord, getRandomStartingWord } from "@/lib/dictionary/spanish";
import { calculateWordScore } from "@/lib/game/scoring";

const GAME_DURATION = 60; // 60 seconds

function generateSessionToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    status: "idle",
    currentWord: "",
    lastLetter: "",
    words: [],
    score: 0,
    timeRemaining: GAME_DURATION,
    chainLength: 0,
    longestChain: 0,
    sessionToken: null,
  });

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start a new game
  const startGame = useCallback(async () => {
    const sessionToken = generateSessionToken();
    const startingWord = getRandomStartingWord();
    
    // Create session on server
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
      lastLetter: startingWord.slice(-1).toLowerCase(),
      words: [startingWord],
      score: 10, // Starting word gives 10 points
      timeRemaining: GAME_DURATION,
      chainLength: 1,
      longestChain: 1,
      sessionToken,
    });
    setInputValue("");
    setError(null);
  }, []);

  // Submit a word
  const submitWord = useCallback(() => {
    if (gameState.status !== "playing" || isSubmitting) return;

    const word = inputValue.toLowerCase().trim();
    
    // Validation
    if (!word) {
      setError("Escribe una palabra");
      return;
    }

    if (word.length < 2) {
      setError("La palabra debe tener al menos 2 letras");
      return;
    }

    if (!word.startsWith(gameState.lastLetter)) {
      setError(`La palabra debe empezar con "${gameState.lastLetter.toUpperCase()}"`);
      return;
    }

    if (gameState.words.includes(word)) {
      setError("Ya usaste esta palabra");
      return;
    }

    if (!isValidSpanishWord(word)) {
      setError("Palabra no válida en español");
      return;
    }

    // Word is valid!
    const newChainLength = gameState.chainLength + 1;
    const wordScore = calculateWordScore(word, newChainLength);
    
    setGameState((prev) => ({
      ...prev,
      currentWord: word,
      lastLetter: word.slice(-1).toLowerCase(),
      words: [...prev.words, word],
      score: prev.score + wordScore,
      chainLength: newChainLength,
      longestChain: Math.max(prev.longestChain, newChainLength),
    }));

    setInputValue("");
    setError(null);
  }, [gameState, inputValue, isSubmitting]);

  // End the game
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

  // Reset game to idle
  const resetGame = useCallback(() => {
    setGameState({
      status: "idle",
      currentWord: "",
      lastLetter: "",
      words: [],
      score: 0,
      timeRemaining: GAME_DURATION,
      chainLength: 0,
      longestChain: 0,
      sessionToken: null,
    });
    setInputValue("");
    setError(null);
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.status === "playing") {
      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          if (prev.timeRemaining <= 1) {
            return { ...prev, status: "finished", timeRemaining: 0 };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
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

  // Check if game ended due to timer
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
