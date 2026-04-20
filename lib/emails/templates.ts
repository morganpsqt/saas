export interface RelanceVars {
  nom_client: string;
  montant: string;
  date_envoi: string;
  nom_artisan: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface EmailTemplatesSet {
  j3: EmailTemplate;
  j7: EmailTemplate;
  j10: EmailTemplate;
  artisan_name: string;
  artisan_signature: string;
}

export const DEFAULT_TEMPLATES: EmailTemplatesSet = {
  j3: {
    subject: "Votre devis — avez-vous eu le temps d'y jeter un œil ?",
    body: `Bonjour {nom_client},

Je me permets de vous recontacter au sujet du devis de {montant} que je vous ai transmis le {date_envoi}.

Avez-vous eu l'occasion de l'examiner ? Je suis disponible pour répondre à vos questions ou ajuster ma proposition si nécessaire.

N'hésitez pas à me répondre directement à cet email.

Cordialement,
{nom_artisan}`,
  },
  j7: {
    subject: "Toujours disponible pour votre projet",
    body: `Bonjour {nom_client},

Je reviens vers vous concernant mon devis de {montant} envoyé le {date_envoi}.

Votre projet m'intéresse et je souhaite vous proposer la meilleure prestation possible. Si vous avez des doutes ou des questions sur ma proposition, je suis entièrement disponible pour en discuter.

Souhaitez-vous qu'on échange quelques minutes par téléphone ?

Cordialement,
{nom_artisan}`,
  },
  j10: {
    subject: "Dernières nouvelles concernant votre devis",
    body: `Bonjour {nom_client},

C'est mon dernier message concernant le devis de {montant} que je vous ai envoyé le {date_envoi}.

Je comprends que vous ayez peut-être trouvé une autre solution ou que votre projet ait évolué — dans ce cas, pas de souci du tout.

Si vous êtes toujours intéressé(e), je reste joignable à tout moment.

Bonne continuation quoi qu'il en soit !

Cordialement,
{nom_artisan}`,
  },
  artisan_name: "",
  artisan_signature: "",
};

export function fillVars(text: string, vars: RelanceVars): string {
  return text
    .replace(/\{nom_client\}/g, vars.nom_client)
    .replace(/\{montant\}/g, vars.montant)
    .replace(/\{date_envoi\}/g, vars.date_envoi)
    .replace(/\{nom_artisan\}/g, vars.nom_artisan);
}

export function formatMontant(montant: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(montant);
}

export function formatDateEnvoi(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function bodyToHtml(body: string): string {
  const escaped = escapeHtml(body);
  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("\n");
  return paragraphs;
}

export interface LayoutOptions {
  artisanEmail: string;
  artisanName?: string;
  artisanSignature?: string;
  phone?: string;
  companyName?: string;
}

export function renderHtml(filledBody: string, opts: LayoutOptions): string {
  const signatureLines: string[] = [];
  if (opts.artisanName) signatureLines.push(`<strong style="color:#1C2B1A;">${escapeHtml(opts.artisanName)}</strong>`);
  if (opts.companyName) signatureLines.push(escapeHtml(opts.companyName));
  if (opts.artisanSignature) signatureLines.push(escapeHtml(opts.artisanSignature));
  if (opts.phone) signatureLines.push(escapeHtml(opts.phone));
  signatureLines.push(`<a href="mailto:${escapeHtml(opts.artisanEmail)}">${escapeHtml(opts.artisanEmail)}</a>`);
  const sigHtml = signatureLines.join("<br>");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F7F5F2; margin: 0; padding: 0; color: #1C2B1A; }
  .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 14px; border: 1px solid #ECEAE6; overflow: hidden; }
  .header { background: #1C2B1A; padding: 22px 32px; display: flex; align-items: center; gap: 10px; }
  .brand-dot { width: 10px; height: 10px; background: #D2A050; border-radius: 50%; display: inline-block; }
  .brand-name { color: #F7F5F2; font-size: 18px; font-weight: 600; letter-spacing: -0.2px; }
  .body { padding: 32px; color: #1C2B1A; font-size: 15px; line-height: 1.65; }
  .body p { margin: 0 0 16px; }
  .signature { margin-top: 28px; padding-top: 20px; border-top: 1px solid #F0EDE8; font-size: 13px; color: #6B7280; line-height: 1.75; }
  .signature a { color: #D2A050; text-decoration: none; }
  .footer { padding: 16px 32px; border-top: 1px solid #F3F1EC; font-size: 11px; color: #B0AEA9; text-align: center; }
  .footer a { color: #9A9A9A; text-decoration: none; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <span class="brand-dot"></span>
    <span class="brand-name">Relya</span>
  </div>
  <div class="body">
${bodyToHtml(filledBody)}
    <div class="signature">${sigHtml}</div>
  </div>
  <div class="footer">Envoyé via <a href="https://relya.fr">Relya</a> — Relances automatiques pour pros.</div>
</div>
</body>
</html>`;
}
