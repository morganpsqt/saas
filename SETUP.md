# Setup local — Relya

Ce que tu fais pour lancer Relya sur ton Mac. Écrit pour toi-même dans 6 mois.

## 1. Cloner + installer

```bash
git clone git@github.com:morganpsqt/saas.git relya
cd relya
npm install
```

## 2. Variables d'environnement

```bash
cp .env.local.example .env.local
```

Puis remplir `.env.local` avec tes vraies clés :

| Clé | Où la trouver |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | idem |
| `SUPABASE_SERVICE_ROLE_KEY` | idem (⚠️ secret, jamais côté client) |
| `RESEND_API_KEY` | resend.com/api-keys |
| `RESEND_FROM` | Expéditeur vérifié (Resend → Domains) |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | idem |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen` en local, ou Webhook settings en prod |
| `STRIPE_PRICE_SETUP` | Produit "Frais d'installation 29€" → Price ID |
| `STRIPE_PRICE_MONTHLY` | Produit "Abonnement mensuel 19€/mois" → Price ID |
| `CRON_SECRET` | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` en local |

## 3. Base de données Supabase

Dans le SQL Editor du projet Supabase, exécuter dans cet ordre :

1. `supabase/schema.sql` — table `devis` + RLS + trigger updated_at
2. `supabase/subscriptions.sql` — table `subscriptions` + trigger essai 14 j
3. `supabase/v2_migrations.sql` — colonne `devis.notes` (feature Pro)
4. `supabase/profiles.sql` — table `profiles` + bucket `avatars`
5. `supabase/email_templates.sql` — table des templates emails Pro

## 4. Stripe Webhook en local

Dans un terminal séparé :

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copier le `whsec_...` affiché → `STRIPE_WEBHOOK_SECRET` dans `.env.local`.
Relancer `npm run dev` après.

## 5. Démarrer l'app

```bash
npm run dev        # → http://localhost:3000
npm run build      # build production (sanity check)
npm start          # serveur production local
```

## 6. Lancer les tests E2E

Morgan, avant de push une feature : les tests Playwright doivent passer.

```bash
npx playwright install chromium   # une fois
npx playwright test               # toute la suite (~5 min)
npx playwright test landing       # une seule suite
npx playwright test --ui          # mode interactif
```

Les tests utilisent ton `.env.local` : ils créent des users de test via le
service_role key, les nettoient à la fin (prefix `relya-test.local`).

## 7. Déploiement Vercel

- Push sur `main` → Vercel auto-deploy.
- Les variables d'env doivent être configurées dans **Vercel → Project →
  Settings → Environment Variables**, même noms que `.env.local`.
- Le webhook Stripe de prod doit pointer vers
  `https://relancedevis.vercel.app/api/stripe/webhook` (ou ton domaine custom).
- Le cron Vercel est déjà dans `vercel.json` (`/api/cron/relances` à 9h UTC).

## Diagnostiquer un problème

| Symptôme | Piste |
|---|---|
| Build échoue en prod | vérifier que toutes les env vars sont sur Vercel |
| Webhook Stripe 400 | `STRIPE_WEBHOOK_SECRET` différent en prod (whsec_ de l'endpoint, pas de `stripe listen`) |
| Email pas reçu | `RESEND_FROM` doit être un domaine vérifié, pas `resend.dev` en prod |
| Cron jamais déclenché | vérifier `vercel.json` et que Vercel Cron est activé (Pro plan) |
| Les tests bootstrapUser échouent | `SUPABASE_SERVICE_ROLE_KEY` manquante ou mauvaise |
