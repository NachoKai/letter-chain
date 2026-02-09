-- IP activity logging table
CREATE TABLE IF NOT EXISTS public.ip_activity_log (
  id uuid primary key default gen_random_uuid(),
  ip_address text,
  action text not null,
  user_agent text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_ip_activity_ip ON public.ip_activity_log(ip_address);
CREATE INDEX IF NOT EXISTS idx_ip_activity_created_at ON public.ip_activity_log(created_at desc);
CREATE INDEX IF NOT EXISTS idx_ip_activity_action ON public.ip_activity_log(action);

-- Enable RLS
ALTER TABLE public.ip_activity_log ENABLE ROW LEVEL SECURITY;

-- No public access to IP logs (admin only)
CREATE POLICY "ip_activity_read_none" ON public.ip_activity_log 
  FOR SELECT USING (false);

CREATE POLICY "ip_activity_insert_service" ON public.ip_activity_log 
  FOR INSERT WITH CHECK (
    length(coalesce(action, '')) > 0 AND
    created_at >= NOW() - INTERVAL '7 days'
  );