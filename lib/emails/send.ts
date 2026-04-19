import { Resend } from "resend";
import { emailRelance1, emailRelance2, emailRelance3 } from "./templates";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY manquante");
  _resend = new Resend(key);
  return _resend;
}

const FROM = process.env.RESEND_FROM ?? "Relya <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

interface SendRelanceParams {
  to: string;
  nomClient: string;
  montant: number;
  artisanEmail: string;
  numeroRelance: 1 | 2 | 3;
}

const SUBJECTS: Record<number, string> = {
  1: "Votre devis — avez-vous eu le temps d'y jeter un œil ?",
  2: "Toujours disponible pour votre projet",
  3: "Dernières nouvelles concernant votre devis",
};

const TEMPLATES: Record<number, (d: { nomClient: string; montant: number; artisanEmail: string; appUrl: string }) => string> = {
  1: emailRelance1,
  2: emailRelance2,
  3: emailRelance3,
};

export async function sendRelanceEmail(params: SendRelanceParams) {
  const { to, nomClient, montant, artisanEmail, numeroRelance } = params;

  const html = TEMPLATES[numeroRelance]({
    nomClient,
    montant,
    artisanEmail,
    appUrl: APP_URL,
  });

  const { error } = await getResend().emails.send({
    from: FROM,
    to,
    subject: SUBJECTS[numeroRelance],
    html,
    replyTo: artisanEmail,
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
}
