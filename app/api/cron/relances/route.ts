import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendRelanceEmail, sendTrialReminderEmail } from "@/lib/emails/send";
import { DEFAULT_TEMPLATES, type EmailTemplatesSet } from "@/lib/emails/templates";

// Vercel Cron déclenche ce endpoint chaque matin à 8h (vercel.json).

function diffJours(date: string): number {
  const envoi = new Date(date);
  const maintenant = new Date();
  envoi.setHours(0, 0, 0, 0);
  maintenant.setHours(0, 0, 0, 0);
  return Math.floor((maintenant.getTime() - envoi.getTime()) / (1000 * 60 * 60 * 24));
}

type TemplateRow = {
  user_id: string;
  subject_j3: string | null;
  body_j3: string | null;
  subject_j7: string | null;
  body_j7: string | null;
  subject_j10: string | null;
  body_j10: string | null;
  artisan_name: string | null;
  artisan_signature: string | null;
};

function rowToTemplates(row: TemplateRow | null | undefined): EmailTemplatesSet {
  if (!row) return DEFAULT_TEMPLATES;
  return {
    j3: {
      subject: row.subject_j3 || DEFAULT_TEMPLATES.j3.subject,
      body: row.body_j3 || DEFAULT_TEMPLATES.j3.body,
    },
    j7: {
      subject: row.subject_j7 || DEFAULT_TEMPLATES.j7.subject,
      body: row.body_j7 || DEFAULT_TEMPLATES.j7.body,
    },
    j10: {
      subject: row.subject_j10 || DEFAULT_TEMPLATES.j10.subject,
      body: row.body_j10 || DEFAULT_TEMPLATES.j10.body,
    },
    artisan_name: row.artisan_name || "",
    artisan_signature: row.artisan_signature || "",
  };
}

type ProfileRow = {
  user_id: string;
  display_name: string | null;
  company_name: string | null;
  phone: string | null;
  contact_email: string | null;
};

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  const querySecret = req.nextUrl.searchParams.get("secret");
  const providedSecret = secret ?? querySecret;

  if (providedSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: devis, error } = await admin
    .from("devis")
    .select("*")
    .in("statut", ["en_attente", "relance"]);

  if (error) {
    console.error("[cron] fetch devis error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userIds = [...new Set(devis?.map((d) => d.user_id) ?? [])];
  const artisanEmails: Record<string, string> = {};

  for (const userId of userIds) {
    const { data: userData } = await admin.auth.admin.getUserById(userId);
    if (userData?.user?.email) artisanEmails[userId] = userData.user.email;
  }

  // Custom templates par utilisateur (si table présente)
  const templatesByUser: Record<string, EmailTemplatesSet> = {};
  try {
    const { data: tplRows } = await admin
      .from("email_templates")
      .select("*")
      .in("user_id", userIds);
    for (const row of (tplRows as TemplateRow[] | null) ?? []) {
      templatesByUser[row.user_id] = rowToTemplates(row);
    }
  } catch (e) {
    console.warn("[cron] email_templates lookup failed:", e);
  }

  // Profils (pour nom, entreprise, phone)
  const profilesByUser: Record<string, ProfileRow> = {};
  try {
    const { data: profRows } = await admin
      .from("profiles")
      .select("user_id, display_name, company_name, phone, contact_email")
      .in("user_id", userIds);
    for (const row of (profRows as ProfileRow[] | null) ?? []) {
      profilesByUser[row.user_id] = row;
    }
  } catch (e) {
    console.warn("[cron] profiles lookup failed:", e);
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

    const profile = profilesByUser[devis_item.user_id];
    const templates = templatesByUser[devis_item.user_id] ?? DEFAULT_TEMPLATES;

    try {
      await sendRelanceEmail({
        to: devis_item.email_client,
        nomClient: devis_item.nom_client,
        montant: devis_item.montant,
        dateEnvoi: devis_item.date_envoi,
        artisanEmail: profile?.contact_email || artisanEmail,
        artisanName: profile?.display_name || undefined,
        companyName: profile?.company_name || undefined,
        phone: profile?.phone || undefined,
        numeroRelance,
        templates,
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

  // Rappels fin d'essai (J-3 et J-1)
  let trialReminders = 0;
  try {
    const { data: trialSubs } = await admin
      .from("subscriptions")
      .select("user_id, status, trial_end, setup_paid")
      .eq("status", "trialing")
      .eq("setup_paid", false);
    for (const sub of (trialSubs as Array<{ user_id: string; status: string; trial_end: string | null; setup_paid: boolean }> | null) ?? []) {
      if (!sub.trial_end) continue;
      const msLeft = new Date(sub.trial_end).getTime() - Date.now();
      const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
      if (daysLeft !== 3 && daysLeft !== 1) continue;

      const { data: u } = await admin.auth.admin.getUserById(sub.user_id);
      const email = u?.user?.email;
      if (!email) continue;
      const profile = profilesByUser[sub.user_id];
      try {
        await sendTrialReminderEmail({
          to: email,
          displayName: profile?.display_name || undefined,
          daysLeft,
        });
        trialReminders++;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        erreurs.push(`trial-reminder ${sub.user_id}: ${msg}`);
      }
    }
  } catch (e) {
    console.warn("[cron] trial reminder phase skipped:", e);
  }

  return NextResponse.json({ success: true, relancesEnvoyees, trialReminders, erreurs });
}
