-- V4 — Profils utilisateur (nom affiché, entreprise, avatar…)
-- Idempotent.

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  company_name text,
  phone text,
  contact_email text,
  avatar_url text,
  has_seen_onboarding boolean not null default false,
  welcome_email_sent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'profiles' and policyname = 'Users manage own profile'
  ) then
    execute 'create policy "Users manage own profile" on public.profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id)';
  end if;
end$$;

-- Bucket avatars (public-read pour faciliter l'affichage, upload réservé aux propriétaires)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'avatars read public') then
    execute $p$create policy "avatars read public" on storage.objects for select using (bucket_id = 'avatars')$p$;
  end if;
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'avatars upload own') then
    execute $p$create policy "avatars upload own" on storage.objects for insert with check (bucket_id = 'avatars' and (auth.uid())::text = (storage.foldername(name))[1])$p$;
  end if;
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'avatars update own') then
    execute $p$create policy "avatars update own" on storage.objects for update using (bucket_id = 'avatars' and (auth.uid())::text = (storage.foldername(name))[1])$p$;
  end if;
  if not exists (select 1 from pg_policies where tablename = 'objects' and policyname = 'avatars delete own') then
    execute $p$create policy "avatars delete own" on storage.objects for delete using (bucket_id = 'avatars' and (auth.uid())::text = (storage.foldername(name))[1])$p$;
  end if;
end$$;
