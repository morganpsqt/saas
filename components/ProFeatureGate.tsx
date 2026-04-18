"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  isPro: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
  inline?: boolean;
}

export default function ProFeatureGate({
  isPro,
  title = "Réservé aux abonnés",
  description = "Débloquez cette fonctionnalité en activant votre abonnement.",
  children,
  inline = false,
}: Props) {
  if (isPro) return <>{children}</>;

  return (
    <>
      <style>{`
        .pro-wrap { position: relative; }
        .pro-wrap-inner {
          pointer-events: none;
          filter: blur(3px);
          opacity: 0.5;
          user-select: none;
        }
        .pro-overlay {
          position: absolute;
          inset: 0;
          background: rgba(247,245,242,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          backdrop-filter: blur(2px);
        }
        .pro-box {
          background: #fff;
          border: 1px solid #EFD9B1;
          border-radius: 14px;
          padding: 22px;
          text-align: center;
          max-width: 380px;
          box-shadow: 0 4px 20px rgba(28,43,26,0.08);
        }
        .pro-lock {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #FAF6EE;
          border-radius: 50%;
          color: #8A5A1A;
          font-size: 18px;
          margin-bottom: 10px;
        }
        .pro-title {
          font-family: 'Fraunces', serif;
          font-size: 17px;
          color: #1C2B1A;
          margin-bottom: 6px;
        }
        .pro-desc { font-size: 13.5px; color: #6B7280; line-height: 1.5; margin-bottom: 14px; }
        .pro-cta {
          display: inline-block;
          background: #1C2B1A;
          color: #F7F5F2 !important;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
        }
        .pro-cta:hover { background: #2C3F2A; }

        /* Inline (compact) variant for buttons */
        .pro-inline-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: #FAF6EE;
          border: 1px solid #EFD9B1;
          border-radius: 10px;
          color: #8A5A1A;
          font-size: 13px;
          cursor: pointer;
          font-family: inherit;
          text-decoration: none;
        }
        .pro-inline-btn:hover { background: #F3EAD3; }
      `}</style>

      {inline ? (
        <Link href="/subscribe" className="pro-inline-btn" title={description}>
          🔒 {title}
        </Link>
      ) : (
        <div className="pro-wrap">
          <div className="pro-wrap-inner">{children}</div>
          <div className="pro-overlay">
            <div className="pro-box">
              <div className="pro-lock">🔒</div>
              <div className="pro-title">{title}</div>
              <p className="pro-desc">{description}</p>
              <Link href="/subscribe" className="pro-cta">Activer mon abonnement</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
