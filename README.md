# Relya

**3× plus de devis signés, sans y penser.**

SaaS qui relance automatiquement les clients d'artisans (plombiers, électriciens, menuisiers…) à J+2, J+5 et J+10 après l'envoi d'un devis.

---

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Supabase** — Postgres + Auth + Row-Level Security
- **Stripe** — Checkout + Billing Portal + Webhooks (29 € setup + 19 €/mois, trial 14 j)
- **Resend** — emails transactionnels
- **Vercel** — hébergement + Cron (1× / jour à 8h Paris)
- Fraunces (serif) + DM Sans (sans-serif)

---

## Démarrer en local

```bash
# 1. Cloner + installer
git clone https://github.com/morganpsqt/saas.git
cd saas
npm install

# 2. Configurer l'environnement
cp .env.local.example .env.local
# Remplir les clés — voir .env.local.example pour la liste exhaustive

# 3. Appliquer le schéma Supabase
# Via le SQL Editor Supabase, exécuter dans l'ordre :
#   supabase/schema.sql
#   supabase/subscriptions.sql

# 4. Lancer le dev server
npm run dev
```

Ouvre http://localhost:3000.

---

## Tester le flow Stripe en local

```bash
# Webhook en local avec Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copier le whsec_... dans .env.local → STRIPE_WEBHOOK_SECRET

# Carte de test : 4242 4242 4242 4242 — n'importe quelle date future — n'importe quel CVC
```

Tester le cron manuellement :
```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/relances
```

---

## Déployer

Push sur `main` → Vercel déploie automatiquement. Variables d'env à configurer côté Vercel (Settings → Environment Variables) — mêmes clés que `.env.local.example`.

Le cron quotidien est défini dans `vercel.json`.

---

## Structure

```
app/
├── page.tsx                           # Landing publique
├── pricing/                           # Tarifs publics
├── cgu/ mentions-legales/ politique-confidentialite/
├── (auth)/                            # login, signup
├── app/                               # Dashboard (auth + paywall)
│   ├── layout.tsx                     # Auth guard + paywall + TrialBanner
│   ├── page.tsx                       # Stats + liste devis
│   └── devis/nouveau/
├── subscribe/                         # Activation abonnement
└── api/
    ├── cron/relances/                 # Cron quotidien Vercel
    └── stripe/{checkout,portal,webhook}/

components/                            # UI composants
lib/
├── emails/                            # send + templates Relya
├── stripe/{server,client}.ts
├── supabase/{client,server,admin}.ts
├── subscriptions.ts                   # access control
└── types.ts
supabase/
├── schema.sql                         # Table devis
└── subscriptions.sql                  # Table subscriptions + trigger trial 14j
```

---

## Documentation

- **[HANDOFF.md](HANDOFF.md)** — ce qui reste à faire (domaine, mode LIVE, juriste…)
- **[STRIPE_SETUP.md](STRIPE_SETUP.md)** — configuration Stripe de A à Z
- **[QUESTIONS_POUR_UTILISATEUR.md](QUESTIONS_POUR_UTILISATEUR.md)** — décisions business en attente

---

## Licence

Propriétaire — © Relya.
