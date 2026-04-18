"use client";

import { useEffect, useRef, useState } from "react";

interface StatsProps {
  total: number;
  gagnes: number;
  montantGagne: number;
  tauxConversion: number;
}

function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const from = 0;
    const to = target;
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

function formatMontant(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Stats({ total, gagnes, montantGagne, tauxConversion }: StatsProps) {
  const totalV = useCountUp(total);
  const gagnesV = useCountUp(gagnes);
  const tauxV = useCountUp(tauxConversion);
  const montantV = useCountUp(montantGagne);

  return (
    <>
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 20px;
          border: 1px solid #ECEAE6;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(28,43,26,0.06);
        }
        .stat-label {
          font-size: 12px;
          color: #9A9A9A;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 10px;
        }
        .stat-value {
          font-family: 'Fraunces', serif;
          font-size: 30px;
          color: #1C2B1A;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .stat-value.accent { color: #D2A050; }
      `}</style>
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Devis envoyés</p>
          <p className="stat-value">{totalV}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Devis gagnés</p>
          <p className={`stat-value ${gagnes > 0 ? "accent" : ""}`}>{gagnesV}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Taux de conversion</p>
          <p className={`stat-value ${tauxConversion > 0 ? "accent" : ""}`}>{tauxV}%</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">CA récupéré</p>
          <p className={`stat-value ${montantGagne > 0 ? "accent" : ""}`}>{formatMontant(montantV)}</p>
        </div>
      </div>
    </>
  );
}
