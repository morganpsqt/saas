# V5 — Rapport de tests E2E Relya

**Date :** 21 avril 2026
**Auteur :** Claude Opus 4.7 (mission autonome V5)
**Outil :** Playwright 1.59 (Chromium headless-shell)
**Commande :** `npx playwright test`

---

## Résumé exécutif

- **41 tests écrits** sur 8 suites couvrant tous les flux critiques (landing, auth, devis, subscription, profil, emails, dashboard, pro-features).
- **38 tests passent**, **3 tests sautés volontairement** (limites de sandbox Stripe/Gmail).
- **0 test en échec** après correctifs.
- **1 bug produit corrigé** (welcome email bloquant le signup hors destinataire vérifié Resend).
- Toute la suite tourne en **~4 min 20 s** sur un seul worker Chromium.

Commits pushés sur `origin/main` :
- `fix(api): welcome email endpoint returns 200 even when Resend rejects recipient`
- `test(e2e): add Playwright coverage for all core flows`

Pour relancer : `npm run dev` dans un terminal, puis `npx playwright test` dans un autre (Playwright réutilise le serveur existant).

---

## Résultats par suite

| Suite | Fichier | Tests | ✅ | ⏭ | ❌ |
|---|---|---|---|---|---|
| Landing page | [landing.spec.ts](tests/e2e/landing.spec.ts) | 7 | 7 | 0 | 0 |
| Auth | [auth.spec.ts](tests/e2e/auth.spec.ts) | 5 | 5 | 0 | 0 |
| Devis CRUD | [devis.spec.ts](tests/e2e/devis.spec.ts) | 6 | 6 | 0 | 0 |
| Subscription | [subscription.spec.ts](tests/e2e/subscription.spec.ts) | 4 | 3 | 1 | 0 |
| Profile | [profile.spec.ts](tests/e2e/profile.spec.ts) | 3 | 3 | 0 | 0 |
| Dashboard | [dashboard.spec.ts](tests/e2e/dashboard.spec.ts) | 6 | 6 | 0 | 0 |
| Pro-only features | [pro-features.spec.ts](tests/e2e/pro-features.spec.ts) | 4 | 4 | 0 | 0 |
| Emails & crons | [emails.spec.ts](tests/e2e/emails.spec.ts) | 6 | 4 | 2 | 0 |
| **Total** | | **41** | **38** | **3** | **0** |

### Détail des tests skipés (volontaires)

1. **Subscription — Portail Stripe** : ouvre une URL `billing.stripe.com` externe, non scriptable sans compte test Stripe.
2. **Emails — Réception du welcome email Gmail** : nécessite l'accès à la boîte `morgan.ponsquillet@gmail.com`, impossible en CI.
3. **Emails — Réception du J+3 Gmail** : idem.

---

## Bugs trouvés et corrigés

### 🐛 Bug #1 — Welcome email renvoie HTTP 500 en sandbox Resend

**Fichier :** [app/api/auth/welcome/route.ts](app/api/auth/welcome/route.ts)

**Symptôme :** Tout utilisateur qui s'inscrit avec une adresse autre que `morgan.ponsquillet@gmail.com` voyait le POST `/api/auth/welcome` retourner `500` avec `{ "error": "Resend welcome error: You can only send testing emails to your own email address" }`. Le statut Pro restait "non-welcomed" et tout script en aval qui s'attendait à un 2xx (notamment le hook côté client qui fire l'appel après confirmation email) affichait une erreur sans raison valable pour l'utilisateur.

**Cause racine :** Resend est en mode sandbox (pas de domaine encore vérifié pour l'envoi en production). Dans ce mode, seuls les destinataires correspondant au propriétaire du compte sont acceptés. L'endpoint propageait l'exception Resend en `500`, alors que le welcome email est **non-critique** (on peut le réenvoyer plus tard, ça ne doit pas bloquer l'onboarding).

**Fix :** L'endpoint retourne maintenant toujours `200` avec `{ success: true, sent: boolean, reason?: string }`. Le flag `welcome_email_sent` n'est flippé à `true` **que** si l'envoi a réussi, ce qui préserve la possibilité de retenter l'envoi après vérification du domaine.

**Vérifié par :** `emails.spec.ts:17` (Welcome email endpoint returns 200 idempotent) — PASS.

---

## Bugs trouvés mais non corrigés

**Aucun.**

Tous les autres écarts rencontrés pendant la rédaction des tests étaient des **sélecteurs ou assertions incorrects dans les tests** (attendus en cours de découverte du front), pas des bugs produit. Liste des ajustements non-produit :

- Les labels des formulaires login/signup n'ont pas d'attribut `htmlFor` → les helpers utilisent `input[type=email]` / `input[type=password]` plutôt que `getByLabel(...)`.
- Le dashboard empty-state utilise la classe `.empty-card` (et non `.table-wrap` / `.empty-state`).
- Les stats sont libellées "Devis envoyés / Devis gagnés / Taux de conversion / CA récupéré", pas "Total".
- Quand un utilisateur Pro n'a aucun devis gagné, la card revenus affiche un état vide textuel dans `.rev-card` (pas de SVG Recharts) — le test vérifie la visibilité de `.rev-card`.
- Les inputs de l'éditeur d'emails templates portent la classe `.tpl-input` sans `type` explicite.
- L'avatar affiché se trouve sous `.prof-img img` (et pas `.pe-avatar`).
- Le texte "Jean Dupont"/"Alpha Co" apparaît en plusieurs endroits (feed d'activité + table) → les assertions sont scopées à `page.locator("table")`.

Aucun de ces ajustements n'a nécessité de changement produit.

---

## Tests manuels à faire par Morgan

Ces points sortent du scope automatisable et restent à valider manuellement avant toute release :

### Stripe (tarification réelle)
- [ ] `/subscribe` → bouton "Activer mon abonnement" → Stripe Checkout s'ouvre avec la bonne ligne (setup 29 € + abonnement 19 €/mois).
- [ ] Saisir la **carte test Stripe** `4242 4242 4242 4242` (date future, CVC 123) → retour sur `/app` avec bannière "Abonnement actif" verte.
- [ ] En étant Pro, cliquer "Gérer mon abonnement" → atterrir sur `billing.stripe.com/...` avec la bonne facture visible.
- [ ] Tester l'annulation depuis le portail → webhook `customer.subscription.deleted` fait repasser en non-Pro au prochain refresh.

### Emails (sandbox Resend en place)
- [ ] Ouvrir Gmail `morgan.ponsquillet@gmail.com` et vérifier :
  - [ ] Réception du **welcome email** après signup (expéditeur Resend, sujet français, bouton "Commencer maintenant").
  - [ ] Envoyer un devis daté d'il y a 3 jours + déclencher le cron `/api/cron/relances` manuellement → vérifier réception de la **J+3**.
  - [ ] Depuis `/app/parametres/emails` (Pro), cliquer **Envoyer un test** sur J+3, J+7, J+10 → 3 mails reçus avec les bons sujets et bodies custom.
- [ ] **Quand un domaine sera vérifié chez Resend** → retenter le signup d'un compte avec une adresse externe, vérifier que le welcome arrive et que le 500 de sandbox ne ressurgit pas côté utilisateur réel (le fix protège déjà contre le blocage).

### Cron Vercel
- [ ] Vérifier dans le dashboard Vercel que le cron quotidien est bien configuré sur `/api/cron/relances` avec `CRON_SECRET` en header.
- [ ] Lancer un run manuel depuis l'interface Vercel → consulter les logs pour `[cron relances] ... relances envoyées`.

### Navigateurs / responsive (non automatisé)
- [ ] Safari macOS + iOS Safari : ouvrir `/`, signup, dashboard, création de devis → s'assurer qu'aucune fuite CSS (Recharts, transitions, sélecteurs).
- [ ] Firefox desktop : idem.
- [ ] Mobile portrait 375 px : vérifier que le dashboard, le tableau des devis et le menu utilisateur sont utilisables.

### Données réelles
- [ ] Onboarder un vrai artisan bêta-testeur de bout en bout (signup → Stripe → 1 devis → 3 jours plus tard → relance reçue).

---

## Recommandations

### Court terme (avant la prochaine release)
1. **Vérifier un domaine chez Resend** pour sortir du mode sandbox. Tant que ce n'est pas fait, aucun welcome ni aucune relance n'est réellement envoyée aux clients des artisans. Le fix du bug #1 évite le blocage technique, mais il ne restaure pas la valeur métier du produit.
2. **Ajouter un test CI GitHub Actions** qui exécute `npx playwright test` sur chaque PR. Le `playwright.config.ts` actuel démarre `npm run dev` automatiquement (`reuseExistingServer: true` en local), donc il suffit d'exécuter `playwright test` avec les secrets Supabase/Stripe en test mode injectés.
3. **Exposer `CRON_SECRET` en dev .env.local** (c'est déjà le cas) pour que le test "Cron with auth" passe ailleurs que chez toi. Sinon il skip silencieusement.

### Moyen terme
4. **Instrumenter le signup côté client** pour appeler `/api/auth/welcome` en non-bloquant (`fetch(...).catch(noop)`) — aujourd'hui le fix protège le serveur, mais un client qui attendrait cet appel pour redirect pourrait encore attendre un `200` fictif. Revoir là où il est consommé.
5. **Ajouter une couverture de test pour le webhook Stripe** (`/api/stripe/webhook`) en simulant `checkout.session.completed` / `invoice.paid` avec la CLI `stripe listen` ou un mock. Aujourd'hui le passage à Pro est testé via une route admin (`markSubscriptionPaid`) qui bypasse toute la logique webhook — c'est rapide mais non-fidèle.
6. **Attribut `htmlFor` sur les labels** de `/login` et `/signup` (A11y + rend les tests plus robustes à `getByLabel`). Pas bloquant.
7. **Nettoyer `tests/fixtures/avatar.png`** qui est généré à la volée si absent, puis committé — on peut soit le supprimer et le régénérer à chaque run, soit enlever le code de génération. Détail esthétique.

### Long terme
8. **Monitoring des crons** en production : logger sur Sentry ou Axiom combien de relances sont envoyées chaque jour, et alerter si le cron n'a pas tourné depuis > 25 h.
9. **Tests visuels** (Playwright `toHaveScreenshot`) sur la landing et le dashboard pour détecter les régressions CSS — la V4 a ajouté beaucoup d'animations, un diff visuel éviterait une régression silencieuse.

---

## Annexes

### Commandes utiles

```bash
# tous les tests
npx playwright test

# un seul fichier
npx playwright test emails.spec.ts

# un seul test par ligne
npx playwright test emails.spec.ts:17

# mode UI interactif
npx playwright test --ui

# rapport HTML après échec
npx playwright show-report tests/playwright-report
```

### Variables d'env requises
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — indispensable pour bootstrap des users de test
- `CRON_SECRET` — facultatif, sinon le test cron+auth skippe

Le fichier `playwright.config.ts` lit `.env.local` tout seul, donc aucune action supplémentaire.

### Artefacts
- Rapport HTML : `tests/playwright-report/index.html`
- Traces/vidéos d'échec : `tests/test-results/` (git-ignorés)
