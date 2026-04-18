-- ============================================================
-- RelanceDevis — Schéma base de données
-- À exécuter dans Supabase SQL Editor
-- ============================================================

create table if not exists public.devis (
  id               uuid        default gen_random_uuid() primary key,
  user_id          uuid        not null references auth.users(id) on delete cascade,
  nom_client       text        not null,
  email_client     text        not null,
  montant          numeric(10,2) not null check (montant > 0),
  date_envoi       date        not null,
  statut           text        not null default 'en_attente'
                               check (statut in ('en_attente', 'relance', 'gagne', 'perdu')),
  nb_relances      integer     not null default 0,
  derniere_relance_at timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Index pour les requêtes du cron (statuts actifs)
create index if not exists devis_statut_idx on public.devis(statut);
create index if not exists devis_user_id_idx on public.devis(user_id);

-- Row Level Security
alter table public.devis enable row level security;

-- Chaque artisan ne voit que ses propres devis
create policy "Artisan voit ses devis"
  on public.devis
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Trigger pour updated_at automatique
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger devis_updated_at
  before update on public.devis
  for each row execute function public.set_updated_at();
