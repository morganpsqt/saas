"use client";

import type { Subscription, SubscriptionState } from "@/lib/types";
import { formatNextBillingDate, daysLeftInTrial } from "@/lib/subscriptions-shared";
import { useState } from "react";

interface Props {
  subscription: Subscription | null;
  state: SubscriptionState;
}

const LABELS: Record<SubscriptionState, { title: string; tone: "gold" | "green" | "red" | "gray" }> = {
  trial_unpaid: { title: "Essai gratuit en cours", tone: "gold" },
  trial_paid: { title: "Abonnement actif (essai)", tone: "green" },
  active: { title: "Abonnement actif", tone: "green" },
  past_due: { title: "Paiement en échec", tone: "red" },
  canceled: { title: "Abonnement annulé", tone: "gray" },
  expired: { title: "Essai terminé", tone: "gray" },
};

export default function SubscriptionCard({ subscription, state }: Props) {
  const [loading, setLoading] = useState(false);
  const label = LABELS[state];
  const nextDate = formatNextBillingDate(subscription);
  const days = daysLeftInTrial(subscription);

  async function openPortal() {
    setLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const json = await res.json();
    if (json.url) window.location.href = json.url;
    else setLoading(false);
  }

  const hasCustomer = !!subscription?.stripe_customer_id;

  return (
    <>
      <style>{`
        .sub-card {
          background: #fff;
          border: 1px solid #ECEAE6;
          border-radius: 14px;
          padding: 20px;
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .sub-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 220px; }
        .sub-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .sub-dot.gold { background: #D2A050; }
        .sub-dot.green { background: #3A8A3A; }
        .sub-dot.red { background: #B84040; }
        .sub-dot.gray { background: #9A9A9A; }
        .sub-title { font-size: 14px; color: #1C2B1A; font-weight: 500; margin-bottom: 2px; }
        .sub-subtitle { font-size: 13px; color: #6B7280; }
        .sub-btn {
          font-size: 13px;
          padding: 9px 16px;
          border-radius: 10px;
          border: 1px solid #D9D5CC;
          background: #fff;
          color: #1C2B1A;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s;
          text-decoration: none;
        }
        .sub-btn:hover:not(:disabled) { background: #F7F5F2; }
        .sub-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .sub-btn.primary { background: #1C2B1A; color: #F7F5F2; border-color: #1C2B1A; }
        .sub-btn.primary:hover:not(:disabled) { background: #2C3F2A; }
      `}</style>
      <section className="sub-card">
        <div className="sub-left">
          <span className={`sub-dot ${label.tone}`} />
          <div>
            <div className="sub-title">{label.title}</div>
            <div className="sub-subtitle">
              {state === "trial_unpaid" && days !== null && (
                <>Il vous reste {days} jour{days > 1 ? "s" : ""} d&apos;essai — puis 29 € + 19 €/mois.</>
              )}
              {state === "trial_paid" && nextDate && <>Prochain prélèvement de 19 € le {nextDate}.</>}
              {state === "active" && nextDate && <>Prochain prélèvement le {nextDate}.</>}
              {state === "past_due" && <>Mettez à jour votre moyen de paiement pour éviter l&apos;interruption.</>}
              {state === "canceled" && <>Votre abonnement a pris fin.</>}
              {state === "expired" && <>Votre essai est terminé.</>}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {state === "trial_unpaid" || state === "expired" || state === "canceled" ? (
            <a href="/subscribe" className="sub-btn primary">Activer mon abonnement</a>
          ) : null}
          {hasCustomer && (
            <button onClick={openPortal} disabled={loading} className="sub-btn">
              {loading ? "Chargement..." : "Gérer mon abonnement"}
            </button>
          )}
        </div>
      </section>
    </>
  );
}
