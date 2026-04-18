"use client";

import { useState } from "react";
import Link from "next/link";
import type { SubscriptionStatus } from "@/lib/types";

interface Props {
  hasAccess: boolean;
  daysLeft: number | null;
  status: SubscriptionStatus;
  email: string;
}

export default function SubscribeClient({ hasAccess, daysLeft, status, email }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubscribe() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const json = await res.json();

    if (!res.ok || !json.url) {
      setError(json.error ?? "Impossible de lancer le paiement.");
      setLoading(false);
      return;
    }

    window.location.href = json.url;
  }

  const headline = hasAccess
    ? daysLeft !== null && daysLeft <= 3
      ? "Votre essai se termine bientôt"
      : "Activer votre abonnement"
    : status === "past_due"
    ? "Paiement échoué — mise à jour nécessaire"
    : status === "canceled"
    ? "Votre abonnement est terminé"
    : "Votre essai est terminé";

  const subHeadline = hasAccess
    ? daysLeft !== null && daysLeft > 0
      ? `Il vous reste ${daysLeft} jour${daysLeft > 1 ? "s" : ""}. Activez dès maintenant pour ne pas couper le service.`
      : "Activez votre abonnement pour continuer à utiliser Relya."
    : "Réactivez votre accès pour continuer à relancer vos clients automatiquement.";

  return (
    <>
      <style>{`
        .sub-root {
          min-height: 100vh;
          background: #F7F5F2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .sub-card {
          max-width: 480px;
          width: 100%;
          background: #fff;
          border-radius: 20px;
          border: 1px solid #ECEAE6;
          padding: 40px;
          text-align: center;
        }
        .sub-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Fraunces', serif;
          font-size: 18px;
          color: #1C2B1A;
          margin-bottom: 24px;
        }
        .sub-brand-dot {
          width: 8px; height: 8px;
          background: #D2A050;
          border-radius: 50%;
        }
        .sub-title {
          font-family: 'Fraunces', serif;
          font-size: 30px;
          color: #1C2B1A;
          margin-bottom: 12px;
          line-height: 1.15;
        }
        .sub-subtitle {
          font-size: 15px;
          color: #6B7280;
          margin-bottom: 32px;
          line-height: 1.55;
        }
        .sub-price-box {
          background: #FAF6EE;
          border: 1px solid #EFD9B1;
          border-radius: 14px;
          padding: 22px;
          margin-bottom: 28px;
          text-align: left;
        }
        .sub-price-line {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 6px 0;
          font-size: 14px;
          color: #3A3A3A;
        }
        .sub-price-line.big {
          padding-top: 12px;
          border-top: 1px solid #EFD9B1;
          margin-top: 8px;
          font-weight: 600;
          font-size: 16px;
        }
        .sub-price-line strong {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
        }
        .sub-cta {
          width: 100%;
          background: #1C2B1A;
          color: #F7F5F2;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s;
        }
        .sub-cta:hover:not(:disabled) { background: #2C3F2A; }
        .sub-cta:disabled { opacity: 0.5; cursor: not-allowed; }
        .sub-error {
          background: #FFF3F3;
          border: 1px solid #FFCDD2;
          color: #C0392B;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          margin-bottom: 16px;
        }
        .sub-note {
          font-size: 12.5px;
          color: #9A9A9A;
          margin-top: 20px;
          line-height: 1.5;
        }
        .sub-note a { color: #D2A050; text-decoration: none; }
        .sub-back { margin-top: 24px; font-size: 13px; }
        .sub-back a { color: #9A9A9A; text-decoration: none; }
        .sub-back a:hover { color: #1C2B1A; }
      `}</style>

      <div className="sub-root">
        <div className="sub-card">
          <div className="sub-brand">
            <span className="sub-brand-dot" />
            Relya
          </div>

          <h1 className="sub-title">{headline}</h1>
          <p className="sub-subtitle">{subHeadline}</p>

          <div className="sub-price-box">
            <div className="sub-price-line">
              <span>Frais d'inscription (une fois)</span>
              <strong>29 €</strong>
            </div>
            <div className="sub-price-line">
              <span>Abonnement mensuel</span>
              <strong>19 €</strong>
            </div>
            <div className="sub-price-line big">
              <span>Aujourd'hui</span>
              <strong>48 €</strong>
            </div>
          </div>

          {error && <div className="sub-error">{error}</div>}

          <button onClick={handleSubscribe} disabled={loading} className="sub-cta">
            {loading ? "Redirection..." : "Activer mon abonnement →"}
          </button>

          <p className="sub-note">
            Paiement sécurisé via <a href="https://stripe.com" target="_blank" rel="noreferrer">Stripe</a>. Résiliable à tout moment depuis votre espace client.
          </p>

          <p className="sub-back">
            <Link href="/app">← Retour au dashboard</Link>
          </p>

          <p className="sub-note" style={{ marginTop: 12 }}>
            Connecté en tant que {email}
          </p>
        </div>
      </div>
    </>
  );
}
