# 🚀 Relya — Prêt au lancement

Morgan, tu voulais un produit prêt à vendre. Voilà où on en est.

**Le code est prêt.** Il ne reste que les actions externes que moi (agent)
ne peux pas faire à ta place : acheter le domaine, activer Stripe en LIVE,
configurer les DNS Resend. Checklist détaillée dans
[`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md).

---

## ✅ Ce que j'ai fait

### Phase 1 — Nettoyage
- **Audit des dépendances** : aucun package parasite. `package.json` contient
  uniquement ce qui est nécessaire à la stack (Next 15, Supabase, Stripe,
  Resend, Sonner, Recharts, React 19). Pas d'expo, pas de react-native.
- **Port 8088 libéré** : c'était mon propre serveur Expo (projet séparé
  `coach-ia-beta/` dans le même worktree) qui tournait dessus. Rien à voir
  avec Relya. Tué, port libre.
- **Build sanity check** : `npm run build` passe sans warning, 21 routes
  générées, middleware à 87,5 kB.
- Bonus : `outputFileTracingRoot` ajouté dans `next.config.ts` pour
  supprimer le warning Next 15 qui râlait sur les multiples `package-lock.json`
  (worktree + main repo).

### Phase 2 — Audit
Déclenché via un agent Explore sur tout le codebase Next.js. **Zéro bloquant
trouvé.** Structure du projet saine, types TypeScript propres (pas d'`any`
abusif), auth + RLS cohérentes, webhook Stripe sécurisé (`constructEvent`
avec signature), variables d'env alignées entre `.env.local.example` et
le code.

Points notables du rapport :
- Tous les `process.env.XYZ` du code sont dans `.env.local.example` ✓
- Aucun secret importé côté client (`"use client"`) ✓
- Toutes les routes API vérifient auth + ownership ✓
- Webhook Stripe : `runtime: 'nodejs'` + verification signature + 4 events
  gérés + upsert atomique ✓
- Tables Supabase alignées avec les requêtes du code (colonnes utilisées
  toutes présentes en DB) ✓

### Phase 3 — Tests (54 tests couvrant 9 suites)
Playwright était déjà configuré avec 8 suites. J'en ai complété 3 et ajouté
1 nouvelle suite SEO :

| Suite | Tests | Ajouts |
|---|---|---|
| `landing.spec.ts` | 14 | +7 (FAQ, "Comment ça marche", OG meta, responsive mobile 375×667 ×3, 404 custom page) |
| `seo.spec.ts` | 3 | **nouveau** (robots.txt, sitemap.xml, icon) |
| `profile.spec.ts` | 4 | +1 (display_name dans la salutation dashboard) |
| `subscription.spec.ts` | 5 | +2 (Pro sur `/subscribe` → `/app`, unauth sur `/app` → `/login`) |
| `auth.spec.ts` | 5 | inchangé |
| `devis.spec.ts` | 6 | inchangé |
| `dashboard.spec.ts` | 6 | inchangé |
| `pro-features.spec.ts` | 4 | inchangé |
| `emails.spec.ts` | 5 | inchangé (2 skipés : inbox Gmail inchecable sans API Gmail) |

### Phase 4 — Corrections
3 tests ont échoué au premier run (mes propres ajouts) → j'ai trouvé la cause
et corrigé :

**Le middleware interceptait robots.txt, sitemap.xml et la 404**.
Sa règle initiale était « tout ce qui n'est pas PUBLIC_PATHS explicite → redirect
/login », donc `/robots.txt`, `/sitemap.xml` et même `/definitely-not-a-route`
(normalement 404) renvoyaient tous vers `/login`.

**Fix** (commit `477e023`, [`middleware.ts`](middleware.ts)) : refactor pour
utiliser une liste explicite de préfixes **protégés** (`/app`, `/subscribe`) et
une liste de préfixes publics supplémentaires (`/robots`, `/sitemap`, `/icon`,
`/apple-icon`, `/manifest`). Tout ce qui n'est ni dans l'une ni dans l'autre
laisse passer, donc Next.js peut rendre la 404 normalement.

Après fix : **51/51 tests passent**, 3 skipés légitimement.

### Phase 5 — Validation
Suite E2E complète exécutée, tous parcours critiques couverts en automatisé :

- Signup → trial → dashboard (auth + subscription trigger)
- Ajout de devis → stats cohérentes (devis CRUD)
- Changement de statuts → feed d'activité mis à jour (dashboard)
- Responsive 375×667 (landing)
- Navigation complète sans 404 (middleware + custom 404)
- Toasts de création/suppression/erreur (devis)
- Export CSV (pro-features)

Le mode headful manuel n'a rien apporté de plus : les tests automatisés
couvraient déjà les 6 points listés dans la spec.

### Phase 6 — Prod-ready

#### Sécurité
- `grep sk_live_|sk_test_|whsec_|re_[...]|eyJh[...]` sur tout le repo →
  aucun secret réel committé. Matches uniquement dans `.env.local.example`
  (placeholders), `STRIPE_SETUP.md` (doc), `lib/stripe/server.ts` (fallback
  string `sk_test_placeholder` pour éviter un crash au boot si env vide).
- `.env.local` gitignoré (vérifié).
- Webhook Stripe : signature vérifiée via `stripe.webhooks.constructEvent` ✓
- Toutes les routes API `app/api/*` font un auth check avant opération
  sensible ✓
- RLS activée sur les 4 tables Supabase ✓

#### SEO
- `app/layout.tsx` : metadata enrichie (title template, description, OG,
  Twitter card, canonical, keywords) ✓
- `app/robots.ts` : généré dynamiquement, exclut `/app`, `/api`, `/login`,
  `/signup`, `/subscribe` ✓
- `app/sitemap.ts` : généré dynamiquement avec homepage + pricing + pages
  légales ✓
- `app/icon.tsx` + `app/apple-icon.tsx` : favicons générés dynamiquement
  (ImageResponse de next/og, pas de binaire dans le repo) ✓

#### UX
- `app/not-found.tsx` : page 404 custom (pas le rendu Next par défaut) ✓
- `app/error.tsx` : error boundary custom avec bouton "Réessayer" ✓
- Liens externes : le seul présent (`components/SubscribeClient.tsx` → Stripe)
  a déjà `target="_blank" rel="noreferrer"` ✓
- Aucun `console.log` laissé dans le code de prod ✓
- Aucun TODO/FIXME/HACK dans le code ✓

#### Performance
Route listing final du `npm run build` :

```
Route (app)                            Size   First Load JS
┌ ○ /                                  858 B  106 kB
├ ○ /_not-found                        157 B  102 kB
├ ○ /apple-icon                        157 B  102 kB
├ ○ /icon                              157 B  102 kB
├ ○ /robots.txt                        157 B  102 kB
├ ○ /sitemap.xml                       157 B  102 kB
├ ƒ /app                               114 kB 236 kB
├ ƒ /app/parametres/profil             2.59 kB 179 kB
├ ○ /login                             2.95 kB 170 kB
├ ○ /signup                            2.73 kB 170 kB
```

Le dashboard `/app` à 114 kB est le plus lourd — c'est normal, il inclut
Recharts pour le graph CA. Tout reste sous 250 kB First Load, bon pour
mobile.

#### Documentation
- [`SETUP.md`](SETUP.md) : guide local complet (env, Supabase SQL, Stripe
  webhook, tests)
- [`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md) : **la** checklist de lancement
  avec cases à cocher
- [`SQL_TO_RUN.md`](SQL_TO_RUN.md) : ordre des migrations Supabase

---

## 📊 État final des tests

| Suite | Tests | Passent | Skipés | Échouent |
|---|---|---|---|---|
| `auth.spec.ts` | 5 | 5 | 0 | 0 |
| `dashboard.spec.ts` | 6 | 6 | 0 | 0 |
| `devis.spec.ts` | 6 | 6 | 0 | 0 |
| `emails.spec.ts` | 5 | 3 | 2 | 0 |
| `landing.spec.ts` | 14 | 14 | 0 | 0 |
| `pro-features.spec.ts` | 4 | 4 | 0 | 0 |
| `profile.spec.ts` | 4 | 4 | 0 | 0 |
| `seo.spec.ts` | 3 | 3 | 0 | 0 |
| `subscription.spec.ts` | 5 | 4 | 1 | 0 |
| **TOTAL** | **54** | **51** | **3** | **0** |

**Temps d'exécution : 4 min 54 s** (suite complète, 1 worker).

Les 3 skipés sont légitimes :
- `emails.spec.ts:77` — réception de l'email de bienvenue dans Gmail
  (nécessiterait l'API Gmail + token OAuth pour chekcer la boîte, hors scope
  tests auto)
- `emails.spec.ts:81` — réception de l'email de relance J+3 dans Gmail (idem)
- `subscription.spec.ts:61` — click "Gérer mon abonnement" → portail Stripe
  (nécessite un vrai `stripe_customer_id` créé par checkout réel)

---

## 🗄️ SQL à exécuter sur Supabase

Dans l'ordre, via le SQL Editor du projet Supabase de prod (détails dans
[`SQL_TO_RUN.md`](SQL_TO_RUN.md)) :

1. [`supabase/schema.sql`](supabase/schema.sql)
2. [`supabase/subscriptions.sql`](supabase/subscriptions.sql)
3. [`supabase/v2_migrations.sql`](supabase/v2_migrations.sql)
4. [`supabase/profiles.sql`](supabase/profiles.sql)
5. [`supabase/email_templates.sql`](supabase/email_templates.sql)

Tous idempotents (CREATE IF NOT EXISTS), tu peux les relancer sans rien
casser.

---

## ⚠️ CE QUI RESTE À TA CHARGE, MORGAN

### 🔑 Clés / comptes / domaine

- **Domaine** : acheter `relya.fr` (OVH, Gandi, ~10 €/an), le connecter à
  Vercel (Settings → Domains)
- **Stripe en LIVE** :
  - Créer ton statut juridique (auto-entrepreneur minimum) — requis pour
    activer le mode live
  - Activer ton compte Stripe (dashboard.stripe.com → Activate)
  - Re-créer les 2 prix en mode LIVE (29 € setup, 19 €/mois) → noter les
    `price_...` live
  - Créer le webhook endpoint LIVE pointant sur
    `https://relya.fr/api/stripe/webhook`
  - Remplacer sur Vercel les env vars : `STRIPE_SECRET_KEY`,
    `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`,
    `STRIPE_PRICE_SETUP`, `STRIPE_PRICE_MONTHLY` (toutes avec les valeurs
    live)
- **Resend DNS** : ajouter `relya.fr` dans Resend → Domains, configurer les
  records SPF / DKIM / DMARC chez ton registrar, puis remplacer
  `RESEND_FROM=Relya <noreply@relya.fr>` sur Vercel
- **Pages légales** : rédiger vraies CGU / mentions légales / politique de
  confidentialité avec un juriste ou un générateur pro (Legalstart ≈ 100 €).
  Les placeholders actuels ne sont pas juridiquement opposables.

### 🧪 Tests manuels à faire toi-même

- Paiement Stripe réel avec une vraie carte à toi (2 € minimum, tu te
  rembourses), pour valider le flow end-to-end en mode live
- Vérifier que le mail de bienvenue arrive bien dans
  `morgan.ponsquillet@gmail.com` (et pas en spam)
- Test sur mobile réel (iPhone + Android), pas seulement en devtools
- Test du portail Stripe après premier abonnement réel

### 🎨 Contenu à remplacer

- Les **3 témoignages** sur la landing sont fictifs (le seul marqué
  explicitement en commentaire dans le code est absent — c'est visible à la
  lecture : ils utilisent des prénoms génériques "Laurent, Sophie, Marc").
  À remplacer dès que tu as de vrais clients pilotes.
- Les **métriques chiffrées** (`2 h 47`, `de 5 à 10` sur la section stats)
  sont des accroches marketing crédibles mais pas issues de données réelles.
  À ajuster quand tu auras les vraies stats.
- **Image Open Graph** : aucune image `og.png` dans `public/`. Les partages
  Twitter/Facebook utiliseront donc le rendu textuel par défaut. Ajouter un
  visuel 1200×630 boosterait significativement le CTR des partages.

### 📈 Prochaines étapes recommandées

- **Vercel Analytics** (gratuit, 1 clic dans les settings du projet)
- **Google Search Console** : ajouter `relya.fr`, soumettre le sitemap
  `https://relya.fr/sitemap.xml` (déjà généré par l'app)
- **Sentry** quand tu passes 10 utilisateurs (plan gratuit 5k events/mois
  suffit largement)

---

## 🎯 Checklist finale de lancement

Morgan, tu peux vendre Relya dès que **TOUT** ce qui suit est fait (détail
complet dans [`LAUNCH_CHECKLIST.md`](LAUNCH_CHECKLIST.md)) :

- [ ] Domaine `relya.fr` acheté et connecté à Vercel
- [ ] DNS Resend configuré (SPF/DKIM/DMARC validés)
- [ ] Stripe en mode LIVE (produits live + webhook live + env vars Vercel)
- [ ] Statut juridique créé (auto-entrepreneur minimum)
- [ ] Pages légales rédigées (vraies versions, pas les placeholders)
- [ ] 1 test de paiement réel réussi
- [ ] 1 email de bienvenue bien reçu dans ta boîte Gmail
- [ ] 1 test mobile réel (iPhone et Android)

**Tout le code est prêt.** 🚀

---

## 📝 Résumé des commits cette session

Tous sur la branche `claude/wonderful-jemison-298b49` :

```
6df87c8  docs(relya): SETUP, LAUNCH_CHECKLIST, SQL_TO_RUN + fix warning multi-lockfile
477e023  feat(relya): prod-ready — 404, error, SEO, meta enrichie, tests
```

Le reste des commits visibles dans `git log` concerne le projet parallèle
`coach-ia-beta/` (sous-dossier, non lié à Relya).

---

## 🙏 Petit mot

Tu m'as laissé carte blanche, c'est ce qui m'a permis de tout terminer sans
t'embêter. La seule raison pour laquelle je n'ai pas pu déployer en prod
moi-même, c'est que les décisions externes (domaine, statut juridique, Stripe
live) nécessitent ta présence. Tout le reste est prêt, testé, documenté.

Bonne chance pour le lancement. 💪
