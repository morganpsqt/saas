import Link from "next/link";

export default function DevisEmptyState() {
  return (
    <>
      <style>{`
        .empty-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #ECEAE6;
          padding: 56px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .empty-illu {
          width: 84px;
          height: 84px;
          margin: 0 auto 20px;
          display: block;
        }
        .empty-title {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          color: #1C2B1A;
          margin-bottom: 8px;
        }
        .empty-desc {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 24px;
          max-width: 440px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }
        .empty-steps {
          display: flex;
          justify-content: center;
          gap: 0;
          margin-bottom: 28px;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
          flex-wrap: wrap;
        }
        .empty-step {
          flex: 1;
          min-width: 150px;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          position: relative;
        }
        .empty-step:not(:last-child)::after {
          content: "→";
          position: absolute;
          right: -4px;
          top: 22px;
          color: #D2A050;
          font-weight: 600;
        }
        .empty-step-num {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #1C2B1A;
          color: #F7F5F2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Fraunces', serif;
        }
        .empty-step-text {
          font-size: 13px;
          color: #1C2B1A;
          text-align: center;
          line-height: 1.4;
        }
        .empty-cta {
          display: inline-block;
          background: #1C2B1A;
          color: #F7F5F2;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.2s;
        }
        .empty-cta:hover { background: #2C3F2A; }
        @media (max-width: 540px) {
          .empty-step:not(:last-child)::after { display: none; }
        }
      `}</style>
      <div className="empty-card">
        <svg className="empty-illu" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="18" y="16" width="70" height="90" rx="8" fill="#FAF6EE" stroke="#EFD9B1" strokeWidth="2"/>
          <rect x="28" y="30" width="40" height="3" rx="1.5" fill="#D2A050"/>
          <rect x="28" y="42" width="50" height="2" rx="1" fill="#D9D5CC"/>
          <rect x="28" y="50" width="50" height="2" rx="1" fill="#D9D5CC"/>
          <rect x="28" y="58" width="35" height="2" rx="1" fill="#D9D5CC"/>
          <rect x="28" y="78" width="28" height="14" rx="3" fill="#1C2B1A"/>
          <circle cx="88" cy="92" r="16" fill="#D2A050"/>
          <path d="M82 92l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3 className="empty-title">Votre premier devis, c&apos;est parti !</h3>
        <p className="empty-desc">
          Ajoutez un devis envoyé à un client, et Relya relance automatiquement à J+3, J+7 et J+10 si vous n&apos;avez pas de réponse.
        </p>
        <div className="empty-steps">
          <div className="empty-step">
            <div className="empty-step-num">1</div>
            <div className="empty-step-text">Envoyez votre devis<br/>à votre client</div>
          </div>
          <div className="empty-step">
            <div className="empty-step-num">2</div>
            <div className="empty-step-text">Ajoutez-le ici<br/>en 30 secondes</div>
          </div>
          <div className="empty-step">
            <div className="empty-step-num">3</div>
            <div className="empty-step-text">On relance à votre place<br/>jusqu&apos;à la réponse</div>
          </div>
        </div>
        <Link href="/app/devis/nouveau" className="empty-cta">
          + Ajouter mon premier devis
        </Link>
      </div>
    </>
  );
}
