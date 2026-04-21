# Checklist de lancement — Relya

Morgan, **tu peux vendre Relya dès que TOUT ce qui suit est fait**. L'app est
techniquement prête, il reste les trucs qui nécessitent ton intervention
humaine (domaine, statut juridique, DNS).

## 🔑 Configuration comptes & domaine

- [ ] **Acheter le domaine** `relya.fr` (OVH, Gandi, ou Cloudflare Registrar ≈ 10 €/an)
- [ ] **Connecter le domaine à Vercel** : Vercel → Project → Settings → Domains
      → Add Domain → suivre les instructions DNS (A/CNAME)
- [ ] Mettre à jour `NEXT_PUBLIC_APP_URL=https://relya.fr` sur Vercel (Production)
- [ ] Tester que <https://relya.fr> charge bien la landing après propagation DNS

## 📧 Emails de production (Resend)

- [ ] Ajouter le domaine `relya.fr` dans Resend → Domains → Add Domain
- [ ] Configurer les DNS chez ton registrar selon Resend :
  - `MX`, `TXT` (SPF), `CNAME` (DKIM), `TXT` (DMARC)
- [ ] Attendre la validation (quelques minutes à 24 h)
- [ ] Remplacer sur Vercel : `RESEND_FROM=Relya <noreply@relya.fr>`
- [ ] Test d'envoi manuel depuis Resend → Send email → doit arriver dans ta
      boîte Gmail

## 💳 Stripe en mode LIVE

- [ ] **Statut juridique créé** (auto-entrepreneur minimum) — requis par Stripe
      pour activer le mode live
- [ ] Dashboard Stripe → Activate your account → renseigner SIRET, adresse,
      coordonnées bancaires
- [ ] Créer les produits en mode LIVE :
  - [ ] "Frais d'installation Relya" → 29 € one-shot → noter le `price_...`
  - [ ] "Abonnement Relya" → 19 €/mois récurrent → noter le `price_...`
- [ ] Créer le webhook endpoint LIVE :
  - URL : `https://relya.fr/api/stripe/webhook`
  - Events : `checkout.session.completed`, `customer.subscription.created`,
    `customer.subscription.updated`, `customer.subscription.deleted`,
    `invoice.payment_failed`
  - Noter le `whsec_...` live
- [ ] Remplacer sur Vercel (Production) :
  - `STRIPE_SECRET_KEY=sk_live_...`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
  - `STRIPE_WEBHOOK_SECRET=whsec_...` (celui du endpoint live)
  - `STRIPE_PRICE_SETUP=price_...` (live)
  - `STRIPE_PRICE_MONTHLY=price_...` (live)
- [ ] Test de paiement réel avec une vraie carte à toi (2 €, tu te rembourses
      ensuite) pour valider que le flow passe

## 🧪 Tests manuels à faire toi-même

Les tests automatisés ne peuvent pas tout couvrir. Avant de communiquer, fais :

- [ ] **Parcours nouveau client sur mobile** (iPhone ou Android réel) :
  landing → signup → dashboard → ajout devis → changement statut → paiement
- [ ] **Test Gmail / Outlook / iCloud** : l'email de bienvenue arrive bien et
      ne tombe pas en spam
- [ ] **Test cron** : créer un devis daté de -3 jours en DB, vérifier que
      l'email de relance part (attendre le passage cron Vercel, ou l'appeler
      manuellement avec le `CRON_SECRET`)
- [ ] **Test Portail Stripe** : une fois un vrai compte Pro créé, cliquer
      "Gérer mon abonnement" → doit ouvrir le portail Stripe
- [ ] **Test annulation** : simuler une annulation depuis le portail Stripe →
      l'UI doit refléter le changement de statut après quelques secondes

## 📝 Contenu à finaliser

- [ ] **Pages légales** : CGU, mentions légales, politique de confidentialité —
      les versions actuelles sont des placeholders, pas valides juridiquement.
      Soit rédiger avec un juriste, soit utiliser un générateur type Legalstart
      (~100 €)
- [ ] **Témoignages** : les 3 actuels sur la landing sont fictifs. Remplacer
      par des vrais dès que tu as des clients pilotes (citation + prénom +
      métier)
- [ ] **Métriques landing** (ex. "1 247 devis relancés") : fictives, à remplacer
      par des vraies au premier milestone

## 🎨 Améliorations UX (optionnelles, post-lancement)

- [ ] Ajouter une image OG 1200×630 dans `public/og.png` (actuellement non
      définie, Twitter/FB utilisent le rendu par défaut)
- [ ] Page `/contact` avec un vrai formulaire (mailto: pour l'instant)
- [ ] Onboarding interactif (tour guidé) pour les premiers devis

## 📊 Monitoring & observabilité

- [ ] Activer **Vercel Analytics** (gratuit, 1 clic)
- [ ] Configurer **Sentry** quand tu passes 10 utilisateurs (tier gratuit
      suffit : 5k events/mois)
- [ ] **Google Search Console** : ajouter `relya.fr`, soumettre le sitemap
      `https://relya.fr/sitemap.xml`
- [ ] **Plausible ou Umami** pour les analytics (Vercel Analytics suffit au
      début)

## 🚀 Go / No-Go du lancement

Quand tout ce qui suit est coché, tu peux communiquer publiquement :

- [ ] `relya.fr` accessible en HTTPS
- [ ] DNS Resend validé, 1 email de test bien reçu dans Gmail
- [ ] Stripe en mode LIVE, 1 paiement réel réussi et remboursé
- [ ] Statut juridique en règle (auto-entrepreneur minimum)
- [ ] Pages légales validées
- [ ] 1 test mobile complet réussi

**Une fois tout ça fait : go. L'app est prête, le reste est ton travail.**
