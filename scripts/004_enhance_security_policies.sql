-- Enhanced RLS policies for better security
-- Replace overly permissive policies with more restrictive ones

-- Drop existing permissive policies
DROP POLICY IF EXISTS "leaderboard_insert_all" ON public.leaderboard;
DROP POLICY IF EXISTS "game_sessions_insert_all" ON public.game_sessions;
DROP POLICY IF EXISTS "game_sessions_select_all" ON public.game_sessions;
DROP POLICY IF EXISTS "game_sessions_update_all" ON public.game_sessions;

-- Create suspicious_activity table for tracking
CREATE TABLE IF NOT EXISTS public.suspicious_activity (
  id uuid primary key default gen_random_uuid(),
  ip_address text,
  user_agent text,
  reason text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_suspicious_activity_ip ON public.suspicious_activity(ip_address);
CREATE INDEX IF NOT EXISTS idx_suspicious_activity_created_at ON public.suspicious_activity(created_at desc);

-- Enable RLS on suspicious_activity table
ALTER TABLE public.suspicious_activity ENABLE ROW LEVEL SECURITY;

-- Restrictive policies for leaderboard
CREATE POLICY "leaderboard_read_all" ON public.leaderboard
  FOR SELECT USING (true);

CREATE POLICY "leaderboard_insert_rate_limited" ON public.leaderboard
  FOR INSERT WITH CHECK (
    score >= 0 AND
    score <= 10000 AND
    length(player_name) <= 20 AND
    length(coalesce(player_name, '')) > 0 AND
    game_duration_seconds = 60 AND
    language IN ('es', 'en')
  );

-- More restrictive policies for game_sessions
CREATE POLICY "game_sessions_insert_controlled" ON public.game_sessions
  FOR INSERT WITH CHECK (
    length(session_token) >= 32 AND
    language IN ('es', 'en') AND
    started_at >= NOW() - INTERVAL '1 hour'
  );

CREATE POLICY "game_sessions_update_own" ON public.game_sessions
  FOR UPDATE USING (
    is_validated = false AND
    started_at >= NOW() - INTERVAL '3 minutes'
  );

CREATE POLICY "game_sessions_read_limited" ON public.game_sessions
  FOR SELECT USING (
    started_at >= NOW() - INTERVAL '24 hours'
  );

-- Policies for suspicious_activity (admin only for now)
CREATE POLICY "suspicious_activity_read_admin" ON public.suspicious_activity
  FOR SELECT USING (false); -- No public access

CREATE POLICY "suspicious_activity_insert_service" ON public.suspicious_activity
  FOR INSERT WITH CHECK (
    length(coalesce(reason, '')) > 0 AND
    created_at >= NOW() - INTERVAL '1 hour'
  );

-- Add constraints to prevent invalid data
DO $$
BEGIN
  -- Leaderboard table constraints
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.contype = 'c' AND c.conname = 'check_score_range'
      AND t.relname = 'leaderboard' AND n.nspname = 'public'
  ) THEN
    ALTER TABLE public.leaderboard
      ADD CONSTRAINT check_score_range CHECK (score >= 0 AND score <= 10000);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.contype = 'c' AND c.conname = 'check_player_name_length'
      AND t.relname = 'leaderboard' AND n.nspname = 'public'
  ) THEN
    ALTER TABLE public.leaderboard
      ADD CONSTRAINT check_player_name_length CHECK (length(player_name) >= 1 AND length(player_name) <= 20);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.contype = 'c' AND c.conname = 'check_words_count'
      AND t.relname = 'leaderboard' AND n.nspname = 'public'
  ) THEN
    ALTER TABLE public.leaderboard
      ADD CONSTRAINT check_words_count CHECK (words_count >= 0 AND words_count <= 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.contype = 'c' AND c.conname = 'check_longest_chain'
      AND t.relname = 'leaderboard' AND n.nspname = 'public'
  ) THEN
    -- Fix existing data where longest_chain > words_count
    UPDATE public.leaderboard
    SET longest_chain = words_count
    WHERE longest_chain > words_count;

    ALTER TABLE public.leaderboard
      ADD CONSTRAINT check_longest_chain CHECK (longest_chain >= 0 AND longest_chain <= words_count);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.contype = 'c' AND c.conname = 'check_game_duration'
      AND t.relname = 'leaderboard' AND n.nspname = 'public'
  ) THEN
    ALTER TABLE public.leaderboard
      ADD CONSTRAINT check_game_duration CHECK (game_duration_seconds = 60);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.contype = 'c' AND c.conname = 'check_language'
      AND t.relname = 'leaderboard' AND n.nspname = 'public'
  ) THEN
    -- Fix existing data with invalid language values (default to 'es')
    UPDATE public.leaderboard
    SET language = 'es'
    WHERE language NOT IN ('es', 'en');

    ALTER TABLE public.leaderboard
      ADD CONSTRAINT check_language CHECK (language IN ('es', 'en'));
  END IF;

  -- Game sessions table constraints
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.contype = 'c' AND c.conname = 'check_session_token_length'
      AND t.relname = 'game_sessions' AND n.nspname = 'public'
  ) THEN
    -- Delete old sessions with short tokens (they're no longer valid anyway)
    DELETE FROM public.game_sessions
    WHERE length(session_token) < 32;

    ALTER TABLE public.game_sessions
      ADD CONSTRAINT check_session_token_length CHECK (length(session_token) >= 32);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.contype = 'c' AND c.conname = 'check_language_valid'
      AND t.relname = 'game_sessions' AND n.nspname = 'public'
  ) THEN
    ALTER TABLE public.game_sessions
      ADD CONSTRAINT check_language_valid CHECK (language IN ('es', 'en'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE c.contype = 'c' AND c.conname = 'check_time_logic'
      AND t.relname = 'game_sessions' AND n.nspname = 'public'
  ) THEN
    ALTER TABLE public.game_sessions
      ADD CONSTRAINT check_time_logic CHECK (ended_at IS NULL OR ended_at >= started_at);
  END IF;
END$$;
