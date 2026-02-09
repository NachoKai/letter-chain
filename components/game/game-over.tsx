"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CountrySelector,
  type Country,
} from "@/components/ui/country-selector";
import { formatScore } from "@/lib/game/scoring";
import type { GameState } from "@/lib/game/types";

interface GameOverProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onSubmitScore: (playerName: string, country?: Country) => Promise<void>;
}

export function GameOver({
  gameState,
  onPlayAgain,
  onSubmitScore,
}: GameOverProps) {
  const [playerName, setPlayerName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const buildLetterChain = (words: string[]) => {
    if (words.length === 0) return "";
    if (words.length === 1) return words[0];

    let chain = words[0];
    for (let i = 1; i < words.length; i++) {
      const currWord = words[i];
      chain += currWord.substring(1);
    }
    return chain;
  };

  const letterChain = buildLetterChain(gameState.words);
  const chainLength = letterChain.length;

  const handleShare = async () => {
    const link = "https://letter-chain-v2.vercel.app/";
    const shareText = `¡He formado una cadena de ${chainLength} letras en Letter Chain! 🎮\n${letterChain}\n\n¿Puedes superarlo?\n\nJuega en ${link}`;

    if (typeof window !== "undefined" && window.navigator?.share) {
      try {
        await window.navigator.share({
          title: "Letter Chain",
          text: shareText,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else if (typeof window !== "undefined" && window.navigator?.clipboard) {
      try {
        await window.navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  const handleTwitterShare = () => {
    const tweetText = `¡He formado una cadena de ${chainLength} letras en Letter Chain! 🎮\n${letterChain}\n\n¿Puedes superarlo?\n\nJuega en https://letter-chain-v2.vercel.app/`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    if (typeof window !== "undefined") {
      window.open(twitterUrl, "_blank", "width=550,height=420");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmitScore(playerName.trim(), selectedCountry);
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
        <p className="text-muted-foreground">
          Has formado una cadena de palabras
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 w-full">
        <div className="bg-card rounded-xl p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Puntuación</div>
          <div className="text-2xl font-bold font-mono">
            {formatScore(gameState.score)}
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Palabras</div>
          <div className="text-2xl font-bold font-mono">
            {gameState.words.length}
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Mejor Cadena</div>
          <div className="text-2xl font-bold font-mono">
            {gameState.longestChain}
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="bg-card rounded-xl p-4 border">
          <div className="text-sm text-muted-foreground mb-2">
            Cadena Completa
          </div>
          <div className="text-lg font-mono break-all text-center leading-relaxed">
            {letterChain}
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            {chainLength} letras
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleShare} variant="outline" className="flex-1">
            {copied ? "¡Copiado!" : "Compartir"}
          </Button>
          <Button
            onClick={handleTwitterShare}
            variant="outline"
            className="flex-1"
          >
            Compartir en X
          </Button>
        </div>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label
              htmlFor="playerName"
              className="text-sm text-muted-foreground block mb-2"
            >
              Guarda tu puntuación en la tabla
            </label>
            <Input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Tu nombre..."
              maxLength={20}
              className="text-center mb-3"
              disabled={isSubmitting}
            />
            <CountrySelector
              value={selectedCountry?.code}
              onValueChange={setSelectedCountry}
              placeholder="Selecciona tu país (opcional)"
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
          <p className="text-success font-medium">
            Puntuación guardada correctamente
          </p>
          <Button onClick={onPlayAgain} className="w-full">
            Jugar de nuevo
          </Button>
        </div>
      )}
    </div>
  );
}
