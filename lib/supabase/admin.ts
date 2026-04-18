import { createClient } from "@supabase/supabase-js";

// Client Supabase avec les droits service_role — NE JAMAIS exposer au navigateur.
// Utilisé uniquement dans les API routes serveur (webhook Stripe, cron).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquant. Configurez-le dans .env.local et sur Vercel."
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
