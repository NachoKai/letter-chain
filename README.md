# LetterChain

LetterChain is a fast-paced word-chain game. Each new word must start with the last two letters of the previous word.

## How to Play

1. Start a game and receive an initial word.
2. Enter a new word that starts with the previous word's last two letters.
3. Continue the chain for 60 seconds.
4. Submit your score to the leaderboard.

## Scoring

Per submitted word during gameplay:

- Base points: `10`
- Length bonus: `+2` per character over 3
- Chain bonus: `+5 * currentChainLength`
- Speed combo multiplier (based on submit speed):
  - `<1s: x3`, `<2s: x2`, `<3s: x1.5`, `<4s: x1.25`, `<5s: x1.1`

Current implementation detail:

- The initial starting word is currently scored as a flat `10` points.
- `calculateTimeBonus()` exists in code but is not currently applied to the game score.
- Server-side score validation does not fully account for combo multipliers (see `docs/game-logic.md`).

## Game Logic Documentation

Detailed logic, validation flow, anti-cheat checks, and data model are documented in:

- `docs/game-logic.md`

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS + shadcn/ui + Radix UI
- Supabase (PostgreSQL)
- TanStack React Query (leaderboard fetch + score submission)

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Create local environment file:

```bash
cp .env.local.example .env.local
```

3. Fill in Supabase credentials in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Start development server:

```bash
pnpm dev
```

5. Open `http://localhost:3000`

## Database

Run SQL scripts in `scripts/` against your Supabase project:

1. `scripts/001_create_letterchain_tables.sql`
2. `scripts/002_add_country_columns.sql`
3. `scripts/004_enhance_security_policies.sql`
4. `scripts/005_add_ip_tracking.sql`

Optional/legacy helper:

- `scripts/fix_game_sessions_rls.sql`

## Available Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
- `pnpm lint:fix`
- `pnpm format`
- `pnpm format:check`

## Project Structure

```text
app/
  api/
    game/
      start/route.ts
      submit/route.ts
    leaderboard/route.ts
components/
  game/
hooks/
lib/
  game/
  dictionary/
  supabase/
scripts/
docs/
  game-logic.md
```
