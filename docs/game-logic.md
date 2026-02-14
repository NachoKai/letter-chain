# LetterChain Game Logic

This document explains how gameplay works end-to-end in the current codebase.

## High-level flow

1. User clicks `Comenzar Juego`.
2. Client generates a session token and picks a random starting word from the Spanish dictionary.
3. Client attempts to create a backend session via `POST /api/game/start`.
4. Game runs locally for 60 seconds with client-side validation and scoring.
5. When time reaches 0, game moves to finished state.
6. User can submit score from the game-over screen via `POST /api/game/submit`.
7. Backend validates payload, chain integrity, and score reasonableness, then writes leaderboard entry.
8. Leaderboard is fetched from `GET /api/leaderboard`.

## Core state machine (client)

`hooks/use-game.ts` drives gameplay with three states:

- `idle`: pre-game screen and leaderboard preview.
- `playing`: active timer, input, chain growth, score updates.
- `finished`: post-game stats + score submission form.

`GameState` tracks:

- `currentWord`, `lastTwoLetters`, `words`
- `score`
- `timeRemaining` (starts at `60`)
- `chainLength`, `longestChain`
- `sessionToken`
- `wordStartTime` (timestamp when current turn started)
- `combo` (last applied speed multiplier, if any)

## Start of game

When `startGame()` runs:

- Generates a 64-char hex token from 32 random bytes (crypto API when available).
- Picks a random starting word from dictionary words with length `4..8`.
- Calls `/api/game/start` with `{ sessionToken, language: "es" }`.
- Initializes local game state:
  - `words = [startingWord]`
  - `lastTwoLetters = startingWord.slice(-2).toLowerCase()`
  - `score = 10`
  - `chainLength = 1`, `longestChain = 1`
  - `timeRemaining = 60`

Note: local game still starts even if `/api/game/start` fails (error is logged).

## Word submission rules

Each input is normalized to lowercase + trim and checked in this order:

1. Not empty.
2. Length >= 2.
3. Starts with previous word's last two letters.
4. Not used before in this session.
5. Exists in `SPANISH_WORDS` dictionary.

If valid:

- `currentWord` becomes submitted word.
- `lastTwoLetters` updates to new word suffix.
- Word is appended to `words`.
- `chainLength` increments by 1.
- `longestChain` updates as max.
- Score increases by computed word score, optionally multiplied by a speed combo.

## Scoring

Implemented in `lib/game/scoring.ts`:

- Base: `10` points per submitted valid word
- Length bonus: `+2 * max(0, word.length - 3)`
- Chain bonus: `+5 * chainLength` (chain length after adding the word)

Formula used during play:

`wordScore = 10 + 2 * max(0, len - 3) + 5 * chainLength`

Speed combo in `use-game.ts`:

- `< 1000ms`: `x3`
- `< 2000ms`: `x2`
- `< 3000ms`: `x1.5`
- `< 4000ms`: `x1.25`
- `< 5000ms`: `x1.1`
- `>= 5000ms`: no multiplier

Final word score during play:

`finalWordScore = wordScore * comboMultiplier` (if combo applies)

Important implementation detail:

- Starting word is hard-set to `10` points in `startGame()`.
- It does not apply length/chain bonus client-side.

## Timer and game end

- Timer decrements every second while status is `playing`.
- At `timeRemaining <= 1`, state is set to `finished` and `timeRemaining` to `0`.
- `endGame()` also clears the interval defensively.

## Submit score flow

`components/game/game-over.tsx` builds payload:

- `playerName` (required), optional country fields
- `score`, `wordsCount`, `longestChain`
- `sessionToken`
- full `words` array

Then posts to `/api/game/submit`.

On success:

- Score form transitions to success state.
- React Query invalidates leaderboard cache.

## Server-side validation and anti-cheat

`app/api/game/submit/route.ts` enforces:

1. Schema validation (`lib/request-validation.ts`):

- type/length/range/pattern checks
- basic suspicious payload pattern detection

2. IP validation (`lib/ip-tracking.ts`):

- tracks high-frequency suspicious activity in memory

3. Rate limit (`lib/rate-limit.ts`):

- submit endpoint: max 5 requests/minute per IP

4. Business checks:

- required fields present
- `playerName` max 20 chars
- `words.length === wordsCount`
- chain integrity for all words:
  - each word must be dictionary-valid
  - each word must start with prior word's last 2 letters
  - no duplicates

5. Score validation:

- recomputes expected score from words
- allows tolerance of `50` points
- rejects extreme scores (`> 10000`)

6. Session handling:

- loads session by token (if found)
- rejects reuse when `is_validated = true`
- updates session with `ended_at`, `words_played`, `final_score`, `is_validated`
- if session missing, submission is still allowed (warning logged)

7. Writes leaderboard row.

## Game session start endpoint

`POST /api/game/start`:

- Validates request shape and token format.
- Applies IP validation and rate limiting (10 starts/minute/IP).
- Logs IP activity.
- Inserts row into `game_sessions` (`session_token`, `language`, `started_at`).

## Leaderboard endpoint

`GET /api/leaderboard`:

- Query params:
  - `limit` (default 10, max 100)
  - `language` (default `es`)
- Returns entries ordered by `score DESC`.

## Data model used by game logic

Main tables (see `scripts/*.sql`):

- `game_sessions`
  - anti-cheat session token lifecycle
  - words played + final score snapshot
- `leaderboard`
  - public ranking rows (name, score, words, chain, language, country)
- `suspicious_activity`
  - logs suspicious requests/score attempts
- `ip_activity_log`
  - action-level IP telemetry

## Notable implementation notes

- `calculateTimeBonus()` exists but is not currently applied to client gameplay score.
- Client uses speed combo multipliers, but submit API expected-score logic does not include combo multipliers.
- Server score recomputation includes all words, while client treats starting word as flat `10`.
- Submit validation allows `50` points tolerance; large combo-heavy games may exceed tolerance and fail submission.
