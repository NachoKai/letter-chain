"use client";

import { lazy, Suspense } from "react";
import { useGame } from "@/hooks/use-game";
import { usePrefetchLeaderboard } from "@/hooks/use-game-queries";
import { Button } from "@/components/ui/button";
import { HomeProvider } from "@/components/ui/home-provider";
import { Timer } from "./timer";
import { ScoreDisplay } from "./score-display";
import { WordDisplay } from "./word-display";
import { WordInput } from "./word-input";
import { WordHistory } from "./word-history";
import { GameOver } from "./game-over";

const Leaderboard = lazy(() =>
  import("./leaderboard").then((m) => ({ default: m.Leaderboard }))
);

function LeaderboardSkeleton({ limit = 10 }: { limit?: number }) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Tabla de Líderes
      </h3>
      <div className="space-y-2">
        {Array.from({ length: limit }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg bg-card border"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
              <div className="w-3 h-3 bg-muted-foreground/30 rounded animate-pulse" />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-[1.2em] h-[1.2em] bg-muted/60 rounded-sm animate-pulse" />
                <div className="h-4 bg-muted/60 rounded animate-pulse w-28" />
              </div>
              <div className="h-3 bg-muted/40 rounded animate-pulse w-36" />
            </div>
            <div className="h-6 w-16 bg-muted/60 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

const INSTRUCTIONS = (
  <div className="bg-card border rounded-xl p-6 space-y-4 w-full max-w-sm">
    <h3 className="font-semibold text-center">Cómo jugar</h3>
    <ul className="space-y-2 text-sm text-muted-foreground">
      <li className="flex items-start gap-2">
        <span className="text-primary font-bold">1.</span>
        <span>Se te dará una palabra inicial</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-primary font-bold">2.</span>
        <span>Escribe una palabra que empieza con las últimas dos letras</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-primary font-bold">3.</span>
        <span>Tienes 60 segundos para formar la cadena más larga</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-primary font-bold">4.</span>
        <span>
          Palabras largas, cadenas largas y responder rápido (combos) dan más
          puntos
        </span>
      </li>
    </ul>
  </div>
);

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

  const prefetchLeaderboard = usePrefetchLeaderboard();
  const showHomeButton = gameState.status === "playing";

  if (gameState.status === "idle") {
    return (
      <HomeProvider showHomeButton={showHomeButton} onHomeClick={resetGame}>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center w-full max-w-5xl mx-auto px-4">
          <div className="flex flex-col items-center gap-8 flex-1">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                LetterChain 🔗
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Forma una cadena de palabras en español. Cada palabra debe
                empezar con las últimas dos letras de la anterior.
              </p>
            </div>

            {INSTRUCTIONS}

            <Button
              onClick={startGame}
              size="lg"
              className="text-lg px-8 h-14 min-h-[56px] touch-manipulation"
            >
              Comenzar Juego
            </Button>
          </div>

          <div
            className="w-full lg:w-80"
            onMouseEnter={() => prefetchLeaderboard(10)}
          >
            <Suspense fallback={<LeaderboardSkeleton />}>
              <Leaderboard />
            </Suspense>
          </div>
        </div>
      </HomeProvider>
    );
  }

  // Game over state
  if (gameState.status === "finished") {
    return (
      <HomeProvider showHomeButton={showHomeButton} onHomeClick={resetGame}>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center w-full max-w-5xl mx-auto px-4">
          <div className="flex-1">
            <GameOver gameState={gameState} onPlayAgain={resetGame} />
          </div>
          <div
            className="w-full lg:w-80"
            onMouseEnter={() => prefetchLeaderboard(10)}
          >
            <Suspense fallback={<LeaderboardSkeleton />}>
              <Leaderboard />
            </Suspense>
          </div>
        </div>
      </HomeProvider>
    );
  }

  // Playing state
  return (
    <HomeProvider showHomeButton={showHomeButton} onHomeClick={resetGame}>
      <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4">
        <Timer timeRemaining={gameState.timeRemaining} />

        <ScoreDisplay
          score={gameState.score}
          wordsCount={gameState.words.length}
          chainLength={gameState.chainLength}
          combo={gameState.combo}
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
          requiredLetter={gameState.lastTwoLetters}
          error={error}
        />

        <WordHistory words={gameState.words} />
      </div>
    </HomeProvider>
  );
}
