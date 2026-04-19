interface EmailData {
  nomClient: string;
  montant: number;
  artisanEmail: string;
  appUrl: string;
}

function formatMontant(montant: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(montant);
}

function baseLayout(content: string) {
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
  .amount { background: #FAF6EE; border: 1px solid #EFD9B1; border-radius: 10px; padding: 16px 20px; margin: 22px 0; font-size: 15px; }
  .amount strong { color: #1C2B1A; font-size: 22px; font-weight: 600; }
  .signature { margin-top: 28px; padding-top: 20px; border-top: 1px solid #F0EDE8; font-size: 13px; color: #9A9A9A; }
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
  <div class="body">${content}</div>
  <div class="footer">Envoyé via <a href="https://relya.fr">Relya</a> — Relances automatiques de devis.</div>
</div>
</body>
</html>`;
}

function signature(artisanEmail: string) {
  return `
<div class="signature">
  <p style="margin:0;">Pour toute question, répondez directement à : <a href="mailto:${artisanEmail}">${artisanEmail}</a></p>
</div>`;
}

export function emailRelance1({ nomClient, montant, artisanEmail }: EmailData) {
  const content = `
<p>Bonjour ${nomClient},</p>
<p>Je me permets de vous recontacter au sujet du devis que je vous ai transmis il y a quelques jours.</p>
<div class="amount">
  Montant du devis : <strong>${formatMontant(montant)}</strong>
</div>
<p>Avez-vous eu l'occasion de l'examiner ? Je suis disponible pour répondre à vos questions ou ajuster ma proposition si nécessaire.</p>
<p>N'hésitez pas à me répondre directement à cet email.</p>
<p>Cordialement,</p>
${signature(artisanEmail)}`;
  return baseLayout(content);
}

export function emailRelance2({ nomClient, montant, artisanEmail }: EmailData) {
  const content = `
<p>Bonjour ${nomClient},</p>
<p>Je reviens vers vous concernant mon devis de <strong>${formatMontant(montant)}</strong>.</p>
<p>Votre projet m'intéresse et je souhaite vous proposer la meilleure prestation possible. Si vous avez des doutes ou des questions sur ma proposition, je suis entièrement disponible pour en discuter.</p>
<p>Souhaitez-vous qu'on échange quelques minutes par téléphone ?</p>
<p>Cordialement,</p>
${signature(artisanEmail)}`;
  return baseLayout(content);
}

export function emailRelance3({ nomClient, montant, artisanEmail }: EmailData) {
  const content = `
<p>Bonjour ${nomClient},</p>
<p>C'est mon dernier message concernant le devis de <strong>${formatMontant(montant)}</strong> que je vous ai envoyé.</p>
<p>Je comprends que vous ayez peut-être trouvé une autre solution ou que votre projet ait évolué — dans ce cas, pas de souci du tout.</p>
<p>Si vous êtes toujours intéressé(e), je reste joignable à tout moment. Mon agenda se remplit vite, et je tenais à vous en informer.</p>
<p>Bonne continuation quoi qu'il en soit !</p>
<p>Cordialement,</p>
${signature(artisanEmail)}`;
  return baseLayout(content);
}
