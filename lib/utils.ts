import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SPANISH_WORDS } from "./dictionary/spanish";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WORDS_ARRAY = Array.from(SPANISH_WORDS);

const STARTING_WORDS = WORDS_ARRAY.filter(
  (w) => w.length >= 4 && w.length <= 8
);

const WORDS_BY_FIRST_LETTER: Record<string, string[]> = {};

for (const word of WORDS_ARRAY) {
  const letter = word[0];
  (WORDS_BY_FIRST_LETTER[letter] ??= []).push(word);
}

export function isValidWord(word: string): boolean {
  return SPANISH_WORDS.has(word);
}

export function getRandomStartingWord(): string {
  return STARTING_WORDS[Math.floor(Math.random() * STARTING_WORDS.length)];
}
