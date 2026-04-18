-- ============================================================
-- Relya — Schéma abonnements (à exécuter dans Supabase SQL Editor)
-- ============================================================

-- Table subscriptions : 1 ligne par utilisateur, synchronisée avec Stripe
create table if not exists public.subscriptions (
  user_id              uuid        primary key references auth.users(id) on delete cascade,
  stripe_customer_id   text        unique,
  stripe_subscription_id text      unique,
  status               text        not null default 'trialing'
                                   check (status in (
                                     'trialing',
                                     'active',
                                     'past_due',
                                     'canceled',
                                     'incomplete',
                                     'incomplete_expired',
                                     'unpaid'
                                   )),
  current_period_end   timestamptz,
  trial_end            timestamptz,
  cancel_at_period_end boolean     not null default false,
  setup_paid           boolean     not null default false,  -- frais d'inscription 29€ réglés
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists subscriptions_stripe_customer_idx
  on public.subscriptions(stripe_customer_id);

-- RLS : chaque user ne voit que sa propre souscription
alter table public.subscriptions enable row level security;

drop policy if exists "Users view own subscription" on public.subscriptions;
create policy "Users view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Trigger updated_at
create or replace function public.set_subscription_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_subscription_updated_at();

-- ============================================================
-- Trigger : à chaque nouvel utilisateur, créer une souscription "trialing"
-- avec 14 jours d'essai. Stripe prendra le relais au checkout.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
as $$
begin
  insert into public.subscriptions (user_id, status, trial_end)
  values (new.id, 'trialing', now() + interval '14 days')
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Back-fill : créer une souscription pour les utilisateurs existants qui n'en ont pas
insert into public.subscriptions (user_id, status, trial_end)
select u.id, 'trialing', now() + interval '14 days'
from auth.users u
left join public.subscriptions s on s.user_id = u.id
where s.user_id is null;
