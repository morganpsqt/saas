import Link from "next/link";

export const metadata = {
  title: "Tarifs — Relya",
  description: "Un tarif simple : 29 € d'installation + 19 €/mois. 14 jours d'essai gratuit, sans engagement.",
};

export default function PricingPage() {
  return (
    <>
      <style>{`
        .pr-root {
          min-height: 100vh;
          background: #F7F5F2;
          color: #1C2B1A;
          font-family: 'DM Sans', sans-serif;
        }
        .pr-nav {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pr-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
          text-decoration: none;
        }
        .pr-brand-dot {
          width: 10px; height: 10px;
          background: #D2A050;
          border-radius: 50%;
        }
        .pr-nav-links { display: flex; gap: 24px; align-items: center; font-size: 14px; }
        .pr-nav-links a { color: #3A3A3A; text-decoration: none; }
        .pr-cta-primary {
          background: #1C2B1A;
          color: #F7F5F2 !important;
          padding: 10px 18px;
          border-radius: 10px;
        }

        .pr-hero {
          max-width: 720px;
          margin: 0 auto;
          padding: 60px 24px 30px;
          text-align: center;
        }
        .pr-h1 {
          font-family: 'Fraunces', serif;
          font-size: 48px;
          color: #1C2B1A;
          margin-bottom: 14px;
          line-height: 1.1;
        }
        .pr-sub {
          font-size: 17px;
          color: #4A4A4A;
          line-height: 1.55;
        }

        .pr-wrap {
          max-width: 560px;
          margin: 40px auto 80px;
          padding: 0 24px;
        }
        .pr-card {
          background: #fff;
          border: 1px solid #ECEAE6;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
        }
        .pr-plan-name {
          font-family: 'Fraunces', serif;
          font-size: 24px;
          color: #1C2B1A;
          margin-bottom: 6px;
        }
        .pr-plan-trial { font-size: 13px; color: #8A5A1A; background: #FAF6EE; display: inline-block; padding: 4px 10px; border-radius: 999px; margin-bottom: 24px; }
        .pr-price-box {
          background: #FAF6EE;
          border: 1px solid #EFD9B1;
          border-radius: 14px;
          padding: 22px;
          margin-bottom: 24px;
          text-align: left;
        }
        .pr-price-line {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 6px 0;
          font-size: 14px;
          color: #3A3A3A;
        }
        .pr-price-line strong {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
        }
        .pr-features { list-style: none; margin: 0 0 28px; padding: 0; text-align: left; }
        .pr-features li {
          padding: 6px 0;
          font-size: 14.5px;
          color: #3A3A3A;
          display: flex;
          gap: 10px;
        }
        .pr-features li::before { content: "✓"; color: #D2A050; font-weight: 700; }
        .pr-cta {
          display: block;
          background: #1C2B1A;
          color: #F7F5F2;
          padding: 14px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 500;
        }
        .pr-cta:hover { background: #2C3F2A; }

        .pr-faq { max-width: 720px; margin: 0 auto 80px; padding: 0 24px; }
        .pr-faq h2 {
          font-family: 'Fraunces', serif;
          font-size: 30px;
          color: #1C2B1A;
          margin-bottom: 24px;
          text-align: center;
        }
        .pr-faq-item {
          border-bottom: 1px solid #ECEAE6;
          padding: 20px 0;
        }
        .pr-faq-q {
          font-family: 'Fraunces', serif;
          font-size: 17px;
          color: #1C2B1A;
          margin-bottom: 6px;
        }
        .pr-faq-a { font-size: 14.5px; color: #6B7280; line-height: 1.55; }

        .pr-footer {
          background: #F7F5F2;
          padding: 32px 24px;
          border-top: 1px solid #ECEAE6;
          font-size: 13px;
          color: #9A9A9A;
          text-align: center;
        }
        .pr-footer a { color: #6B7280; margin: 0 10px; text-decoration: none; }
      `}</style>

      <div className="pr-root">
        <nav className="pr-nav">
          <Link href="/" className="pr-brand">
            <span className="pr-brand-dot" />
            Relya
          </Link>
          <div className="pr-nav-links">
            <Link href="/login">Connexion</Link>
            <Link href="/signup" className="pr-cta-primary">Essayer gratuitement</Link>
          </div>
        </nav>

        <section className="pr-hero">
          <h1 className="pr-h1">Un tarif simple, sans surprise.</h1>
          <p className="pr-sub">
            14 jours pour tester, puis 29 € d'installation + 19 €/mois. Résiliable à tout moment.
          </p>
        </section>

        <div className="pr-wrap">
          <div className="pr-card">
            <div className="pr-plan-name">Relya complet</div>
            <div className="pr-plan-trial">14 jours d'essai gratuit</div>

            <div className="pr-price-box">
              <div className="pr-price-line">
                <span>Frais d'installation (une fois)</span>
                <strong>29 €</strong>
              </div>
              <div className="pr-price-line">
                <span>Abonnement mensuel</span>
                <strong>19 €</strong>
              </div>
            </div>

            <ul className="pr-features">
              <li>Devis illimités</li>
              <li>Relances automatiques J+2, J+5, J+10</li>
              <li>Emails envoyés à votre nom, réponses directes chez vous</li>
              <li>Dashboard avec stats signés / en attente / perdus</li>
              <li>Portail client pour gérer votre abonnement</li>
              <li>Support par email sous 24 h</li>
            </ul>

            <Link href="/signup" className="pr-cta">Commencer mon essai gratuit →</Link>
          </div>
        </div>

        <section className="pr-faq">
          <h2>Questions fréquentes</h2>
          <div className="pr-faq-item">
            <div className="pr-faq-q">Vais-je être prélevé pendant l'essai ?</div>
            <div className="pr-faq-a">Non. L'essai de 14 jours ne nécessite aucune carte bancaire. Vous ne payez que si vous décidez d'activer votre abonnement à la fin.</div>
          </div>
          <div className="pr-faq-item">
            <div className="pr-faq-q">Que se passe-t-il à la fin des 14 jours ?</div>
            <div className="pr-faq-a">Si vous n'avez pas activé votre abonnement, l'accès au dashboard est suspendu. Vos données restent conservées 30 jours au cas où vous changiez d'avis.</div>
          </div>
          <div className="pr-faq-item">
            <div className="pr-faq-q">Puis-je résilier facilement ?</div>
            <div className="pr-faq-a">Oui. Depuis votre espace client, un bouton vous redirige vers le portail de gestion sécurisé Stripe. Résiliation en un clic.</div>
          </div>
          <div className="pr-faq-item">
            <div className="pr-faq-q">Y a-t-il une limite de devis ?</div>
            <div className="pr-faq-a">Non. L'abonnement inclut un nombre illimité de devis et de relances.</div>
          </div>
        </section>

        <footer className="pr-footer">
          © {new Date().getFullYear()} Relya ·
          <Link href="/cgu">CGU</Link>·
          <Link href="/mentions-legales">Mentions légales</Link>·
          <Link href="/politique-confidentialite">Confidentialité</Link>
        </footer>
      </div>
    </>
  );
}
