import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendRelanceEmail } from "@/lib/emails/send";

// Vercel Cron déclenche ce endpoint chaque matin à 8h (vercel.json)
// Sécurisé par CRON_SECRET pour éviter les appels non autorisés

function diffJours(date: string): number {
  const envoi = new Date(date);
  const maintenant = new Date();
  envoi.setHours(0, 0, 0, 0);
  maintenant.setHours(0, 0, 0, 0);
  return Math.floor((maintenant.getTime() - envoi.getTime()) / (1000 * 60 * 60 * 24));
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabase = await createClient();

  // Récupérer tous les devis encore actifs (pas gagnés ni perdus)
  const { data: devis, error } = await supabase
    .from("devis")
    .select("*, user_id")
    .in("statut", ["en_attente", "relance"]);

  if (error) {
    console.error("Erreur fetch devis:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Récupérer les emails des artisans
  const userIds = [...new Set(devis?.map((d) => d.user_id) ?? [])];
  const artisanEmails: Record<string, string> = {};

  for (const userId of userIds) {
    const { data: { user } } = await supabase.auth.admin.getUserById(userId);
    if (user?.email) artisanEmails[userId] = user.email;
  }

  let relancesEnvoyees = 0;
  const erreurs: string[] = [];

  for (const devis_item of devis ?? []) {
    const jours = diffJours(devis_item.date_envoi);
    const nbRelances = devis_item.nb_relances ?? 0;

    // Déterminer si une relance est due
    let numeroRelance: 1 | 2 | 3 | null = null;

    if (jours >= 2 && nbRelances === 0) numeroRelance = 1;
    else if (jours >= 5 && nbRelances === 1) numeroRelance = 2;
    else if (jours >= 10 && nbRelances === 2) numeroRelance = 3;

    if (!numeroRelance) continue;

    const artisanEmail = artisanEmails[devis_item.user_id] ?? "contact@artisan.fr";

    try {
      await sendRelanceEmail({
        to: devis_item.email_client,
        nomClient: devis_item.nom_client,
        montant: devis_item.montant,
        artisanEmail,
        numeroRelance,
      });

      // Mettre à jour le devis
      await supabase
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
      console.error("Erreur relance:", msg);
    }
  }

  return NextResponse.json({
    success: true,
    relancesEnvoyees,
    erreurs,
  });
}
