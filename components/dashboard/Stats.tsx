interface StatsProps {
  total: number;
  gagnes: number;
  montantGagne: number;
  tauxConversion: number;
}

export default function Stats({ total, gagnes, montantGagne, tauxConversion }: StatsProps) {
  const montantFormate = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(montantGagne);

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
        }
        .stat-value.accent { color: #D2A050; }
      `}</style>
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Devis envoyés</p>
          <p className="stat-value">{total}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Devis gagnés</p>
          <p className={`stat-value ${gagnes > 0 ? "accent" : ""}`}>{gagnes}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Taux de conversion</p>
          <p className={`stat-value ${tauxConversion > 0 ? "accent" : ""}`}>{tauxConversion}%</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">CA récupéré</p>
          <p className={`stat-value ${montantGagne > 0 ? "accent" : ""}`}>{montantFormate}</p>
        </div>
      </div>
    </>
  );
}
