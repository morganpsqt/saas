# Maya — coach fitness & nutrition IA (beta locale)

App Expo (iOS + Android + Web) qui tourne **100 % en local** :
- dossier médical + nutrition + training collecté à l'onboarding (SQLite),
- chat coach alimenté par **Gemini 2.5 Flash** — OU par un **mock réaliste** si aucune
  clé API n'est fournie,
- bibliothèques d'exercices (wger) et de recettes (TheMealDB) gratuites,
- mini-encyclopédie de 18 articles rédigés localement,
- tracking quotidien (eau, sommeil, énergie, poids),
- chat contextuel depuis n'importe où (bouton « Demander à Maya »).

## Lancer l'app

```bash
cd coach-ia-beta
npm install --legacy-peer-deps
npx expo start --web    # ou --ios / --android / scan QR avec Expo Go
```

À la première ouverture : onboarding 5 étapes → dashboard. Un bandeau **« Mode démo
(sans API) »** apparaît dans le chat tant que la clé Gemini n'est pas définie.

## Activer Gemini (quand tu as ta clé)

1. Va sur <https://aistudio.google.com/apikey>
2. Connecte-toi avec un compte Google (quota gratuit très large).
3. **Create API key** → copie la clé.

Dans le dossier `coach-ia-beta/`, crée un fichier `.env.local` :

```env
EXPO_PUBLIC_GEMINI_API_KEY=ta-cle-ici
```

Puis redémarre Expo (`Ctrl+C` puis `npx expo start --web`). C'est tout — le wrapper
détecte automatiquement la clé et bascule du mock vers Gemini.

## Tester sur téléphone

1. Installe **Expo Go** sur ton téléphone (App Store / Play Store).
2. `npx expo start` → un QR code s'affiche.
3. Scanne-le. L'app et ton téléphone doivent être sur le même Wi-Fi.

## Navigation

L'app a **6 onglets** :

- **🏠 Accueil** : greeting, tip du jour (rotation sur 30 tips), tracker habitudes
  (eau/sommeil/énergie/poids), actions rapides, 1 exo + 1 recette random du jour,
  bloc progression.
- **💬 Maya** : chat coach, bandeau mode démo, supporte `prefill` via query param.
- **🏋️ Exercices** : bibliothèque wger, recherche + filtres (groupe musculaire,
  équipement), grille 2 cols, lazy-load 20 par 20, favoris ❤️.
- **🍽️ Recettes** : bibliothèque TheMealDB, recherche + catégories, favoris ❤️.
- **📚 Savoir** : 18 articles classés en 5 catégories (corps, nutrition, training,
  lifestyle, mindset), barre de progression, marquage « Lu ».
- **👤 Profil** : dossier médical visible, statut mode IA, vider cache API,
  reset DB.

## Structure

```
coach-ia-beta/
├── app/
│   ├── (onboarding)/          # 5 étapes
│   ├── (tabs)/                # 6 onglets
│   ├── exercise/[id].tsx      # détail exercice
│   ├── recipe/[id].tsx        # détail recette
│   └── knowledge/[slug].tsx   # détail article
├── lib/
│   ├── ai/                    # gemini.ts + mock.ts + system-prompt + red-flags
│   ├── api/                   # cache.ts (SQLite) + wger.ts + themealdb.ts
│   ├── content/               # knowledge-articles.ts + daily-tips.ts
│   ├── db/                    # schema.ts + queries.ts + queries-v2.ts
│   └── store/                 # Zustand user-store
├── components/
│   ├── Cards/                 # ExerciseCard, RecipeCard, KnowledgeCard
│   ├── Dashboard/             # DailyTipCard, HabitsTracker, QuickActions
│   └── Common/                # FilterChips, Skeleton
└── package.json
```

## Règles de sécurité (toujours actives)

- **TCA** (anorexie, boulimie, purge, mots-clés de dégoût) → stop coaching de sèche,
  numéro d'aide (0 810 037 037 en France).
- **Perte > 1 % du poids/sem** → refus motivé, propose 0,5–0,75 %/sem.
- **Mineur + objectif restriction** → refus du déficit.
- **Grossesse / allaitement** → aucun déficit.
- **Médicaments sensibles** → flag injecté dans le contexte.

Red flags calculés à la fin de l'onboarding → stockés en JSON dans `medical_profile.red_flags` → ré-injectés à chaque conversation.

## APIs externes utilisées (gratuites, sans clé)

- **wger** — `https://wger.de/api/v2/` pour les exercices + images.
- **TheMealDB** — `https://www.themealdb.com/api/json/v1/1/` pour les recettes.
- **Picsum** — placeholder images si image manquante.

Toutes les réponses sont cachées dans SQLite (`api_cache`) : 24 h pour les listes,
7 jours pour les détails. Le bouton « Vider le cache API » dans Profil force un
rechargement.

## Réinitialiser la DB

Profil → « Réinitialiser la DB ». Efface profil, messages, favoris, tracking, articles lus, cache API.
