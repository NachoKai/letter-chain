-- LetterChain Game Database Schema

-- Leaderboard table for storing high scores
create table if not exists public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  score integer not null default 0,
  words_count integer not null default 0,
  longest_chain integer not null default 0,
  game_duration_seconds integer not null default 60,
  language text not null default 'es',
  created_at timestamptz not null default now()
);

create index if not exists idx_leaderboard_score on public.leaderboard(score desc);
create index if not exists idx_leaderboard_language on public.leaderboard(language);

alter table public.leaderboard enable row level security;

create policy "leaderboard_select_all" on public.leaderboard for select using (true);
create policy "leaderboard_insert_all" on public.leaderboard for insert with check (true);

-- Game sessions table for anti-cheat validation
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  session_token text not null unique,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  words_played text[] default array[]::text[],
  is_validated boolean default false,
  final_score integer,
  language text not null default 'es'
);

create index if not exists idx_game_sessions_token on public.game_sessions(session_token);

alter table public.game_sessions enable row level security;

create policy "game_sessions_insert_all" on public.game_sessions for insert with check (true);
create policy "game_sessions_select_all" on public.game_sessions for select using (true);
create policy "game_sessions_update_all" on public.game_sessions for update using (true);
