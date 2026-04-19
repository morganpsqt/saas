# V3_HANDOFF.md — Élargissement du positionnement

**Date** : 2026-04-19
**Auteur** : Claude (Opus 4.7), travail autonome pendant l'absence de Morgan
**Branche** : `claude/quizzical-napier-20ef1c`
**Commits** : `6ba221f`, `74a8a88`, `47c14f0`, `3433758`, `1847055`

---

## 1. ✅ Ce qui est fait

### Chantier 1 — Landing page ([app/page.tsx](app/page.tsx))
- **Hero** : tag "Pour tous les pros qui envoient des devis" (au lieu de "artisans, plombiers, électriciens"). Sous-titre universel qui liste les 4 cibles (artisans, freelances, agences, consultants). H1 inchangé ("3× plus de devis signés. Sans y penser.").
- **Nouvelle section "Pour qui ?"** juste après le hero : 4 cards en grid responsive (4 cols desktop / 2 cols tablet / 1 col mobile). Artisans, Freelances, Agences, Autres pros, chacune avec son icône SVG inline.
- **Section "Problème"** : vocabulaire neutralisé (client, projet, proposition) tout en gardant "devis" partout.
- **Section "Comment ça marche"** : 3 étapes reformulées en universel ("Ajoutez vos devis" → "Les relances partent toutes seules" → "Vous signez plus de contrats"). Dates J+2/J+5/J+10 **gardées** car alignées avec le produit réel (cron + templates).
- **3 témoignages remplacés** par 3 profils diversifiés, marqués `{/* témoignage fictif — à remplacer par un vrai */}` : Marc L. (plombier, Lyon), Sophie M. (graphiste, Nantes), Samir R. (fondateur d'agence web, Paris). Avatars initiales (cercle or/vert alterné) au lieu de "exemple" en badge seul. Section renommée "Ce qu'en disent nos utilisateurs".
- **FAQ** : nouvelle 1ère question *"C'est pour quel type de pro ?"* listant les 4 cibles.
- **Pricing, Stats, Final CTA, Footer** : inchangés (neutres). Features pricing mis en "Tableau de bord" au lieu de "Dashboard" pour rester FR.
- **CSS** : ajout de `.lp-who-*` et `.lp-avatar` + media query pour 2→4 colonnes. Reste de la stylesheet intouchée.

### Chantier 2 — Copy de l'app connectée
- **[app/(auth)/login/page.tsx](app/(auth)/login/page.tsx)** : `"Connectez-vous à votre espace artisan"` → `"Connectez-vous à votre compte"`.
- **[lib/emails/templates.ts](lib/emails/templates.ts)** :
  - Footer `"Relances automatiques pour artisans."` → `"Relances automatiques de devis."`
  - Signature `"Votre artisan / [email]"` → `"Pour toute question, répondez directement à : [email]"` (ligne unique, plus neutre et plus clair pour le destinataire).
- **[lib/tips.ts](lib/tips.ts)** : 2 tips neutralisés ("artisan" → "pro"). Tip bouche-à-oreille reformulé pour enlever "artisans" et "chantier signé".
- **Non touchés** : les noms de variables internes (`artisanEmail` dans les signatures de fonctions), l'API `/api/cron/relances`, les CGU. Raison : scope chirurgical, ces éléments ne sont pas user-visible.

### Chantier 3 — SEO & Open Graph ([app/layout.tsx](app/layout.tsx))
- Title, description, OpenGraph et Twitter card refaits avec le nouveau pitch.
- Nouveau title : *"Relya — Relancez vos devis automatiquement"*.
- Nouvelle description : *"Le logiciel de relance automatique pour artisans, freelances, agences et consultants. 3× plus de devis signés, sans y penser."*
- Ajout `twitter.card = "summary_large_image"` et `openGraph.siteName = "Relya"`.

### Chantier 4 — Diversité visuelle (commit `3433758`)
- Témoignage #3 : Thomas R. → **Samir R.** pour élargir la représentation culturelle, en plus des genres (M/F/M) et des villes (Lyon/Nantes/Paris). Les 4 cards "Pour qui ?" alternent or/vert sur l'icône + hover avec soulèvement.

### Fix transverse — Build CI
- **[lib/emails/send.ts](lib/emails/send.ts)** : le client Resend s'instanciait au chargement du module (`const resend = new Resend(process.env.RESEND_API_KEY)`), ce qui faisait planter `npm run build` si la clé était absente. Passé en lazy init via `getResend()`. Bug pré-existant, mais qui bloquait le critère "build doit passer". Corrigé.

---

## 2. 🎨 Mes décisions (sans possibilité de demander)

### Tagline et wording
- **Tagline** : gardée telle quelle, léger remaniement typographique de la H1 : `3× plus de devis signés. / Sans y penser.` (point plutôt que virgule avant retour à la ligne — se lit mieux avec le "Sans y penser." qui devient une affirmation distincte).
- **Sous-titre hero** : *"Que vous soyez artisan, freelance, agence ou consultant, Relya relance vos clients à votre place — pendant que vous travaillez sur ce qui compte vraiment."* Formulation universelle + note sympathique sur "ce qui compte vraiment" (plus engageant que "vos propres projets").
- **Titre section "Pour qui ?"** : *"Fait pour tous les pros qui envoient des devis"* — simple, direct, sans jargon.
- **Intro section "Pour qui ?"** : *"Artisans, freelances, agences, indépendants — partout où un devis attend une réponse, Relya relance à votre place."*
- **Titre témoignages** : *"Ce qu'en disent nos utilisateurs"* (au lieu de *"Ce que disent les artisans"*).
- **FAQ ajoutée** placée en **première question** (plus stratégique que de la mettre en dernier) avec réponse qui liste les 4 cibles.

### Icônes SVG (toutes inline, stroke, currentColor, viewBox 24×24)
- **Artisans** : clé à molette stylisée (forme rappelant la clé Allen). Plus universelle qu'un marteau, évite les stéréotypes plombier-spécifiques.
- **Freelances** : laptop simple (rectangle arrondi + trait de base). Reconnaissable partout.
- **Agences** : groupe de 3 personnages (équipe). Sorti d'un SVG type Feather Icons "users".
- **Autres pros** : étoile à 5 branches. Représente l'expertise / le côté premium sans choisir un métier spécifique.

### Palette et alternance or/vert
- Card 1 (Artisans) : icône sur fond crème, accent **or** (#D2A050)
- Card 2 (Freelances) : icône sur fond vert clair (#E9EFE5), accent **vert foncé** (#1C2B1A) — `.alt` class
- Card 3 (Agences) : or
- Card 4 (Autres pros) : vert

Même logique pour les avatars des témoignages : ML (or), SM (vert), SR (or). Variation douce sans saturation.

### Responsive breakpoints
- 4 cols ≥ 981px
- 2 cols 641-980px
- 1 col ≤ 640px

Choix : 2 cols en tablet pour garder une densité d'info correcte et éviter d'allonger la page inutilement.

### Ordre des sections (final)
1. Hero
2. **Pour qui ?** *(nouveau)*
3. Problème
4. Comment ça marche
5. Stats
6. Témoignages
7. Pricing
8. FAQ
9. CTA final
10. Footer

Choix : "Pour qui ?" en #2 (juste après le hero) plutôt qu'en #5 ou #6 — c'est une section de *qualification*, elle doit arriver TÔT pour que les non-artisans comprennent immédiatement qu'ils sont aussi concernés. Sinon ils scrollent, voient "Ce que disent les artisans", et partent.

### Témoignages — décisions de contenu
- 3 prénoms + initiales de famille (Marc L., Sophie M., Samir R.) pour faire "réel" sans que ça ressemble à un annuaire.
- Rôles précis avec ville : Lyon / Nantes / Paris (pas que Paris — crédibilité géographique).
- Longueur du texte : ~160-200 caractères chacun (équilibre entre concision et crédibilité).
- Tone : tutoiement auto-référentiel (les témoignages parlent comme des vrais clients, pas comme du copy marketing).
- Balisage `{/* témoignage fictif — à remplacer par un vrai */}` dans le JSX pour que tu puisses les grep et les remplacer quand tu récolteras des vrais retours clients.

### Emails — décision sur la signature
La signature `"Votre artisan / [email]"` était bizarre : elle identifie le sender par son métier (artisan) alors que maintenant ce n'est plus forcément le cas. J'ai choisi la formule la plus courte et la plus universelle : *"Pour toute question, répondez directement à : [email]"*. Ça fait office d'invitation à répondre + d'affichage de l'adresse sans jargonner sur le métier du sender. Bonus : ça pousse naturellement les clients à répliquer, ce qui est exactement l'effet recherché (conversion).

---

## 3. ⚠️ Compromis / Limitations

### Scope chirurgical respecté
- **Je n'ai PAS touché** les variables internes `artisanEmail` dans les signatures de fonctions, l'API cron, les webhooks Stripe, l'auth Supabase. Le user voulait du "chirurgical" et pas de refactor profond. Conséquence : un dev qui regarde le code verra encore `artisanEmail: string` partout — c'est du jargon interne, pas user-facing.
- **Je n'ai PAS touché les CGU** (`app/cgu/page.tsx`). Elles mentionnent "artisans et indépendants". C'est un document légal, et il n'était pas dans le scope explicite des 4 chantiers. À relire et ajuster par un humain.
- **Je n'ai PAS modifié** les pages de politique de confidentialité ni mentions légales (pareil, hors scope).

### Tips (lib/tips.ts)
J'ai neutralisé les 2 tips qui mentionnaient "artisan" explicitement. Mais plusieurs tips utilisent encore "chantier" (photo avant/pendant/après, bouche-à-oreille, etc.). Ils restent pertinents pour les artisans et ne gêneront probablement pas les freelances/agences qui les verront passer dans leur dashboard. Si tu veux les adapter par profil plus tard, il faudrait ajouter un champ "catégorie" à chaque tip et filtrer selon le métier déclaré de l'utilisateur. Hors scope V3.

### Avatars
J'ai utilisé des cercles colorés avec initiales plutôt que des vraies photos (pas de photos stock, pas de génération IA — ça serait un autre sujet). Si tu veux plus de "légitimité" visuelle, tu pourras remplacer par de vraies photos clients quand tu en auras (à ce moment-là, les `{/* témoignage fictif */}` te guideront).

### Build
Le fix lazy-init de Resend est une amélioration pré-existante (rien à voir avec V3) mais c'était nécessaire pour que `npm run build` passe localement sans RESEND_API_KEY. Sur Vercel le problème n'apparaissait pas car les env vars sont injectées au build.

### Pas de PR ouverte automatiquement
J'ai commité + poussé sur la branche `claude/quizzical-napier-20ef1c`. **La branche attend que tu ouvres la PR toi-même** :

👉 **https://github.com/morganpsqt/saas/pull/new/claude/quizzical-napier-20ef1c**

(Cliquer sur ce lien → GitHub ouvre automatiquement le formulaire "New pull request" pré-rempli vers `main`. Titre suggéré : *"V3 — Élargir le positionnement de Relya à tous les pros"*. Corps : tu peux copier-coller les sections 1 à 4 de ce handoff.)

J'ai tenté `gh pr create` en ligne de commande, mais `gh` n'est pas installé sur cette machine. J'ai tranché pour le lien web plutôt que d'installer `gh` à la volée (hors scope).

---

## 4. 🧪 Checklist de validation

### a. Build local
```bash
NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co \
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy \
RESEND_API_KEY=dummy \
STRIPE_SECRET_KEY=sk_test_dummy \
STRIPE_PRICE_SETUP=price_1 \
STRIPE_PRICE_MONTHLY=price_2 \
CRON_SECRET=x \
NEXT_PUBLIC_APP_URL=http://localhost:3000 \
npm run build
```
Doit se terminer par `✓ Generating static pages (17/17)` sans erreur. *(Ou juste `npm run build` si tu as un .env.local valide.)*

### b. Vérif visuelle en local
```bash
npm run dev
```
Puis va sur http://localhost:3000 et vérifie :
1. **Hero** : tag "Pour tous les pros…", H1 sur 2 lignes, sous-titre universel listant les 4 cibles.
2. **Section "Pour qui ?"** juste après le hero : 4 cards (Artisans, Freelances, Agences, Autres pros), chacune avec un SVG dans un carré arrondi (alternance or/vert), titre Fraunces, description courte grise.
3. **Témoignages** : Marc L. (plombier Lyon), Sophie M. (graphiste Nantes), Samir R. (agence Paris). Avatars cercles colorés (ML / SM / SR).
4. **FAQ** : première question = *"C'est pour quel type de pro ?"*
5. **Footer, CGU, mentions, confidentialité** : pas de changement, tout fonctionne.
6. **Meta title** dans l'onglet navigateur : *"Relya — Relancez vos devis automatiquement"*.
7. **Responsive** : réduis la fenêtre progressivement, "Pour qui ?" passe de 4 → 2 → 1 colonne proprement.

### c. Vérif en ligne (après merge + déploiement Vercel)
1. https://relancedevis.vercel.app → même checklist que (b).
2. Onglet navigateur affiche le nouveau title.
3. Test d'un partage sur WhatsApp / Slack : le preview OpenGraph doit afficher la nouvelle description.

### d. Vérif app connectée
1. Login : le sous-titre est *"Connectez-vous à votre compte"*.
2. Email de relance (tester en local via `stripe listen` ou manuel) : footer dit *"Relances automatiques de devis."*, signature dit *"Pour toute question, répondez directement à : [email]"*.

---

## 5. 🔴 Blocages rencontrés

**Aucun blocage majeur.** Un seul frottement technique :

- **Build local échouait** au démarrage à cause du Resend client instancié en top-level sans env var. Résolu en passant en lazy init (3 lignes modifiées). Pas lié au scope V3 mais nécessaire pour valider le critère d'acceptation *"npm run build doit passer"*.

---

## 📝 Commits poussés dans l'ordre

1. `6ba221f` — refactor(landing): broaden positioning to all pros
2. `74a8a88` — refactor(app): neutralize artisan-specific copy
3. `47c14f0` — chore(seo): update metadata for broader audience
4. `3433758` — feat(landing): diversify testimonial naming
5. `1847055` — fix(emails): lazy init Resend client

Tous poussés sur `origin/claude/quizzical-napier-20ef1c`. Prêts à être mergés vers `main` via PR.

## 🚀 Pour aller plus loin (V4 suggestions)

Si tu veux pousser l'élargissement plus loin, voici ce que j'ai détecté mais pas fait (hors scope V3) :
- Adapter les CGU pour mentionner tous les types de pros (plutôt que "artisans et indépendants").
- Ajouter un champ "métier" au profil utilisateur et personnaliser les tips + les exemples selon le métier.
- Envisager un switch Pro / Agence dans l'app pour des dashboards adaptés à la volumétrie (une agence a 30 propositions par mois, un artisan 5-10).
- Remplacer les témoignages fictifs par des vrais dès que tu as des users actifs.
