"use client";

import React from "react"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatScore } from "@/lib/game/scoring";
import type { GameState } from "@/lib/game/types";

interface GameOverProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onSubmitScore: (playerName: string) => Promise<void>;
}

export function GameOver({ gameState, onPlayAgain, onSubmitScore }: GameOverProps) {
  const [playerName, setPlayerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmitScore(playerName.trim());
      setSubmitted(true);
    } catch (err) {
      setError("Error al guardar puntuación. Intenta de nuevo.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto text-center">
      <div>
        <h2 className="text-3xl font-bold mb-2">Fin del Juego</h2>
        <p className="text-muted-foreground">Has formado una cadena de palabras</p>
      </div>

      <div className="grid grid-cols-3 gap-6 w-full">
        <div className="bg-card rounded-xl p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Puntuación</div>
          <div className="text-2xl font-bold font-mono">{formatScore(gameState.score)}</div>
        </div>
        <div className="bg-card rounded-xl p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Palabras</div>
          <div className="text-2xl font-bold font-mono">{gameState.words.length}</div>
        </div>
        <div className="bg-card rounded-xl p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Mejor Cadena</div>
          <div className="text-2xl font-bold font-mono">{gameState.longestChain}</div>
        </div>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label htmlFor="playerName" className="text-sm text-muted-foreground block mb-2">
              Guarda tu puntuación en la tabla
            </label>
            <Input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Tu nombre..."
              maxLength={20}
              className="text-center"
              disabled={isSubmitting}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onPlayAgain}
              className="flex-1 bg-transparent"
              disabled={isSubmitting}
            >
              Jugar de nuevo
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!playerName.trim() || isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="w-full space-y-4">
          <p className="text-success font-medium">Puntuación guardada correctamente</p>
          <Button onClick={onPlayAgain} className="w-full">
            Jugar de nuevo
          </Button>
        </div>
      )}
    </div>
  );
}
