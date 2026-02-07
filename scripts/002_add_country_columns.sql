-- Add country columns to leaderboard table
alter table public.leaderboard
add column if not exists country_code text,
add column if not exists country_name text,
add column if not exists country_flag text;

-- Create indexes for country columns if they don't exist
create index if not exists idx_leaderboard_country_code on public.leaderboard(country_code);
