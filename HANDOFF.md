# HANDOFF — Relya

Document de passation de l'état du projet à la fin de la phase de construction automatisée.

---

## Ce qui a été fait (par Claude Code)

### Rebranding complet vers Relya
- `package.json` renommé en `relya`, version `0.1.0`.
- `app/layout.tsx` : metadata mise à jour (titre, description, tagline « 3× plus de devis signés, sans y penser. »).
- Fonts Fraunces (serif titre) + DM Sans (sans-serif UI) importées dans `app/globals.css`.
- Palette : crème `#F7F5F2`, vert foncé `#1C2B1A`, or `#D2A050`, gris `#9A9A9A`.
- Templates d'email (`lib/emails/templates.ts`) relookés au nom Relya avec point d'or.
- Expéditeur par défaut : `Relya <onboarding@resend.dev>` (à remplacer par `relances@relya.fr` une fois DNS configuré sur Resend).

### Restructure des routes
- Dashboard déplacé de `/` vers `/app`.
- `app/(dashboard)/` supprimé, remplacé par `app/app/layout.tsx` + `app/app/page.tsx` + `app/app/devis/nouveau/page.tsx`.
- Toutes les redirections post-login pointent désormais vers `/app`.
- Route publique `/` : **landing page** (hero, problème, solution en 3 étapes, stats, témoignages *exemple*, pricing, FAQ, footer).
- Page publique `/pricing` (tarifs détaillés).
- Pages légales placeholders : `/cgu`, `/mentions-legales`, `/politique-confidentialite`.

### Middleware de protection
- `middleware.ts` réécrit avec 3 classes de routes :
  - **Publiques** : `/`, `/pricing`, `/cgu`, `/mentions-legales`, `/politique-confidentialite`.
  - **Auth** (`/login`, `/signup`) : redirigent vers `/app` si déjà connecté.
  - **Protégées** (`/app/*`, `/subscribe`) : redirigent vers `/login?redirect=...` si non connecté.

### Paywall & abonnements
- Table `subscriptions` créée dans `supabase/subscriptions.sql` :
  - Colonnes : `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `status`, `current_period_end`, `trial_end`, `cancel_at_period_end`, `setup_paid`.
  - RLS activé (chaque user ne voit que sa propre subscription).
  - **Trigger `on_auth_user_created`** : crée automatiquement une subscription `trialing` avec `trial_end = now() + 14 days` à chaque signup.
  - Back-fill pour les utilisateurs existants.
- `lib/subscriptions.ts` : helpers `getOrCreateSubscription`, `hasActiveAccess`, `daysLeftInTrial`.
- `app/app/layout.tsx` : vérifie `hasActiveAccess` à chaque requête, redirige vers `/subscribe` si échu.
- `components/TrialBanner.tsx` : bandeau J–X affiché pendant l'essai (urgent en rouge/or si ≤ 3 jours).
- `app/subscribe/page.tsx` + `components/SubscribeClient.tsx` : page pour activer l'abonnement (29 € + 19 €/mois).

### Intégration Stripe
- `lib/stripe/server.ts` : instance Stripe côté serveur (avec fallback placeholder pour que `next build` passe même sans clés).
- `lib/stripe/client.ts` : loader côté navigateur.
- `app/api/stripe/checkout/route.ts` : crée la Checkout Session (1 ou 2 line items selon `setup_paid`, `trial_period_days` = jours restants).
- `app/api/stripe/portal/route.ts` : ouvre le portail client Stripe.
- `app/api/stripe/webhook/route.ts` : traite `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed` avec vérification de signature.
- `lib/supabase/admin.ts` : client Supabase service_role utilisé par le webhook et le cron.

### Cron (inchangé fonctionnellement, mais fiabilisé)
- `app/api/cron/relances/route.ts` : utilise désormais `createAdminClient()` pour que `auth.admin.getUserById` fonctionne (nécessite service_role).
- Accepte le secret via header `Authorization: Bearer ...` ou query `?secret=...` (Vercel Cron).

### Documentation livrée
- `STRIPE_SETUP.md` : pas à pas pour la configuration Stripe complète.
- `HANDOFF.md` (ce document).
- `QUESTIONS_POUR_UTILISATEUR.md` : points bloquants qui nécessitent une action humaine.

---

## Ce que vous devez faire (checklist de mise en prod)

### 🗄️ Supabase
- [ ] Exécuter `supabase/subscriptions.sql` dans l'éditeur SQL de Supabase.
- [ ] Vérifier que `SUPABASE_SERVICE_ROLE_KEY` est bien configuré côté Vercel (Settings → Environment Variables).
- [ ] (Optionnel) Rejouer `supabase/schema.sql` si pas déjà fait en production.

### 💳 Stripe
- [ ] Créer un compte Stripe et activer le compte en mode Live.
- [ ] Suivre **STRIPE_SETUP.md** : créer les 2 produits (setup 29 € one-shot + monthly 19 €), configurer le webhook, activer le portail client.
- [ ] Ajouter les 5 variables Stripe sur Vercel (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_SETUP`, `STRIPE_PRICE_MONTHLY`).

### 🌍 Domaine & DNS
- [ ] Acheter le domaine `relya.fr` (OVH, Gandi, Namecheap…).
- [ ] Connecter le domaine sur Vercel (Settings → Domains) et ajouter les CNAME / A records fournis.
- [ ] Sur Resend (Settings → Domains) : ajouter `relya.fr`, configurer les DNS (SPF, DKIM, DMARC) pour pouvoir envoyer depuis `relances@relya.fr` au lieu de `onboarding@resend.dev`.
- [ ] Une fois DNS validé : changer le `from` dans `lib/emails/send.ts` et pousser.

### 📧 Emails
- [ ] Vérifier que `RESEND_API_KEY` est bien configuré en prod.
- [ ] Envoyer un devis de test et vérifier l'arrivée de l'email (boîte Gmail + boîte pro si possible).
- [ ] Éventuellement créer un alias `contact@relya.fr` pour les emails de support.

### 📜 Légal
- [ ] Les 3 pages légales sont des **modèles provisoires**. Faites-les valider ou réécrire par un juriste avant ouverture commerciale (mentions obligatoires : SIREN, RCS, adresse, directeur de publication).
- [ ] Compléter `mentions-legales` avec les informations réelles de l'entreprise (SIREN, adresse, etc.).
- [ ] Déclaration CNIL ou registre RGPD si nécessaire.

### 🚀 Mise en production
- [ ] Push sur GitHub → Vercel auto-deploy (si connecté).
- [ ] Sinon : `vercel --prod` depuis la CLI.
- [ ] Tester le flow complet en mode Stripe Test : signup → essai 14j → abonnement → dashboard.
- [ ] Basculer Stripe en Live, mettre à jour les vars.
- [ ] Faire un achat réel de 48 € avec sa propre CB pour valider le flux complet.

### 📊 Monitoring
- [ ] Activer Vercel Analytics (gratuit).
- [ ] Configurer les logs Supabase / Resend / Stripe pour être notifié des erreurs.
- [ ] Ajouter Sentry ou équivalent si volume > 10 utilisateurs.

---

## Architecture à l'œil

```
app/
├── page.tsx                           # Landing publique
├── pricing/page.tsx                   # Tarifs publics
├── cgu/, mentions-legales/, politique-confidentialite/
├── layout.tsx                         # Layout racine
├── globals.css                        # Fonts + couleurs
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── app/                               # Dashboard protégé
│   ├── layout.tsx                     # Auth + paywall + TrialBanner
│   ├── page.tsx                       # Dashboard (stats + DevisTable)
│   └── devis/nouveau/page.tsx
├── subscribe/page.tsx                 # Paywall / activation abonnement
└── api/
    ├── cron/relances/route.ts         # Cron Vercel (quotidien)
    └── stripe/
        ├── checkout/route.ts
        ├── portal/route.ts
        └── webhook/route.ts

components/
├── LegalLayout.tsx
├── SubscribeClient.tsx
├── TrialBanner.tsx
└── devis/*

lib/
├── emails/{send.ts, templates.ts}
├── stripe/{server.ts, client.ts}
├── subscriptions.ts
├── supabase/{admin.ts, client.ts, server.ts}
└── types.ts

supabase/
├── schema.sql                         # Table devis + RLS
└── subscriptions.sql                  # Table subscriptions + trigger trial
```

---

## Contacts & ressources

- Supabase dashboard : https://app.supabase.com
- Stripe dashboard : https://dashboard.stripe.com
- Resend dashboard : https://resend.com/emails
- Vercel dashboard : https://vercel.com
- Repo GitHub : https://github.com/morganpsqt/saas
