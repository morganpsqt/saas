"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  hasProfile: boolean;
}

export default function OnboardingWizard({ hasProfile }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Déclenche l'email de bienvenue (idempotent côté API)
    fetch("/api/auth/welcome", { method: "POST" }).catch(() => {});
  }, []);

  async function dismiss() {
    setClosing(true);
    // Marque l'onboarding comme vu
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ has_seen_onboarding: true }),
    });
    setVisible(false);
    router.refresh();
  }

  if (!visible) return null;

  const steps = [
    {
      icon: "👋",
      title: "Bienvenue sur Relya !",
      desc: "Relya relance automatiquement vos clients après l'envoi d'un devis, pour que vous signiez plus — sans y penser.",
      cta: { label: "Commencer →", action: () => setStep(1) },
    },
    {
      icon: "📋",
      title: "Ajoutez votre premier devis",
      desc: "Il suffit du nom du client, son email, le montant et la date d'envoi. On s'occupe du reste : J+3, J+7, J+10.",
      cta: {
        label: "Ajouter un devis",
        href: "/app/devis/nouveau",
        action: () => { dismiss(); },
      },
      secondary: { label: "Plus tard", action: () => setStep(2) },
    },
    {
      icon: hasProfile ? "✉" : "✨",
      title: hasProfile ? "Personnalisez vos emails" : "Personnalisez votre expérience",
      desc: hasProfile
        ? "Adaptez les emails de relance à votre voix et à votre métier pour un meilleur taux de signature."
        : "Ajoutez votre nom, votre entreprise et votre logo pour que vos emails soient signés correctement.",
      cta: {
        label: hasProfile ? "Personnaliser les emails" : "Compléter mon profil",
        href: hasProfile ? "/app/parametres/emails" : "/app/parametres/profil",
        action: () => { dismiss(); },
      },
      secondary: { label: "Terminer", action: () => { dismiss(); } },
    },
  ];

  const current = steps[step];

  return (
    <>
      <style>{`
        .ob-backdrop {
          position: fixed; inset: 0; background: rgba(28,43,26,0.55);
          display: flex; align-items: center; justify-content: center;
          z-index: 90; padding: 20px;
          animation: ob-fade-in 0.3s ease-out;
        }
        @keyframes ob-fade-in {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes ob-scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ob-modal {
          background: #fff; border-radius: 18px;
          max-width: 460px; width: 100%;
          box-shadow: 0 24px 80px rgba(28,43,26,0.25);
          animation: ob-scale-in 0.4s ease-out;
          overflow: hidden;
        }
        .ob-top {
          background: linear-gradient(135deg, #1C2B1A 0%, #2C3F2A 100%);
          padding: 32px 28px 24px;
          color: #F7F5F2;
          text-align: center;
          position: relative;
        }
        .ob-icon {
          width: 64px; height: 64px; margin: 0 auto 16px;
          border-radius: 50%;
          background: rgba(210,160,80,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 30px;
        }
        .ob-title {
          font-family: 'Fraunces', serif; font-size: 22px;
          margin-bottom: 8px;
        }
        .ob-desc {
          font-size: 14px; color: rgba(247,245,242,0.75);
          line-height: 1.55; max-width: 360px; margin: 0 auto;
        }
        .ob-progress {
          display: flex; justify-content: center; gap: 8px; margin-top: 20px;
        }
        .ob-dot {
          width: 22px; height: 4px; border-radius: 3px;
          background: rgba(247,245,242,0.2);
          transition: background 0.3s;
        }
        .ob-dot.active { background: #D2A050; }
        .ob-actions {
          padding: 24px 28px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .ob-btn {
          display: block; text-align: center; padding: 12px 18px;
          border-radius: 10px; font-size: 14px; font-weight: 500;
          font-family: inherit; cursor: pointer; border: none;
          text-decoration: none;
          transition: background 0.2s;
        }
        .ob-btn.primary { background: #1C2B1A; color: #F7F5F2; }
        .ob-btn.primary:hover { background: #2C3F2A; }
        .ob-btn.secondary { background: #F7F5F2; color: #6B7280; }
        .ob-btn.secondary:hover { background: #ECEAE6; }
        .ob-close {
          position: absolute; top: 12px; right: 14px;
          background: none; border: none; color: rgba(247,245,242,0.5);
          font-size: 20px; cursor: pointer; line-height: 1;
        }
        .ob-close:hover { color: #F7F5F2; }
      `}</style>

      <div className={`ob-backdrop ${closing ? "closing" : ""}`}>
        <div className="ob-modal">
          <div className="ob-top">
            <button className="ob-close" onClick={dismiss} aria-label="Fermer">×</button>
            <div className="ob-icon">{current.icon}</div>
            <div className="ob-title">{current.title}</div>
            <p className="ob-desc">{current.desc}</p>
            <div className="ob-progress">
              {steps.map((_, i) => (
                <span key={i} className={`ob-dot ${i === step ? "active" : ""}`} />
              ))}
            </div>
          </div>
          <div className="ob-actions">
            {"href" in current.cta && current.cta.href ? (
              <Link href={current.cta.href} className="ob-btn primary" onClick={current.cta.action}>
                {current.cta.label}
              </Link>
            ) : (
              <button className="ob-btn primary" onClick={current.cta.action}>
                {current.cta.label}
              </button>
            )}
            {current.secondary && (
              <button className="ob-btn secondary" onClick={current.secondary.action}>
                {current.secondary.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
