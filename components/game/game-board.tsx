"use client";

import { useCallback } from "react";
import { useGame } from "@/hooks/use-game";
import { Button } from "@/components/ui/button";
import { Timer } from "./timer";
import { ScoreDisplay } from "./score-display";
import { WordDisplay } from "./word-display";
import { WordInput } from "./word-input";
import { WordHistory } from "./word-history";
import { GameOver } from "./game-over";
import { Leaderboard } from "./leaderboard";

export function GameBoard() {
  const {
    gameState,
    inputValue,
    setInputValue,
    error,
    startGame,
    submitWord,
    resetGame,
  } = useGame();

  const handleSubmitScore = useCallback(
    async (playerName: string) => {
      const response = await fetch("/api/game/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName,
          score: gameState.score,
          wordsCount: gameState.words.length,
          longestChain: gameState.longestChain,
          sessionToken: gameState.sessionToken,
          words: gameState.words,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit score");
      }
    },
    [gameState]
  );

  if (gameState.status === "idle") {
    return (
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center w-full max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center gap-8 flex-1">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              LetterChain
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Forma una cadena de palabras en español. Cada palabra debe empezar
              con la última letra de la anterior.
            </p>
          </div>

          <div className="bg-card border rounded-xl p-6 space-y-4 w-full max-w-sm">
            <h3 className="font-semibold text-center">Cómo jugar</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Se te dará una palabra inicial</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Escribe una palabra que empiece con la última letra</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Tienes 60 segundos para formar la cadena más larga</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                <span>
                  Palabras más largas y cadenas más largas dan más puntos
                </span>
              </li>
            </ul>
          </div>

          <Button onClick={startGame} size="lg" className="text-lg px-8">
            Comenzar Juego
          </Button>
        </div>

        <div className="w-full lg:w-80">
          <Leaderboard />
        </div>
      </div>
    );
  }

  // Game over state
  if (gameState.status === "finished") {
    return (
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center w-full max-w-5xl mx-auto px-4">
        <div className="flex-1">
          <GameOver
            gameState={gameState}
            onPlayAgain={resetGame}
            onSubmitScore={handleSubmitScore}
          />
        </div>
        <div className="w-full lg:w-80">
          <Leaderboard />
        </div>
      </div>
    );
  }

  // Playing state
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4">
      <Timer timeRemaining={gameState.timeRemaining} />

      <ScoreDisplay
        score={gameState.score}
        wordsCount={gameState.words.length}
        chainLength={gameState.chainLength}
      />

      <div className="py-4 w-full">
        <div className="text-sm text-muted-foreground text-center mb-2">
          Palabra actual
        </div>
        <WordDisplay
          word={gameState.currentWord}
          highlightLast
          className="max-w-full overflow-x-auto"
        />
      </div>

      <WordInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={submitWord}
        requiredLetter={gameState.lastLetter}
        error={error}
      />

      <WordHistory words={gameState.words} />
    </div>
  );
}
