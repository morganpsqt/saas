-- V2 migrations — à exécuter après schema.sql et subscriptions.sql
-- Idempotent : peut être rejoué sans casser l'existant.

-- 1. Notes privées sur les devis (fonctionnalité PRO)
alter table public.devis add column if not exists notes text;

-- 2. Templates d'email personnalisés (fonctionnalité PRO, schéma prêt pour usage futur)
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
    select 1 from pg_policies where tablename = 'email_templates' and policyname = 'Users manage own templates'
  ) then
    execute 'create policy "Users manage own templates" on public.email_templates for all using (auth.uid() = user_id) with check (auth.uid() = user_id)';
  end if;
end$$;
