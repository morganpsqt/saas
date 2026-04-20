# V4 — Handoff

## ✅ Ce qui est fait

**Chantier 1 — Personnalisation des emails de relance (Pro)**
- Page `/app/parametres/emails` : éditeur 2 colonnes + preview live, 3 onglets J+3 / J+7 / J+10.
- Variables cliquables : `{nom_client}`, `{montant}`, `{date_envoi}` (+ signature).
- API `GET/POST/DELETE /api/email-templates` — 402 si non Pro sur POST.
- API `POST /api/email-templates/test` — envoie un email `[TEST]` à l'utilisateur.
- Cron `/api/cron/relances` lit les templates custom avec fallback sur les défauts de `lib/emails/templates.ts`.
- SQL : `supabase/email_templates.sql` (idempotent, RLS "Users manage own templates").

**Chantier 2 — Profil utilisateur**
- Page `/app/parametres/profil` : `display_name`, `company_name`, `phone`, `contact_email`, avatar (upload Storage, 2 Mo max).
- Bucket `avatars` public-read + 4 RLS policies (path `${user.id}/…`).
- `display_name` utilisé dans `DashboardGreeting` + signature des emails de relance.
- `UserMenu` (avatar + dropdown) remplace le bouton "Déconnexion" dans le header du dashboard.
- SQL : `supabase/profiles.sql` (table + bucket + policies, idempotent).

**Chantier 3 — Onboarding**
- `OnboardingWizard` : modale 3 étapes au premier login, gated par `profiles.has_seen_onboarding`.
- Email de bienvenue via Resend (idempotent via `profiles.welcome_email_sent`), déclenché au signup + au montage du wizard.
- Rappels de fin d'essai à J-3 et J-1 intégrés dans le cron existant.

**Chantier 4 — Landing polish**
- `ScrollReveal` + `AnimatedCounter` + `DashboardMockup` (CSS-only, responsive).
- Hero 2 colonnes desktop, mockup masqué sous 960px.
- Stats `3× / 0 min / 2 min` animées au scroll.

**Chantier 5 — Dashboard polish**
- `DevisTableContainer` : recherche, filtre statut, tri (date / client / montant / statut).
- `DashboardShortcuts` : **N** nouveau devis, **E** export CSV (Pro), **?** aide, **Esc** ferme la modale.

**Build** : `npm run build` passe (21 routes générées, 0 erreur TS).

## ⏸️ Ce qui n'est pas fait

- Pas de tests automatisés ajoutés (V4 était une couche UX sans harness de test).
- Pas de detection/throttling sur l'API de test d'email (un utilisateur Pro peut spammer `POST /api/email-templates/test` sur son propre inbox — acceptable pour V4).
- Le cron `trial-reminders` réutilise le job `/api/cron/relances` existant — s'il y a déjà un cron séparé configuré côté Vercel, pas besoin d'en ajouter un.
- Pas de compteur "X devis relancés cette semaine" sur la landing (jugé moins pertinent que le mockup + stats animées).

## 🎨 Décisions prises

- **Animations sans framer-motion** : IntersectionObserver + CSS transitions pures. Moins de deps, parfait pour le scope de ScrollReveal/Counter.
- **Mockup CSS-only** : aucune image, pas de ratio à gérer, reste net sur retina. Masqué sous 960px plutôt que réduit (il serait illisible).
- **Avatar path** : `${user.id}/avatar-${timestamp}.${ext}` avec `upsert: true` — empêche la collision + permet de garder une trace simple. Le policy RLS enforce `auth.uid() = (storage.foldername(name))[1]`.
- **Welcome email idempotent côté API** : le flag vit sur `profiles.welcome_email_sent`, pas sur un cookie. Le wizard peut être monté plusieurs fois sans doublon.
- **Commits groupés chantier 3** : les changements de `app/app/layout.tsx` (UserMenu + OnboardingWizard) sont dans le commit chantier 3 car c'est lui qui ajoute le wizard (la ligne UserMenu a été ajoutée en même temps, et séparer ne valait pas le coût).
- **Filtres par défaut "all"** : si un utilisateur a 0 devis correspondant aux filtres mais a bien des devis en base, on affiche un message "Aucun devis ne correspond à vos filtres" plutôt que l'empty-state d'onboarding (qui ferait croire qu'il n'a rien créé).

## ⚠️ Compromis

- **Email templates custom côté client** : l'éditeur envoie les templates au POST `/api/email-templates/test` en clair (pas depuis la DB). Cela permet à l'user de tester avant de sauvegarder — le compromis est que ce payload est "trusted" (un utilisateur ne peut de toute façon tester que sur son propre email).
- **V4 ne migre pas les utilisateurs existants** : si un user créé avant V4 a besoin d'un `profile`, la row est créée lazy à la première écriture. Pas de backfill.
- **Raccourci E quand pas Pro** : redirige vers `/subscribe` (plutôt que d'ignorer la touche). Décision UX : l'user a appuyé exprès, on ne fait pas du silence mystérieux.
- **Cron trial reminders = même endpoint que les relances** : évite de dupliquer le setup cron Vercel. Compromis : une seule fenêtre de run par jour détermine les deux. Acceptable.

## 🧪 Checklist Morgan

**Paramètres emails**
- [ ] `/app/parametres/emails` est verrouillé par le paywall pour un user en trial expiré.
- [ ] Éditer un template J+3, sauvegarder, recharger → contenu persiste.
- [ ] Cliquer sur une variable dans le panneau gauche l'insère dans le body.
- [ ] "Envoyer un test" → email `[TEST]` reçu avec les vars substituées (Jean Dupont / 1 500 € / date du jour).
- [ ] "Réinitialiser" remet le template par défaut affiché.
- [ ] Créer un devis de test avec une date d'envoi J-3, déclencher le cron → le template custom est utilisé.

**Profil**
- [ ] `/app/parametres/profil` charge avec email pré-rempli.
- [ ] Upload d'une image < 2 Mo → preview immédiat + persisté après reload.
- [ ] Upload > 2 Mo → toast d'erreur.
- [ ] Remplir `display_name`, sauvegarder → le header dashboard affiche le nom, `DashboardGreeting` aussi.
- [ ] Les emails de relance sont signés avec `display_name`.
- [ ] Menu user : clic avatar ouvre dropdown, clic extérieur ferme, déconnexion fonctionne.

**Onboarding**
- [ ] Créer un nouveau compte → wizard apparaît au premier login sur `/app`.
- [ ] Cliquer "Plus tard" puis "Terminer" ferme le wizard, refresh → il ne réapparaît pas.
- [ ] Vérifier l'email de bienvenue dans la boîte (sujet : "Bienvenue sur Relya…").
- [ ] Simuler un trial expirant dans 3 jours / 1 jour → rappel envoyé.

**Landing**
- [ ] Desktop ≥ 960px : mockup visible à droite du hero, stats `3× / 0 min / 2 min` s'animent au scroll.
- [ ] Mobile < 960px : mockup masqué, hero centré.
- [ ] Les sections problem/steps/testimonials/pricing/faq apparaissent en fade+slide au scroll.

**Dashboard polish**
- [ ] Dans `/app`, taper `n` hors input → redirigé vers `/app/devis/nouveau`.
- [ ] Taper `e` en étant Pro → CSV téléchargé. En non-Pro → redirigé vers `/subscribe`.
- [ ] Taper `?` → modale d'aide des raccourcis. `Esc` ferme.
- [ ] Filtre statut + recherche : les lignes se filtrent en live.
- [ ] Boutons de tri : flèche change de sens, ordre correct.

## 🗄️ SQL à exécuter

À passer une fois dans l'éditeur SQL Supabase (idempotents — `do $$ … if not exists … end $$`) :

```sql
-- 1. Templates d'emails (chantier 1)
\i supabase/email_templates.sql

-- 2. Profils + bucket avatars + policies Storage (chantier 2 + 3)
\i supabase/profiles.sql
```

Ou coller le contenu brut des deux fichiers dans la console SQL.

> Les deux fichiers sont idempotents : on peut les rejouer sans risque.

## 🔴 Blocages / à surveiller

- **Aucun blocage fonctionnel.** Build vert, 5 commits propres prêts à push.
- Le warning Next.js "multiple lockfiles" persiste (il y a un `package-lock.json` au niveau parent `/Users/morganpons-quillet/`). Cosmétique, non bloquant. Pour le faire taire : supprimer le lockfile parent OU ajouter `outputFileTracingRoot` dans `next.config`.
- Vérifier que la variable `RESEND_API_KEY` est bien en prod (sinon `sendWelcomeEmail` échoue silencieusement via le `.catch(() => {})` au signup).
- Le bucket `avatars` doit être créé — `supabase/profiles.sql` s'en charge via `storage.buckets` insert + policies, mais si un bucket portait déjà ce nom avec d'autres policies il faut les réconcilier.
