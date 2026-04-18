# Relya — V2 Handoff

Synthèse de la V2 « UX & monétisation ». Trois chantiers : distinction des états d'abonnement, paywall sur features premium, plateforme vivante.

---

## 1. Ce qui est fait

### Chantier 1 — États d'abonnement distincts

- **`lib/types.ts`** : nouveau type `SubscriptionState` (6 valeurs — `trial_unpaid`, `trial_paid`, `active`, `past_due`, `canceled`, `expired`).
- **`lib/subscriptions-shared.ts`** : helpers purs (importables depuis un client component) :
  - `getSubscriptionState(sub)` : renvoie l'état calculé (expiration, `setup_paid`, statut Stripe).
  - `isPro(state)` : `active || trial_paid`.
  - `formatNextBillingDate(sub)` : date FR du prochain prélèvement.
- **`components/TrialBanner.tsx`** : bandeau réécrit avec 4 variantes visuelles :
  - Essai non payé (gold, rouge si ≤ 3 j).
  - Essai payé (vert + prochain prélèvement).
  - `past_due` (rouge + bouton « Mettre à jour » qui ouvre le portail Stripe).
  - `active` : aucun bandeau.
- **`app/subscribe/page.tsx`** : redirige vers `/app` si `isPro(state)` — un abonné ne revoit plus la page de souscription.
- **`components/SubscriptionCard.tsx`** (nouveau) : bloc « Mon abonnement » affiché en bas du dashboard avec dot coloré, titre, sous-titre contextuel, CTA « Activer » ou « Gérer mon abonnement » (portail Stripe).

### Chantier 2 — Fonctionnalités réservées aux abonnés

- **`supabase/v2_migrations.sql`** (nouveau, idempotent) :
  - `alter table devis add column if not exists notes text;`
  - `create table if not exists email_templates (...)` + RLS « Users manage own templates ».
- **`components/ProFeatureGate.tsx`** : wrapper réutilisable. Deux modes :
  - bloc flouté + overlay « 🔒 Activer mon abonnement »,
  - `inline` — petit bouton gold lié à `/subscribe`.
- **Notes privées sur devis** (`DevisTable`) : bouton par ligne. Pro → modale textarea qui `PATCH /api/devis/[id] { notes }`. Non-abonné → bouton verrouillé lié à `/subscribe`. L'API refuse un `notes` non-Pro avec `402`.
- **Export CSV** (`components/devis/ExportCsvButton.tsx`) : bouton header du dashboard. Pro → génère un `.csv` UTF-8 BOM (8 colonnes). Non-abonné → CTA verrouillé.
- **Stats avancées** (`components/dashboard/RevenueChart.tsx`) : graphique recharts `AreaChart` — CA gagné sur 6 mois glissants, couleur or, dégradé. Wrappé dans `ProFeatureGate` — non-abonné voit le graphique flouté + overlay.

### Chantier 3 — Plateforme vivante

- **`DashboardGreeting`** : « Bonjour {Prénom} 👋 » (prénom déduit de l'email, salutation selon l'heure). Emoji animé (CSS keyframes).
- **Compteurs animés** (`Stats`) : ease-out cubic en `requestAnimationFrame` (~900 ms). Hover subtil sur les cartes.
- **Empty state** (`components/devis/DevisEmptyState.tsx`) : illustration SVG (document + check), titre « Votre premier devis, c'est parti ! », 3 étapes numérotées avec flèches, CTA principal.
- **Conseil du jour** (`lib/tips.ts` + `components/dashboard/TipOfTheDay.tsx`) : 22 conseils métier rotatifs (index = jour UNIX). Bloc or pastel avec icône 💡.
- **Activity feed** (`components/dashboard/ActivityFeed.tsx`) : dérivé des devis — création, relance J+3/J+7/J+10, gagné/perdu. Horodatage relatif. Max 8 items.
- **Toasts sonner** (`components/ToastListener.tsx`) monté dans le layout dashboard. Déclenchés sur :
  - création de devis (depuis `DevisForm`),
  - changement de statut, suppression, sauvegarde de note, export CSV (depuis `DevisTable` / `ExportCsvButton`).

### Transverse

- `app/api/devis/[id]/route.ts` : `PATCH` accepte désormais `notes` et refuse (`402`) si l'utilisateur n'est pas Pro.
- `app/app/page.tsx` : calcule `subscription` + `pro` une fois, passe aux composants enfants.
- `npm run build` : ✅ passe (17 routes, TypeScript strict OK, lint OK).

---

## 2. Ce qui a été compliqué

- **Client component qui importait du code server** : `TrialBanner` (« use client ») importait des helpers depuis `lib/subscriptions.ts` qui tire `next/headers`. Solution : séparer les helpers purs dans `lib/subscriptions-shared.ts` et réexporter depuis `subscriptions.ts`.
- **Types recharts stricts** : `Tooltip.formatter` attend `ValueType | undefined` → impossible d'annoter `v: number` directement, fallback via `typeof v === "number"`.
- **Modale de note** : pas de lib modale dans le projet, modale maison (backdrop + stopPropagation). Accepté pour ne pas ajouter de dépendance supplémentaire.
- **Toaster survivant à la navigation** : `Toaster` monté dans `app/app/layout.tsx` (et non dans la page) pour que le toast « Devis enregistré » émis depuis `/app/devis/nouveau` juste avant `router.push("/app")` soit bien affiché après la redirection.

---

## 3. Ce qui reste à faire / à savoir

### À exécuter manuellement

- **SQL non lancé automatiquement** : PostgREST n'expose pas le DDL. Il faut ouvrir Supabase → SQL Editor → coller `supabase/v2_migrations.sql` → Run. Avant cela, `PATCH /notes` plantera en écrivant sur une colonne inexistante.
- **Déploiement Vercel** : pas redéployé dans cette session. `git push` + Vercel rebuild prendra le relais (env vars déjà présentes).

### Non implémenté (volontairement ou hors scope)

- **Templates d'email custom** : schéma SQL prêt (`email_templates`), mais aucune UI ni intégration dans `lib/emails`. Demande une page `/app/parametres/emails` et un merge dans le template Resend — sortie du périmètre V2 serré.
- **Logo custom dans les emails** : idem, non implémenté.
- **Landing animée (framer-motion)** : non ajouté. La landing actuelle reste statique — l'effort V2 s'est concentré sur l'app connectée, là où les abonnés passent leurs heures.
- **Confetti sur « Gagné »** : le toast suffit visuellement. `react-confetti` non installé.
- **Screenshots** : pas de captures générées automatiquement (pas de browser pilotable ici). Le reviewer doit capturer les 5 vues manuellement — cf. ci-dessous.

### Risques / points d'attention

- `SubscriptionCard` affiche un CTA « Gérer mon abonnement » **uniquement si** `stripe_customer_id` existe. Un trial non payé n'a pas encore de customer — le CTA n'apparaît qu'après le premier paiement (voulu).
- `ActivityFeed` lit `derniere_relance_at` mais l'affectation J+3/J+7/J+10 est déduite de `nb_relances` côté UI. Si le cron saute un échelon, le libellé pourra être incorrect — non bloquant.
- `getTipOfTheDay()` utilise l'horloge serveur (UTC) pour `Math.floor(Date.now() / 86 400 000)`. Côté FR, le tip change à 01 h en hiver / 02 h en été. Assumé.

---

## 4. Comment tester

Prérequis : migration SQL V2 exécutée, dev server lancé (`npm run dev`), compte avec subscription en base.

### Chantier 1 — États

1. **Nouveau compte** → `/app` → bandeau gold « Il vous reste 14 jours d'essai » + bloc « Mon abonnement » jaune en bas.
2. En Supabase, passer `subscriptions.setup_paid = true` + `status = 'trialing'` → refresh → bandeau **vert** « Abonnement actif — prochain prélèvement de 19 € le… » + badge vert dans SubscriptionCard.
3. Passer `status = 'past_due'` → bandeau **rouge** + bouton « Mettre à jour » (ouvre portail Stripe si `stripe_customer_id` présent).
4. Avec `isPro === true`, naviguer vers `/subscribe` → redirection immédiate vers `/app`.

### Chantier 2 — Paywall

5. En trial gratuit (non payé) : sur le dashboard, cliquer **🔒 note** sur un devis → redirigé vers `/subscribe`. Cliquer **🔒 Export CSV** → idem. Le graphique CA est flouté + overlay or.
6. Passer le compte Pro (`setup_paid = true`) :
   - **Note** : cliquer « ＋ note » → modale → taper du texte → « Enregistrer » → toast vert « Note enregistrée ». Rouvrir : la note revient.
   - **CSV** : bouton « ⬇ Export CSV » → fichier `relya-devis-YYYY-MM-DD.csv` téléchargé avec 8 colonnes, UTF-8, séparateur virgule, notes incluses.
   - **Graphique** : visible, 6 barres de mois, tooltip en euros français.
7. Forcer un `PATCH /api/devis/:id { notes: "x" }` via curl en non-Pro → doit répondre `402`.

### Chantier 3 — Plateforme vivante

8. Charger `/app` : « Bonjour {Prénom} 👋 » (emoji anime), 4 compteurs qui montent de 0 à leur valeur finale en < 1 s, bloc « Conseil du jour » jaune pastel.
9. Compte sans devis → empty state avec illustration SVG + 3 étapes + CTA.
10. Ajouter un devis → toast vert « Devis enregistré — relances programmées ✓ ». La page de destination (`/app`) affiche le toast (le `Toaster` est monté dans le layout).
11. Changer un statut / supprimer un devis → toast correspondant.
12. Avec ≥ 1 devis + au moins une relance envoyée, le bloc « Activité récente » liste les derniers events.

### Build

```bash
npm run build
```

Doit se terminer sans erreur TypeScript (testé — ✅ sur cette branche).

---

## 5. Screenshots

Non capturés dans cette session (pas de browser pilotable). À prendre manuellement après déploiement, dans `docs/screenshots/` :

1. `dashboard-trial-unpaid.png` — bandeau gold, empty state illustré.
2. `dashboard-pro.png` — compteurs animés figés, graphique CA, activity feed.
3. `note-modal.png` — modale de note ouverte sur un devis.
4. `paywall-csv-chart.png` — vue d'un non-abonné : graphique flouté + CTA Export verrouillé.
5. `subscription-card.png` — bloc « Mon abonnement » en bas du dashboard (trial payé + portail).

---

## Fichiers touchés (récap)

**Ajoutés**
- `components/ProFeatureGate.tsx`
- `components/SubscriptionCard.tsx`
- `components/ToastListener.tsx`
- `components/dashboard/ActivityFeed.tsx`
- `components/dashboard/DashboardGreeting.tsx`
- `components/dashboard/RevenueChart.tsx`
- `components/dashboard/TipOfTheDay.tsx`
- `components/devis/DevisEmptyState.tsx`
- `components/devis/ExportCsvButton.tsx`
- `lib/tips.ts`
- `supabase/v2_migrations.sql`
- `V2_HANDOFF.md`

**Modifiés**
- `app/api/devis/[id]/route.ts` (PATCH accepte `notes`, gate Pro)
- `app/app/layout.tsx` (monte Toaster global)
- `app/app/page.tsx` (orchestre tous les nouveaux blocs + `isPro`)
- `app/subscribe/page.tsx` (redirect si Pro)
- `components/TrialBanner.tsx` (4 états visuels)
- `components/dashboard/Stats.tsx` (compteurs animés + hover)
- `components/devis/DevisForm.tsx` (toast succès)
- `components/devis/DevisTable.tsx` (notes + toasts + empty state extrait)
- `lib/subscriptions-shared.ts` (helpers `getSubscriptionState`, `isPro`, `formatNextBillingDate`)
- `lib/types.ts` (`SubscriptionState`, `notes` sur Devis)
- `package.json` / `package-lock.json` (`sonner`, `recharts`)
