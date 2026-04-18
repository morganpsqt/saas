import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendRelanceEmail } from "@/lib/emails/send";

// Vercel Cron déclenche ce endpoint chaque matin à 8h (vercel.json)
// Sécurisé par CRON_SECRET pour éviter les appels non autorisés.

function diffJours(date: string): number {
  const envoi = new Date(date);
  const maintenant = new Date();
  envoi.setHours(0, 0, 0, 0);
  maintenant.setHours(0, 0, 0, 0);
  return Math.floor((maintenant.getTime() - envoi.getTime()) / (1000 * 60 * 60 * 24));
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");

  // Vercel Cron passe aussi la secret via ?secret=... — on accepte les deux
  const querySecret = req.nextUrl.searchParams.get("secret");
  const providedSecret = secret ?? querySecret;

  if (providedSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // On utilise le client admin (service_role) pour lire tous les devis + les users
  const admin = createAdminClient();

  const { data: devis, error } = await admin
    .from("devis")
    .select("*")
    .in("statut", ["en_attente", "relance"]);

  if (error) {
    console.error("[cron] fetch devis error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Récupérer les emails des artisans via auth admin
  const userIds = [...new Set(devis?.map((d) => d.user_id) ?? [])];
  const artisanEmails: Record<string, string> = {};

  for (const userId of userIds) {
    const { data: userData } = await admin.auth.admin.getUserById(userId);
    if (userData?.user?.email) artisanEmails[userId] = userData.user.email;
  }

  let relancesEnvoyees = 0;
  const erreurs: string[] = [];

  for (const devis_item of devis ?? []) {
    const jours = diffJours(devis_item.date_envoi);
    const nbRelances = devis_item.nb_relances ?? 0;

    let numeroRelance: 1 | 2 | 3 | null = null;
    if (jours >= 2 && nbRelances === 0) numeroRelance = 1;
    else if (jours >= 5 && nbRelances === 1) numeroRelance = 2;
    else if (jours >= 10 && nbRelances === 2) numeroRelance = 3;

    if (!numeroRelance) continue;

    const artisanEmail = artisanEmails[devis_item.user_id];
    if (!artisanEmail) {
      erreurs.push(`devis ${devis_item.id}: email artisan introuvable`);
      continue;
    }

    try {
      await sendRelanceEmail({
        to: devis_item.email_client,
        nomClient: devis_item.nom_client,
        montant: devis_item.montant,
        artisanEmail,
        numeroRelance,
      });

      await admin
        .from("devis")
        .update({
          statut: "relance",
          nb_relances: nbRelances + 1,
          derniere_relance_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", devis_item.id);

      relancesEnvoyees++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      erreurs.push(`devis ${devis_item.id}: ${msg}`);
      console.error("[cron] relance error:", msg);
    }
  }

  return NextResponse.json({ success: true, relancesEnvoyees, erreurs });
}
