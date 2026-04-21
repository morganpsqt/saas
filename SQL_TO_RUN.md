# SQL à exécuter sur Supabase (prod)

**Une seule fois**, dans cet ordre, via le **SQL Editor** du projet Supabase
de production. En local le dev `.env.local` peut pointer sur le même projet
(c'est le cas aujourd'hui), ou sur un projet `_dev` séparé — dans ce cas,
refaire la même séquence.

## Ordre d'exécution

| Ordre | Fichier | Contenu |
|---|---|---|
| 1 | [`supabase/schema.sql`](supabase/schema.sql) | Table `devis` + RLS + trigger `updated_at` |
| 2 | [`supabase/subscriptions.sql`](supabase/subscriptions.sql) | Table `subscriptions` + trigger `on_auth_user_created` (essai 14 j automatique à chaque signup) |
| 3 | [`supabase/v2_migrations.sql`](supabase/v2_migrations.sql) | Ajout colonne `devis.notes` (feature Pro) |
| 4 | [`supabase/profiles.sql`](supabase/profiles.sql) | Table `profiles` + bucket `avatars` (public-read) |
| 5 | [`supabase/email_templates.sql`](supabase/email_templates.sql) | Table des templates emails Pro (J+3, J+7, J+10) |

## Idempotence

Tous les fichiers utilisent `CREATE TABLE IF NOT EXISTS` ou équivalent, donc
tu peux les relancer sans casser la DB si elle est déjà partiellement
initialisée.

## Vérifications post-migration

Dans Supabase → Table Editor, tu dois voir :

- [ ] Tables : `devis`, `subscriptions`, `profiles`, `email_templates`
- [ ] Dans Authentication → Policies : RLS activée sur les 4 tables
- [ ] Dans Database → Triggers : `on_auth_user_created` présent sur `auth.users`
- [ ] Dans Storage → Buckets : `avatars` (public read, auth write)

## Ajouter un existing user (backfill)

Si Supabase contient déjà des users créés avant la migration `subscriptions`,
le fichier 2 contient déjà un backfill (`INSERT ... WHERE NOT EXISTS`) qui
leur crée un essai 14 j rétroactif.

## Tests

Après migration, lance la suite E2E :

```bash
npx playwright test
```

Tous les tests qui utilisent `bootstrapUser()` vérifient que le signup crée
bien une ligne `subscriptions` avec `status='trialing'`. Si ça casse → la
migration n°2 n'est pas passée.
