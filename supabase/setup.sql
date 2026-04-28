-- Supabase setup for SDE Prep Engine cloud persistence
--
-- 1) In Supabase Dashboard:
--    - Auth → Providers → Enable Email (magic link) and/or an OAuth provider (e.g., GitHub)
--    - Auth → URL Configuration → Add your app URL to "Site URL" / "Redirect URLs" (dev: http://localhost:3000)
--
-- 2) Run this SQL in the SQL Editor.

create table if not exists public.prep_engine_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.prep_engine_state enable row level security;

-- Read your own row
create policy if not exists "prep_engine_state_select_own"
on public.prep_engine_state
for select
using (auth.uid() = user_id);

-- Insert your own row
create policy if not exists "prep_engine_state_insert_own"
on public.prep_engine_state
for insert
with check (auth.uid() = user_id);

-- Update your own row
create policy if not exists "prep_engine_state_update_own"
on public.prep_engine_state
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
