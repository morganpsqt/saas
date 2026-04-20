# Maya — coach fitness & nutrition IA (beta locale)

App Expo (iOS + Android + Web) qui tourne **100% en local** :
- dossier médical + nutrition + training collecté à l'onboarding (SQLite),
- chat coach alimenté par **Gemini 2.5 Flash** — OU par un **mock réaliste** si aucune
  clé API n'est fournie (tu peux tout tester sans rien payer).

## Lancer l'app

```bash
cd coach-ia-beta
npm install --legacy-peer-deps
npx expo start --web    # ou --ios / --android, ou scanner le QR code avec Expo Go
```

À la première ouverture : onboarding 5 étapes → chat avec Maya.
Un bandeau **« Mode démo (sans API) »** apparaît tant que la clé Gemini n'est pas définie.

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
2. `npx expo start` → un QR code s'affiche dans le terminal.
3. Scanne-le (appareil photo iOS, ou depuis Expo Go sur Android).

L'app et ton téléphone doivent être sur le même réseau Wi-Fi.

## Structure

```
coach-ia-beta/
├── app/                   # Expo Router (file-based)
│   ├── (onboarding)/      # 5 écrans : identité → medical → nutrition → training → goals
│   ├── (main)/            # chat.tsx, profile.tsx
│   └── _layout.tsx, index.tsx
├── lib/
│   ├── db/                # schema.ts (SQLite init) + queries.ts
│   ├── ai/                # gemini.ts (wrapper + fallback mock),
│   │                       mock.ts, system-prompt.ts,
│   │                       red-flags.ts, context-builder.ts
│   └── store/             # user-store.ts (Zustand)
├── components/            # ChatBubble, FormField, OnboardingStep
├── .env.example           # copie en .env.local + ajoute ta clé Gemini
└── package.json
```

## Ce que fait Maya (règles de sécurité)

Déjà câblées dans le system prompt + le mock :

- **TCA** (anorexie, boulimie, purge, mots-clés de dégoût de soi) → stop coaching de sèche,
  réponse empathique + numéro d'aide (0 810 037 037 en France).
- **Perte > 1% du poids/semaine** → refus motivé, propose 0,5–0,75 %/semaine.
- **Mineur + objectif de restriction** → refus du déficit.
- **Grossesse / allaitement** → aucun déficit.
- **Médicaments sensibles** (corticoïdes, chimio, antipsychotiques majeurs) → flaggé,
  injecté dans le contexte.

Les red flags sont calculés à la fin de l'onboarding, stockés en JSON dans
`medical_profile.red_flags`, puis ré-injectés dans le contexte de chaque conversation.

## Réinitialiser la DB

Dans l'écran **Profil** (lien en haut à droite du chat) → bouton
**« Réinitialiser la DB »** (rouge, en bas). Efface tout : profil, messages, objectifs.

## Notes techniques

- SQLite local via `expo-sqlite` (version web = WASM, version native = natif).
- Zustand pour l'état draft de l'onboarding.
- NativeWind (Tailwind) pour le styling cross-platform.
- Le wrapper IA (`lib/ai/gemini.ts`) lazy-load le SDK `@google/genai` seulement
  quand une clé est fournie, donc le mock reste ultra-léger.
