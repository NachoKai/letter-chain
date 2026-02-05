import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SPANISH_WORDS } from "./dictionary/spanish";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidWord(word: string): boolean {
  return SPANISH_WORDS.has(word.toLowerCase().trim());
}

export function getWordsStartingWith(letter: string): string[] {
  const normalizedLetter = letter.toLowerCase();
  return Array.from(SPANISH_WORDS).filter((word) =>
    word.startsWith(normalizedLetter)
  );
}

export function getRandomStartingWord(): string {
  const words = Array.from(SPANISH_WORDS).filter(
    (w) => w.length >= 4 && w.length <= 8
  );
  return words[Math.floor(Math.random() * words.length)];
}
