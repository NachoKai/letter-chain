// Scoring rules for LetterChain
// Base points per word: 10
// Length bonus: +2 per character over 3
// Chain bonus: +5 per consecutive word in chain
// Speed bonus: +1 per second remaining when word is submitted quickly

export function calculateWordScore(word: string, chainLength: number): number {
  const basePoints = 10;
  const lengthBonus = Math.max(0, word.length - 3) * 2;
  const chainBonus = chainLength * 5;

  return basePoints + lengthBonus + chainBonus;
}

export function calculateTimeBonus(
  timeRemaining: number,
  totalTime: number
): number {
  // Give bonus points if they're in the first half of the game (playing quickly)
  const halfTime = totalTime / 2;
  if (timeRemaining > halfTime) {
    return Math.floor((timeRemaining - halfTime) / 10);
  }
  return 0;
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
