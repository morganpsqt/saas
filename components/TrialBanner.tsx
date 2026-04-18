"use client";

import Link from "next/link";
import type { Subscription } from "@/lib/types";
import {
  daysLeftInTrial,
  getSubscriptionState,
  formatNextBillingDate,
} from "@/lib/subscriptions-shared";

async function openPortal() {
  const res = await fetch("/api/stripe/portal", { method: "POST" });
  const json = await res.json();
  if (json.url) window.location.href = json.url;
}

export default function TrialBanner({ subscription }: { subscription: Subscription | null }) {
  const state = getSubscriptionState(subscription);

  if (state === "active") return null;

  const days = daysLeftInTrial(subscription);
  const billingDate = formatNextBillingDate(subscription);

  return (
    <>
      <style>{`
        .banner {
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          font-size: 13.5px;
          color: #1C2B1A;
          flex-wrap: wrap;
          border-bottom: 1px solid;
        }
        .banner.trial-unpaid { background: ${days !== null && days <= 3 ? "#FEF3E6" : "#FAF6EE"}; border-color: ${days !== null && days <= 3 ? "#F6D4A5" : "#EFE2C4"}; }
        .banner.trial-unpaid strong { color: #8A5A1A; }
        .banner.trial-paid { background: #ECF5EC; border-color: #C7E1C7; color: #254C1E; }
        .banner.past-due { background: #FEECEC; border-color: #F3BDBD; color: #8A1A1A; }
        .banner-cta {
          background: #1C2B1A;
          color: #F7F5F2;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 500;
          text-decoration: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
        }
        .banner-cta:hover { background: #2C3F2A; }
        .banner-cta.red { background: #8A1A1A; }
        .banner-cta.red:hover { background: #AA2020; }
        .banner-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 6px; vertical-align: middle; }
        .banner.trial-paid .banner-dot { background: #3A8A3A; }
      `}</style>

      {state === "trial_unpaid" && days !== null && (
        <div className="banner trial-unpaid">
          <span>
            {days === 0 ? (
              <>Votre essai gratuit se termine <strong>aujourd&apos;hui</strong>.</>
            ) : days === 1 ? (
              <>Il vous reste <strong>1 jour</strong> d&apos;essai gratuit.</>
            ) : (
              <>Il vous reste <strong>{days} jours</strong> d&apos;essai gratuit.</>
            )}
          </span>
          <Link href="/subscribe" className="banner-cta">Activer mon abonnement →</Link>
        </div>
      )}

      {state === "trial_paid" && (
        <div className="banner trial-paid">
          <span>
            <span className="banner-dot" />
            Abonnement actif — prochain prélèvement de 19 €
            {billingDate ? <> le <strong>{billingDate}</strong></> : null}.
          </span>
        </div>
      )}

      {state === "past_due" && (
        <div className="banner past-due">
          <span>⚠ Votre dernier paiement a échoué. Mettez à jour votre moyen de paiement pour conserver l&apos;accès.</span>
          <button className="banner-cta red" onClick={openPortal}>Mettre à jour →</button>
        </div>
      )}
    </>
  );
}
