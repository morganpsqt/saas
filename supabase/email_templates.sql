-- Email templates custom (fonctionnalité PRO)
-- Déjà présent dans supabase/v2_migrations.sql mais réimprimé ici pour s'assurer
-- que l'installation est idempotente.

create table if not exists public.email_templates (
  user_id uuid primary key references auth.users(id) on delete cascade,
  subject_j3 text,
  body_j3 text,
  subject_j7 text,
  body_j7 text,
  subject_j10 text,
  body_j10 text,
  artisan_name text,
  artisan_signature text,
  updated_at timestamptz not null default now()
);

alter table public.email_templates enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'email_templates' and policyname = 'Users manage own templates'
  ) then
    execute 'create policy "Users manage own templates" on public.email_templates for all using (auth.uid() = user_id) with check (auth.uid() = user_id)';
  end if;
end$$;
