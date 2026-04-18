# Questions pour l'utilisateur

Points bloquants ou décisions que Claude Code n'a pas pu résoudre sans vous. Traitez-les dans l'ordre.

---

## 🔴 Bloquants avant mise en prod

### 1. Clé Supabase `service_role`
Le webhook Stripe et le cron quotidien nécessitent la clé **service_role** de Supabase (lecture/écriture admin, bypass RLS).

**Action** :
1. Supabase → Settings → API → `service_role secret`.
2. Ajouter dans Vercel (Settings → Environment Variables) : `SUPABASE_SERVICE_ROLE_KEY=eyJ...`
3. Redéployer.

Sans cette clé : le webhook ne peut pas mettre à jour la table `subscriptions` et le cron ne peut pas récupérer l'email des artisans.

---

### 2. Compte Stripe — produits et webhook
Rien n'est pré-configuré côté Stripe. Voir `STRIPE_SETUP.md` pour la procédure complète. À la fin, vous devez avoir ces 5 variables sur Vercel :

```
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_PRICE_SETUP=price_...
STRIPE_PRICE_MONTHLY=price_...
```

---

### 3. Trigger Supabase subscriptions
Le trigger qui crée automatiquement la subscription en trial sur chaque nouvel inscrit **n'est pas encore appliqué en base**. Vous devez exécuter le fichier SQL :

**Action** : Supabase → SQL Editor → coller le contenu de `supabase/subscriptions.sql` → Run.

Ce script est idempotent (il peut être rejoué sans casser quoi que ce soit).

---

### 4. Expéditeur Resend
Actuellement, les emails partent depuis `onboarding@resend.dev` (expéditeur par défaut de Resend pour tests). Pour la prod :

- Voulez-vous utiliser `relances@relya.fr` comme expéditeur ?
- Si oui, avez-vous déjà acheté le domaine `relya.fr` ?
- Si non, quel domaine avez-vous prévu ? (`relya.app`, `relya.io`, `monbiz.fr`, …)

**À faire ensuite** : configurer le domaine sur Resend et changer le `from` dans `lib/emails/send.ts:1`.

---

### 5. Nom légal de l'éditeur
La page `/mentions-legales` contient des placeholders `[à compléter]`. Avant d'ouvrir le service commercialement, il faut :

- Statut juridique (auto-entrepreneur, SASU, EURL, etc.) ?
- SIREN / SIRET ?
- Adresse du siège ?
- Directeur de publication (vous ?) ?

---

## 🟡 Décisions à trancher

### 6. Email de support / contact
Les pages légales et emails font référence à `contact@relya.fr`. Cet email existera-t-il ? Sur quelle boîte le rediriger ? (Gmail perso, Google Workspace, ProtonMail…)

### 7. Pages légales — juriste
Les 3 pages légales (`/cgu`, `/mentions-legales`, `/politique-confidentialite`) sont des **modèles provisoires** rédigés en français correct mais sans validation juridique.

- Les utiliser telles quelles au lancement ?
- Les faire relire par un juriste (Legalstart, Captain Contrat, avocat) ?

Recommandation : validation juridique avant toute activité commerciale, surtout pour les CGU (engage la responsabilité de l'éditeur).

### 8. Mode Stripe pour le premier déploiement
Voulez-vous :
- (a) Déployer d'abord en **mode Test** Stripe, faire tester quelques utilisateurs gratuits sans vraie facturation, puis passer en Live ?
- (b) Passer directement en **Live** dès la mise en prod ?

Recommandation : (a). Tester au moins 2-3 flows complets en Test avant Live.

### 9. Prix — confirmer
Le code et les pages sont câblés sur **29 € one-shot + 19 €/mois + 14 jours d'essai gratuit**. Est-ce bien le pricing final ? (si vous changez, il faut modifier le code + recréer les produits Stripe).

### 10. Témoignages
La landing montre 3 témoignages marqués *exemple*. Voulez-vous :
- Les laisser marqués *exemple* tant que vous n'avez pas de vrais clients.
- Les retirer complètement.
- Les remplacer dès que vous avez des retours d'utilisateurs réels.

---

## 🟢 Non-bloquants mais à prévoir rapidement

### 11. Analytics
Aucun tracking n'est installé. Options :
- Vercel Analytics (intégration en 1 clic, gratuit jusqu'à 2500 events/mois).
- Plausible / Umami (RGPD-friendly, 9-19 €/mois).
- PostHog (analytics + feature flags, gratuit jusqu'à 1M d'events).

### 12. Monitoring erreurs
Pas de Sentry ou équivalent installé. À mettre dès que vous dépassez 10 utilisateurs payants.

### 13. Onboarding post-signup
Aujourd'hui, dès qu'un utilisateur signe, il arrive direct sur le dashboard vide. Voulez-vous ajouter :
- Un tutoriel rapide (3 slides) ?
- Un devis d'exemple pré-créé pour qu'il voie l'UI avant d'ajouter le sien ?
- Un email de bienvenue automatique ?

### 14. Facturation comptabilité
Stripe génère les factures automatiquement. Pour l'expert-comptable :
- Activez dans Stripe : Settings → Invoices → activer la numérotation de factures client.
- Prévoyez l'export mensuel des paiements pour la compta.

---

## 📝 Notes diverses

- Le dev server local nécessite que les variables Supabase soient dans `.env.local`. Ce fichier n'est pas commité.
- `.gitignore` ignore désormais `node_modules/`, `.next/`, `.env.local`, `.vercel`.
- Le cron Vercel tourne tous les jours à 8h (configuré dans `vercel.json`).
- La landing n'a pas de CAPTCHA sur le signup → à prévoir si vous avez des bots.
