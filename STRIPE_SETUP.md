# Configuration Stripe pour Relya

Ce guide explique comment configurer Stripe pour encaisser les paiements de Relya (29 € d'installation + 19 €/mois avec 14 jours d'essai).

---

## 1. Créer un compte Stripe

1. Rendez-vous sur https://dashboard.stripe.com/register
2. Créez le compte en utilisant l'email de l'entreprise
3. Renseignez les informations légales demandées (SIREN, adresse, RIB)
4. Activez le compte (sans cela, vous ne pourrez encaisser qu'en mode test)

> 💡 Conseil : commencez en **mode test** (toggle en haut à droite du dashboard Stripe). Passez en **Live** uniquement après avoir testé le flow complet.

---

## 2. Créer les deux produits

Dans le dashboard Stripe : **Produits → + Ajouter un produit**.

### Produit 1 — Frais d'installation (one-shot)

- **Nom** : `Relya — Frais d'installation`
- **Description** : Frais de configuration de compte, facturés une seule fois.
- **Mode de facturation** : Paiement unique
- **Prix** : `29,00 €` (EUR)
- **Devise** : EUR

Après création, récupérez l'ID du prix (il commence par `price_...`). Cela correspondra à `STRIPE_PRICE_SETUP`.

### Produit 2 — Abonnement mensuel

- **Nom** : `Relya — Abonnement mensuel`
- **Description** : Abonnement mensuel au service Relya.
- **Mode de facturation** : Récurrent
- **Intervalle de facturation** : Mensuel
- **Prix** : `19,00 €` (EUR)
- **Devise** : EUR

⚠️ Ne configurez PAS la période d'essai au niveau du produit. La période d'essai est gérée par notre code via `subscription_data.trial_period_days` pour reporter les jours d'essai restants à l'inscription.

Récupérez l'ID du prix → `STRIPE_PRICE_MONTHLY`.

---

## 3. Récupérer les clés API

Dashboard Stripe → **Développeurs → Clés API**.

| Variable | Où la trouver |
|----------|---------------|
| `STRIPE_SECRET_KEY` | Clé secrète (sk_test_... ou sk_live_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique (pk_test_... ou pk_live_...) |

Ajoutez-les dans les variables d'environnement de Vercel (Settings → Environment Variables).

---

## 4. Configurer le webhook

Le webhook permet à Stripe de notifier Relya des événements de paiement.

1. Dashboard Stripe → **Développeurs → Webhooks → + Ajouter un endpoint**
2. **URL de l'endpoint** : `https://VOTRE_DOMAINE/api/stripe/webhook`
   - En production : `https://relya.fr/api/stripe/webhook` (après config du domaine)
   - En test local, utilisez `stripe listen --forward-to localhost:3000/api/stripe/webhook` (nécessite Stripe CLI)
3. **Événements à écouter** (sélectionner uniquement ceux-ci) :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Créer l'endpoint, puis cliquer sur le webhook créé
5. Copier le **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

---

## 5. Activer le portail client

Le portail Stripe permet aux utilisateurs de gérer leur abonnement (moyen de paiement, résiliation, factures).

1. Dashboard Stripe → **Paramètres → Portail client**
2. Activer au minimum :
   - ✅ Autoriser la mise à jour du moyen de paiement
   - ✅ Autoriser la résiliation de l'abonnement
   - ✅ Historique des factures
3. Enregistrer

---

## 6. Variables d'environnement finales

À ajouter sur Vercel (Settings → Environment Variables) :

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_XXXX                 # ou sk_test_ en staging
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_XXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXX
STRIPE_PRICE_SETUP=price_XXXX
STRIPE_PRICE_MONTHLY=price_XXXX

# Supabase (déjà présentes normalement)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...                  # requis pour le webhook

# Resend
RESEND_API_KEY=...

# Cron
CRON_SECRET=...
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` est critique : sans elle, le webhook Stripe ne peut pas mettre à jour la table `subscriptions`. Récupérez-la depuis Supabase → Settings → API → `service_role`.

---

## 7. Tester le flow en mode test

1. Assurez-vous d'être en **Mode test** sur Stripe.
2. Sur Relya, créez un compte avec un email jetable.
3. Allez sur `/subscribe` et cliquez sur « Activer mon abonnement ».
4. Utilisez une carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quels 3 chiffres
5. Validez le paiement.
6. Vérifiez dans le dashboard Stripe que la Checkout Session est réussie.
7. Vérifiez dans Supabase → table `subscriptions` que le statut passe bien en `active` et que `setup_paid = true`.
8. Retournez sur Relya → vous devez accéder à `/app`.

---

## 8. Passer en Live

Une fois le test validé :

1. Basculer sur **Live** dans Stripe.
2. Recréer les 2 produits en mode Live (ou utiliser la copie vers Live).
3. Recréer le webhook avec les bons events.
4. Mettre à jour les 5 variables Stripe sur Vercel avec les valeurs Live.
5. Redéployer.

---

## Dépannage

- **Webhook qui renvoie 400** : vérifier que `STRIPE_WEBHOOK_SECRET` correspond bien à l'endpoint en question (chaque endpoint a son propre secret).
- **Abonnement créé mais table non mise à jour** : vérifier que `SUPABASE_SERVICE_ROLE_KEY` est bien configuré et que les events `checkout.session.completed` et `customer.subscription.*` sont bien sélectionnés.
- **Erreur 500 à l'ouverture du portail** : vérifier que le portail client est activé dans Stripe.
