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
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 0; }
  .wrapper { max-width: 520px; margin: 40px auto; background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; }
  .header { background: #2563eb; padding: 24px 32px; }
  .header h1 { color: #fff; margin: 0; font-size: 18px; font-weight: 600; }
  .body { padding: 32px; color: #374151; font-size: 15px; line-height: 1.6; }
  .body p { margin: 0 0 16px; }
  .amount { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
  .amount strong { color: #1d4ed8; font-size: 22px; }
  .cta { display: inline-block; background: #2563eb; color: #fff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 8px 0; }
  .footer { padding: 20px 32px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header"><h1>RelanceDevis</h1></div>
  <div class="body">${content}</div>
  <div class="footer">Vous recevez ce message car un artisan vous a envoyé un devis. Pour toute question, répondez directement à cet email.</div>
</div>
</body>
</html>`;
}

export function emailRelance1({ nomClient, montant, artisanEmail, appUrl }: EmailData) {
  const content = `
<p>Bonjour ${nomClient},</p>
<p>Je me permets de vous recontacter au sujet du devis que je vous ai transmis il y a quelques jours.</p>
<div class="amount">
  Montant du devis : <strong>${formatMontant(montant)}</strong>
</div>
<p>Avez-vous eu l'occasion de l'examiner ? Je suis disponible pour répondre à vos questions ou ajuster ma proposition si nécessaire.</p>
<p>N'hésitez pas à me répondre directement à cet email.</p>
<p>Cordialement,</p>
<p><strong>Votre artisan</strong><br><a href="mailto:${artisanEmail}">${artisanEmail}</a></p>`;
  return baseLayout(content);
}

export function emailRelance2({ nomClient, montant, artisanEmail, appUrl }: EmailData) {
  const content = `
<p>Bonjour ${nomClient},</p>
<p>Je reviens vers vous concernant mon devis de <strong>${formatMontant(montant)}</strong>.</p>
<p>Votre projet m'intéresse et je souhaite vous proposer la meilleure prestation possible. Si vous avez des doutes ou des questions sur ma proposition, je suis entièrement disponible pour en discuter.</p>
<p>Souhaitez-vous qu'on échange quelques minutes par téléphone ?</p>
<p>Cordialement,</p>
<p><strong>Votre artisan</strong><br><a href="mailto:${artisanEmail}">${artisanEmail}</a></p>`;
  return baseLayout(content);
}

export function emailRelance3({ nomClient, montant, artisanEmail, appUrl }: EmailData) {
  const content = `
<p>Bonjour ${nomClient},</p>
<p>C'est mon dernier message concernant le devis de <strong>${formatMontant(montant)}</strong> que je vous ai envoyé.</p>
<p>Je comprends que vous ayez peut-être trouvé une autre solution ou que votre projet ait évolué — dans ce cas, pas de souci du tout.</p>
<p>Si vous êtes toujours intéressé(e), je reste joignable à tout moment. Mon agenda se remplit vite, et je tenais à vous en informer.</p>
<p>Bonne continuation quoi qu'il en soit !</p>
<p>Cordialement,</p>
<p><strong>Votre artisan</strong><br><a href="mailto:${artisanEmail}">${artisanEmail}</a></p>`;
  return baseLayout(content);
}
