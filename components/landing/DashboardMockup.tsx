export default function DashboardMockup() {
  return (
    <>
      <style>{`
        .mk-wrap {
          position: relative;
          perspective: 1400px;
        }
        .mk-card {
          background: #fff;
          border: 1px solid #ECEAE6;
          border-radius: 14px;
          box-shadow: 0 30px 80px rgba(28,43,26,0.18), 0 10px 30px rgba(28,43,26,0.08);
          transform: rotateY(-6deg) rotateX(4deg);
          transform-origin: center;
          padding: 0;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          max-width: 420px;
        }
        .mk-nav { background: #1C2B1A; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; }
        .mk-brand { color: #F7F5F2; font-family: 'Fraunces', serif; font-size: 12px; display:flex; align-items:center; gap:6px; }
        .mk-brand::before { content: ""; width: 6px; height: 6px; background: #D2A050; border-radius: 50%; display: inline-block; }
        .mk-dots { display: flex; gap: 4px; }
        .mk-dots span { width: 7px; height: 7px; background: rgba(247,245,242,0.25); border-radius: 50%; }
        .mk-body { padding: 14px; background: #F7F5F2; }
        .mk-greet { font-size: 10px; color: #9A9A9A; margin-bottom: 2px; }
        .mk-title { font-family: 'Fraunces', serif; font-size: 14px; color: #1C2B1A; margin-bottom: 10px; }
        .mk-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 10px; }
        .mk-stat { background: #fff; border-radius: 6px; padding: 8px 6px; border: 1px solid #ECEAE6; }
        .mk-stat-label { font-size: 7px; color: #9A9A9A; text-transform: uppercase; margin-bottom: 3px; }
        .mk-stat-value { font-family: 'Fraunces', serif; font-size: 13px; color: #1C2B1A; line-height: 1; }
        .mk-stat-value.gold { color: #D2A050; }

        .mk-chart {
          background: #fff; border: 1px solid #ECEAE6; border-radius: 6px;
          padding: 8px; height: 70px; margin-bottom: 10px; position: relative;
        }
        .mk-chart svg { width: 100%; height: 100%; }

        .mk-row {
          background: #fff; border: 1px solid #ECEAE6; border-radius: 6px;
          padding: 7px 9px; display: flex; justify-content: space-between; align-items: center;
          font-size: 9px;
        }
        .mk-row-client { color: #1C2B1A; font-weight: 500; }
        .mk-row-amt { color: #1C2B1A; font-family: 'Fraunces', serif; font-size: 10px; }
        .mk-row-status {
          display: inline-block; padding: 2px 6px; border-radius: 10px;
          background: #FAF6EE; color: #8A5A1A; font-size: 8px;
        }
        .mk-row-status.ok { background: #E6F0E3; color: #255C1A; }

        .mk-glow {
          position: absolute; inset: -40px;
          background: radial-gradient(circle at 70% 20%, rgba(210,160,80,0.22), transparent 55%);
          pointer-events: none;
          z-index: -1;
          filter: blur(20px);
        }

        @media (max-width: 960px) {
          .mk-wrap { display: none; }
        }
      `}</style>
      <div className="mk-wrap">
        <div className="mk-glow" />
        <div className="mk-card">
          <div className="mk-nav">
            <span className="mk-brand">Relya</span>
            <div className="mk-dots"><span /><span /><span /></div>
          </div>
          <div className="mk-body">
            <div className="mk-greet">Bonjour Sophie 👋</div>
            <div className="mk-title">Mes devis</div>
            <div className="mk-stats">
              <div className="mk-stat"><div className="mk-stat-label">Envoyés</div><div className="mk-stat-value">42</div></div>
              <div className="mk-stat"><div className="mk-stat-label">Gagnés</div><div className="mk-stat-value gold">18</div></div>
              <div className="mk-stat"><div className="mk-stat-label">Taux</div><div className="mk-stat-value gold">43%</div></div>
              <div className="mk-stat"><div className="mk-stat-label">CA</div><div className="mk-stat-value gold">28k€</div></div>
            </div>
            <div className="mk-chart">
              <svg viewBox="0 0 280 60" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="mkg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D2A050" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#D2A050" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,50 L40,40 L80,42 L120,30 L160,25 L200,15 L240,18 L280,8 L280,60 L0,60 Z" fill="url(#mkg)" />
                <path d="M0,50 L40,40 L80,42 L120,30 L160,25 L200,15 L240,18 L280,8" fill="none" stroke="#D2A050" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="mk-row" style={{ marginBottom: 4 }}>
              <span className="mk-row-client">Martin SARL</span>
              <span className="mk-row-amt">3 200 €</span>
              <span className="mk-row-status ok">Gagné ✓</span>
            </div>
            <div className="mk-row">
              <span className="mk-row-client">Atelier Rousseau</span>
              <span className="mk-row-amt">1 850 €</span>
              <span className="mk-row-status">Relancé</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
