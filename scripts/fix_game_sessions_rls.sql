-- Fix game_sessions RLS policy to enforce proper ownership

-- Drop the overly permissive policy
drop policy if exists "game_sessions_insert_all" on public.game_sessions;

-- Create a secure policy that only allows users to insert their own sessions
create policy "game_sessions_insert_owner" on public.game_sessions 
  for insert to authenticated 
  with check (
    -- Ensure the user can only insert sessions they own
    exists (
      select 1 from auth.users 
      where id = auth.uid() 
      and auth.role() = 'authenticated'
    )
  );

-- Keep select policy as-is (intended public read access)
-- Keep update policy as-is (may need separate review)