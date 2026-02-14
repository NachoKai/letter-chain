export interface GameState {
  status: "idle" | "playing" | "finished";
  currentWord: string;
  lastTwoLetters: string;
  words: string[];
  score: number;
  timeRemaining: number;
  chainLength: number;
  longestChain: number;
  sessionToken: string | null;
  wordStartTime: number;
  combo: {
    multiplier: number;
    label: string;
  } | null;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  country_code?: string;
  country_name?: string;
  country_flag?: string;
  score: number;
  words_count: number;
  longest_chain: number;
  game_duration_seconds: number;
  language: string;
  created_at: string;
}

export interface GameSession {
  id: string;
  session_token: string;
  started_at: string;
  ended_at: string | null;
  words_played: string[];
  is_validated: boolean;
  final_score: number | null;
  language: string;
}

export interface SubmitScorePayload {
  playerName: string;
  countryCode?: string;
  countryName?: string;
  countryFlag?: string;
  score: number;
  wordsCount: number;
  longestChain: number;
  sessionToken: string;
  words: string[];
}
