import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidSpanishWord } from "@/lib/dictionary/spanish";

const GAME_DURATION = 60;
const MAX_REASONABLE_SCORE = 10000; // Reasonable max for 60 seconds

interface SubmitPayload {
  playerName: string;
  score: number;
  wordsCount: number;
  longestChain: number;
  sessionToken: string;
  words: string[];
}

// Validate the word chain
function validateWordChain(words: string[]): boolean {
  if (words.length < 1) return false;

  for (let i = 0; i < words.length; i++) {
    const word = words[i].toLowerCase();
    
    // Check if word is valid Spanish
    if (!isValidSpanishWord(word)) {
      return false;
    }

    // Check chain rule (except for first word)
    if (i > 0) {
      const previousWord = words[i - 1].toLowerCase();
      const lastLetter = previousWord.slice(-1);
      if (!word.startsWith(lastLetter)) {
        return false;
      }
    }
  }

  // Check for duplicates
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  if (uniqueWords.size !== words.length) {
    return false;
  }

  return true;
}

// Calculate expected score from words
function calculateExpectedScore(words: string[]): number {
  let score = 0;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const basePoints = 10;
    const lengthBonus = Math.max(0, word.length - 3) * 2;
    const chainBonus = (i + 1) * 5;
    score += basePoints + lengthBonus + chainBonus;
  }
  return score;
}

export async function POST(request: Request) {
  try {
    const payload: SubmitPayload = await request.json();
    const { playerName, score, wordsCount, longestChain, sessionToken, words } = payload;

    // Basic validation
    if (!playerName || !sessionToken || !words || !Array.isArray(words)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (playerName.length > 20) {
      return NextResponse.json(
        { error: "Player name too long" },
        { status: 400 }
      );
    }

    // Validate word count matches
    if (words.length !== wordsCount) {
      return NextResponse.json(
        { error: "Word count mismatch" },
        { status: 400 }
      );
    }

    // Validate the word chain
    if (!validateWordChain(words)) {
      return NextResponse.json(
        { error: "Invalid word chain" },
        { status: 400 }
      );
    }

    // Validate score is reasonable
    const expectedScore = calculateExpectedScore(words);
    const scoreTolerance = 50; // Allow small tolerance for timing bonuses
    if (Math.abs(score - expectedScore) > scoreTolerance) {
      return NextResponse.json(
        { error: "Score validation failed" },
        { status: 400 }
      );
    }

    if (score > MAX_REASONABLE_SCORE) {
      return NextResponse.json(
        { error: "Score too high" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify and update game session
    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("session_token", sessionToken)
      .single();

    if (sessionError || !session) {
      // Session might not exist if there was a network error on start
      // Allow submission anyway but log it
      console.warn("Session not found:", sessionToken);
    } else {
      // Check if session was already used
      if (session.is_validated) {
        return NextResponse.json(
          { error: "Session already used" },
          { status: 400 }
        );
      }

      // Check time validity (allow some buffer for network latency)
      const startedAt = new Date(session.started_at).getTime();
      const now = Date.now();
      const maxDuration = (GAME_DURATION + 10) * 1000; // 10 second buffer
      
      if (now - startedAt > maxDuration) {
        return NextResponse.json(
          { error: "Session expired" },
          { status: 400 }
        );
      }

      // Mark session as validated
      await supabase
        .from("game_sessions")
        .update({
          ended_at: new Date().toISOString(),
          words_played: words,
          is_validated: true,
          final_score: score,
        })
        .eq("session_token", sessionToken);
    }

    // Insert leaderboard entry
    const { error: leaderboardError } = await supabase
      .from("leaderboard")
      .insert({
        player_name: playerName.trim().substring(0, 20),
        score,
        words_count: wordsCount,
        longest_chain: longestChain,
        game_duration_seconds: GAME_DURATION,
        language: "es",
      });

    if (leaderboardError) {
      console.error("Error inserting leaderboard entry:", leaderboardError);
      return NextResponse.json(
        { error: "Failed to save score" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Game submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
