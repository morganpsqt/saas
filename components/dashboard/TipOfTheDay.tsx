import { getTipOfTheDay } from "@/lib/tips";

export default function TipOfTheDay() {
  const tip = getTipOfTheDay();
  return (
    <>
      <style>{`
        .tip-card {
          background: linear-gradient(135deg, #FAF6EE 0%, #F3EAD3 100%);
          border: 1px solid #EFD9B1;
          border-radius: 14px;
          padding: 16px 20px;
          margin-bottom: 28px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .tip-icon {
          flex-shrink: 0;
          width: 34px; height: 34px;
          background: #D2A050;
          color: #fff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .tip-content { flex: 1; }
        .tip-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #8A5A1A;
          font-weight: 500;
          margin-bottom: 3px;
        }
        .tip-text {
          font-size: 14px;
          color: #1C2B1A;
          line-height: 1.55;
        }
      `}</style>
      <div className="tip-card">
        <div className="tip-icon">💡</div>
        <div className="tip-content">
          <div className="tip-label">Conseil du jour</div>
          <div className="tip-text">{tip}</div>
        </div>
      </div>
    </>
  );
}
