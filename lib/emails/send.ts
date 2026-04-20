import { Resend } from "resend";
import {
  DEFAULT_TEMPLATES,
  fillVars,
  formatDateEnvoi,
  formatMontant,
  renderHtml,
  type EmailTemplatesSet,
  type LayoutOptions,
} from "./templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "Relya <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export interface SendRelanceParams {
  to: string;
  nomClient: string;
  montant: number;
  dateEnvoi: string;
  artisanEmail: string;
  artisanName?: string;
  companyName?: string;
  phone?: string;
  artisanSignature?: string;
  numeroRelance: 1 | 2 | 3;
  templates?: EmailTemplatesSet;
}

function pick(t: EmailTemplatesSet, n: 1 | 2 | 3) {
  if (n === 1) return t.j3;
  if (n === 2) return t.j7;
  return t.j10;
}

export async function sendRelanceEmail(params: SendRelanceParams) {
  const {
    to,
    nomClient,
    montant,
    dateEnvoi,
    artisanEmail,
    artisanName,
    companyName,
    phone,
    artisanSignature,
    numeroRelance,
    templates,
  } = params;

  const tpls = mergeTemplates(templates);
  const tpl = pick(tpls, numeroRelance);

  const vars = {
    nom_client: nomClient,
    montant: formatMontant(montant),
    date_envoi: formatDateEnvoi(dateEnvoi),
    nom_artisan: artisanName || tpls.artisan_name || "",
  };

  const subject = fillVars(tpl.subject, vars);
  const filledBody = fillVars(tpl.body, vars);

  const layout: LayoutOptions = {
    artisanEmail,
    artisanName: artisanName || tpls.artisan_name || undefined,
    artisanSignature: artisanSignature || tpls.artisan_signature || undefined,
    phone,
    companyName,
  };
  const html = renderHtml(filledBody, layout);

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject,
    html,
    replyTo: artisanEmail,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
}

export function mergeTemplates(custom?: Partial<EmailTemplatesSet> | null): EmailTemplatesSet {
  if (!custom) return DEFAULT_TEMPLATES;
  return {
    j3: { ...DEFAULT_TEMPLATES.j3, ...(custom.j3 ?? {}) },
    j7: { ...DEFAULT_TEMPLATES.j7, ...(custom.j7 ?? {}) },
    j10: { ...DEFAULT_TEMPLATES.j10, ...(custom.j10 ?? {}) },
    artisan_name: custom.artisan_name ?? DEFAULT_TEMPLATES.artisan_name,
    artisan_signature: custom.artisan_signature ?? DEFAULT_TEMPLATES.artisan_signature,
  };
}

export interface WelcomeEmailParams {
  to: string;
  displayName?: string;
}

export async function sendWelcomeEmail({ to, displayName }: WelcomeEmailParams) {
  const name = displayName || "et bienvenue";
  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F7F5F2;margin:0;padding:0;color:#1C2B1A;}
.wrapper{max-width:560px;margin:40px auto;background:#fff;border-radius:14px;border:1px solid #ECEAE6;overflow:hidden;}
.header{background:#1C2B1A;padding:22px 32px;}
.brand{color:#F7F5F2;font-size:18px;font-weight:600;}
.brand::before{content:'';display:inline-block;width:10px;height:10px;background:#D2A050;border-radius:50%;margin-right:10px;vertical-align:middle;}
.body{padding:32px;font-size:15px;line-height:1.65;}
.body p{margin:0 0 16px;}
.cta{display:inline-block;background:#1C2B1A;color:#F7F5F2;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:500;margin:8px 0;}
.list{background:#FAF6EE;border:1px solid #EFD9B1;border-radius:12px;padding:18px 22px;margin:18px 0;}
.list ul{margin:0;padding-left:20px;}
.list li{padding:4px 0;color:#1C2B1A;}
.footer{padding:16px 32px;border-top:1px solid #F3F1EC;font-size:11px;color:#B0AEA9;text-align:center;}
</style></head>
<body>
<div class="wrapper">
  <div class="header"><span class="brand">Relya</span></div>
  <div class="body">
    <p>Bonjour ${escapeName(name)},</p>
    <p>Merci de nous rejoindre ! Relya va relancer automatiquement vos clients après l'envoi d'un devis, pour que vous signiez plus — sans y penser.</p>
    <div class="list">
      <strong style="font-size:14px;">Pour bien démarrer :</strong>
      <ul>
        <li>Ajoutez votre premier devis en 30 secondes</li>
        <li>Personnalisez vos emails de relance à votre nom</li>
        <li>Suivez vos signatures depuis votre dashboard</li>
      </ul>
    </div>
    <p><a class="cta" href="${APP_URL}/app/devis/nouveau">+ Ajouter mon premier devis</a></p>
    <p>Vous avez 14 jours d'essai gratuit, sans carte bancaire. Si besoin, répondez simplement à cet email — on vous aide.</p>
    <p>À très vite,<br>L'équipe Relya</p>
  </div>
  <div class="footer">Relya — Relances automatiques pour pros.</div>
</div>
</body></html>`;

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Bienvenue sur Relya ",
    html,
  });
  if (error) throw new Error(`Resend welcome error: ${error.message}`);
}

export interface TrialReminderParams {
  to: string;
  displayName?: string;
  daysLeft: number;
}

export async function sendTrialReminderEmail({ to, displayName, daysLeft }: TrialReminderParams) {
  const name = displayName ? `Bonjour ${escapeName(displayName)},` : "Bonjour,";
  const title = daysLeft <= 1
    ? "Votre essai gratuit se termine demain"
    : `Il vous reste ${daysLeft} jours d'essai sur Relya`;
  const intro = daysLeft <= 1
    ? "Votre période d'essai de 14 jours s'achève demain. Pour continuer à profiter de Relya, activez votre abonnement dès maintenant :"
    : `Votre période d'essai de 14 jours s'achève dans ${daysLeft} jours. Pour continuer à relancer automatiquement vos clients, activez votre abonnement :`;

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F7F5F2;margin:0;padding:0;color:#1C2B1A;}
.wrapper{max-width:560px;margin:40px auto;background:#fff;border-radius:14px;border:1px solid #ECEAE6;overflow:hidden;}
.header{background:#1C2B1A;padding:22px 32px;}
.brand{color:#F7F5F2;font-size:18px;font-weight:600;}
.brand::before{content:'';display:inline-block;width:10px;height:10px;background:#D2A050;border-radius:50%;margin-right:10px;vertical-align:middle;}
.body{padding:32px;font-size:15px;line-height:1.65;}
.body p{margin:0 0 16px;}
.title{font-family:Georgia,serif;font-size:22px;color:#1C2B1A;margin-bottom:14px;}
.cta{display:inline-block;background:#D2A050;color:#1C2B1A;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:500;}
.footer{padding:16px 32px;border-top:1px solid #F3F1EC;font-size:11px;color:#B0AEA9;text-align:center;}
</style></head>
<body>
<div class="wrapper">
  <div class="header"><span class="brand">Relya</span></div>
  <div class="body">
    <p>${name}</p>
    <div class="title">${escapeName(title)}</div>
    <p>${intro}</p>
    <p><a class="cta" href="${APP_URL}/subscribe">Activer mon abonnement →</a></p>
    <p>Tarif : 29 € de frais d'installation puis 19 € / mois. Résiliable à tout moment.</p>
  </div>
  <div class="footer">Relya — Relances automatiques pour pros.</div>
</div>
</body></html>`;

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: title,
    html,
  });
  if (error) throw new Error(`Resend trial reminder error: ${error.message}`);
}

export interface TestEmailParams {
  to: string;
  numeroRelance: 1 | 2 | 3;
  templates: EmailTemplatesSet;
  artisanName?: string;
  companyName?: string;
  phone?: string;
}

export async function sendTestRelanceEmail(params: TestEmailParams) {
  const tpl = pick(params.templates, params.numeroRelance);
  const vars = {
    nom_client: "Jean Dupont",
    montant: formatMontant(1500),
    date_envoi: formatDateEnvoi(new Date().toISOString()),
    nom_artisan: params.artisanName || params.templates.artisan_name || "",
  };
  const subject = `[TEST] ${fillVars(tpl.subject, vars)}`;
  const filled = fillVars(tpl.body, vars);
  const html = renderHtml(filled, {
    artisanEmail: params.to,
    artisanName: params.artisanName || params.templates.artisan_name || undefined,
    artisanSignature: params.templates.artisan_signature || undefined,
    phone: params.phone,
    companyName: params.companyName,
  });
  const { error } = await resend.emails.send({
    from: FROM,
    to: params.to,
    subject,
    html,
  });
  if (error) throw new Error(`Resend test error: ${error.message}`);
}

function escapeName(s: string): string {
  return s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
