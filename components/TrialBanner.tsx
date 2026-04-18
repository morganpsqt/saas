"use client";

import Link from "next/link";
import type { Subscription } from "@/lib/types";
import { daysLeftInTrial } from "@/lib/subscriptions-shared";

export default function TrialBanner({ subscription }: { subscription: Subscription | null }) {
  if (!subscription) return null;

  // Affichage uniquement pendant le trial
  if (subscription.status !== "trialing") return null;

  const days = daysLeftInTrial(subscription);
  if (days === null) return null;

  const isUrgent = days <= 3;

  return (
    <>
      <style>{`
        .trial-banner {
          background: ${isUrgent ? "#FEF3E6" : "#FAF6EE"};
          border-bottom: 1px solid ${isUrgent ? "#F6D4A5" : "#EFE2C4"};
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          font-size: 13.5px;
          color: #1C2B1A;
          flex-wrap: wrap;
        }
        .trial-banner strong { color: #8A5A1A; }
        .trial-banner-cta {
          background: #1C2B1A;
          color: #F7F5F2;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.2s;
        }
        .trial-banner-cta:hover { background: #2C3F2A; }
      `}</style>
      <div className="trial-banner">
        <span>
          {days === 0 ? (
            <>Votre essai gratuit se termine <strong>aujourd'hui</strong>.</>
          ) : days === 1 ? (
            <>Il vous reste <strong>1 jour</strong> d'essai gratuit.</>
          ) : (
            <>Il vous reste <strong>{days} jours</strong> d'essai gratuit.</>
          )}
        </span>
        <Link href="/subscribe" className="trial-banner-cta">
          Activer mon abonnement →
        </Link>
      </div>
    </>
  );
}
