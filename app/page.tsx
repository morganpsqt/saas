import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <style>{`
        .lp-root {
          background: #F7F5F2;
          color: #1C2B1A;
          font-family: 'DM Sans', sans-serif;
        }
        .lp-nav {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .lp-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
        }
        .lp-brand-dot {
          width: 10px; height: 10px;
          background: #D2A050;
          border-radius: 50%;
        }
        .lp-nav-links { display: flex; gap: 24px; align-items: center; font-size: 14px; }
        .lp-nav-links a { color: #3A3A3A; text-decoration: none; }
        .lp-nav-links a:hover { color: #1C2B1A; }
        .lp-cta-primary {
          background: #1C2B1A;
          color: #F7F5F2 !important;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.2s;
        }
        .lp-cta-primary:hover { background: #2C3F2A; }

        .lp-hero {
          max-width: 860px;
          margin: 0 auto;
          padding: 80px 24px 60px;
          text-align: center;
        }
        .lp-tag {
          display: inline-block;
          background: #FAF6EE;
          border: 1px solid #EFD9B1;
          color: #8A5A1A;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          margin-bottom: 24px;
        }
        .lp-h1 {
          font-family: 'Fraunces', serif;
          font-size: 56px;
          line-height: 1.05;
          color: #1C2B1A;
          margin-bottom: 20px;
        }
        .lp-h1 em {
          font-style: italic;
          color: #D2A050;
        }
        .lp-sub {
          font-size: 18px;
          color: #4A4A4A;
          line-height: 1.55;
          max-width: 620px;
          margin: 0 auto 32px;
        }
        .lp-hero-ctas {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .lp-cta-big {
          background: #1C2B1A;
          color: #F7F5F2 !important;
          padding: 14px 26px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
        }
        .lp-cta-big:hover { background: #2C3F2A; }
        .lp-cta-ghost {
          color: #1C2B1A !important;
          padding: 14px 22px;
          border-radius: 12px;
          border: 1px solid #D9D5CC;
          font-size: 15px;
          text-decoration: none;
          background: transparent;
        }
        .lp-cta-ghost:hover { background: #ECEAE6; }
        .lp-hero-meta {
          font-size: 13px;
          color: #7A7A7A;
        }

        .lp-section {
          max-width: 1000px;
          margin: 0 auto;
          padding: 80px 24px;
        }
        .lp-section-title {
          font-family: 'Fraunces', serif;
          font-size: 36px;
          color: #1C2B1A;
          margin-bottom: 12px;
          text-align: center;
        }
        .lp-section-intro {
          text-align: center;
          color: #6B7280;
          max-width: 600px;
          margin: 0 auto 48px;
          line-height: 1.55;
        }

        .lp-problem {
          background: #1C2B1A;
          color: #F7F5F2;
          padding: 80px 24px;
        }
        .lp-problem .lp-section-title { color: #F7F5F2; }
        .lp-problem .lp-section-intro { color: #C8C8C0; }
        .lp-problem-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .lp-problem-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 24px;
        }
        .lp-problem-card h3 {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          margin-bottom: 8px;
          color: #F7F5F2;
        }
        .lp-problem-card p { font-size: 14px; color: #BFBFB8; line-height: 1.55; }

        .lp-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }
        .lp-step {
          background: #fff;
          border: 1px solid #ECEAE6;
          border-radius: 16px;
          padding: 28px;
        }
        .lp-step-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #FAF6EE;
          color: #8A5A1A;
          font-family: 'Fraunces', serif;
          font-size: 16px;
          margin-bottom: 14px;
        }
        .lp-step h3 {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
          margin-bottom: 8px;
        }
        .lp-step p { font-size: 14px; color: #6B7280; line-height: 1.55; }

        .lp-stats {
          background: #FAF6EE;
          padding: 60px 24px;
        }
        .lp-stats-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 28px;
          text-align: center;
        }
        .lp-stat-num {
          font-family: 'Fraunces', serif;
          font-size: 44px;
          color: #1C2B1A;
          line-height: 1;
          margin-bottom: 8px;
        }
        .lp-stat-label {
          color: #6B7280;
          font-size: 14px;
        }

        .lp-testimonials {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .lp-testimonial {
          background: #fff;
          border: 1px solid #ECEAE6;
          border-radius: 16px;
          padding: 28px;
        }
        .lp-testimonial-quote {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          color: #1C2B1A;
          line-height: 1.5;
          margin-bottom: 16px;
        }
        .lp-testimonial-author { font-size: 14px; color: #3A3A3A; font-weight: 500; }
        .lp-testimonial-role { font-size: 13px; color: #9A9A9A; }
        .lp-testimonial-tag {
          display: inline-block;
          font-size: 11px;
          color: #8A5A1A;
          background: #FAF6EE;
          padding: 2px 8px;
          border-radius: 6px;
          margin-top: 8px;
        }

        .lp-pricing {
          max-width: 520px;
          margin: 0 auto;
          background: #fff;
          border: 1px solid #ECEAE6;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
        }
        .lp-pricing h3 {
          font-family: 'Fraunces', serif;
          font-size: 24px;
          color: #1C2B1A;
          margin-bottom: 8px;
        }
        .lp-pricing-sub { color: #6B7280; margin-bottom: 28px; font-size: 14px; }
        .lp-pricing-lines {
          background: #FAF6EE;
          border: 1px solid #EFD9B1;
          border-radius: 14px;
          padding: 22px;
          margin-bottom: 22px;
          text-align: left;
        }
        .lp-pricing-line {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 6px 0;
          font-size: 14px;
          color: #3A3A3A;
        }
        .lp-pricing-line strong {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          color: #1C2B1A;
        }
        .lp-pricing-features { list-style: none; text-align: left; margin: 0 0 24px; padding: 0; }
        .lp-pricing-features li {
          font-size: 14px;
          color: #3A3A3A;
          padding: 6px 0;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .lp-pricing-features li::before { content: "✓"; color: #D2A050; font-weight: 700; }

        .lp-faq-list { max-width: 720px; margin: 0 auto; }
        .lp-faq-item {
          border-bottom: 1px solid #ECEAE6;
          padding: 22px 0;
        }
        .lp-faq-q {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          color: #1C2B1A;
          margin-bottom: 8px;
        }
        .lp-faq-a { color: #6B7280; line-height: 1.55; font-size: 14.5px; }

        .lp-final {
          text-align: center;
          padding: 80px 24px;
          background: #1C2B1A;
          color: #F7F5F2;
        }
        .lp-final h2 {
          font-family: 'Fraunces', serif;
          font-size: 40px;
          margin-bottom: 14px;
        }
        .lp-final p { color: #C8C8C0; margin-bottom: 26px; }
        .lp-final-cta {
          display: inline-block;
          background: #D2A050;
          color: #1C2B1A !important;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 500;
          text-decoration: none;
        }
        .lp-final-cta:hover { background: #E1B064; }

        .lp-footer {
          background: #F7F5F2;
          padding: 40px 24px;
          border-top: 1px solid #ECEAE6;
        }
        .lp-footer-inner {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #9A9A9A;
        }
        .lp-footer a { color: #6B7280; text-decoration: none; margin-right: 16px; }
        .lp-footer a:hover { color: #1C2B1A; }

        @media (max-width: 640px) {
          .lp-h1 { font-size: 40px; }
          .lp-section-title { font-size: 28px; }
          .lp-final h2 { font-size: 30px; }
        }
      `}</style>

      <div className="lp-root">
        <header>
          <nav className="lp-nav">
            <div className="lp-brand">
              <span className="lp-brand-dot" />
              Relya
            </div>
            <div className="lp-nav-links">
              <Link href="/pricing">Tarifs</Link>
              <Link href="/login">Connexion</Link>
              <Link href="/signup" className="lp-cta-primary">Essayer gratuitement</Link>
            </div>
          </nav>
        </header>

        <section className="lp-hero">
          <div className="lp-tag">Pour artisans, plombiers, électriciens & indépendants</div>
          <h1 className="lp-h1">
            3× plus de devis <em>signés</em>,<br />sans y penser.
          </h1>
          <p className="lp-sub">
            Relya relance automatiquement vos clients à J+2, J+5 et J+10 après l'envoi d'un devis. Vous gagnez des chantiers pendant que vous travaillez sur les vôtres.
          </p>
          <div className="lp-hero-ctas">
            <Link href="/signup" className="lp-cta-big">Essayer gratuitement 14 jours →</Link>
            <Link href="/pricing" className="lp-cta-ghost">Voir les tarifs</Link>
          </div>
          <div className="lp-hero-meta">
            Aucune carte bancaire requise • Configuration en 2 minutes
          </div>
        </section>

        <section className="lp-problem">
          <h2 className="lp-section-title">Vos devis dorment. Vos clients hésitent.</h2>
          <p className="lp-section-intro">
            70 % des devis signés le sont après une ou plusieurs relances. Mais relancer prend du temps, et c'est souvent la tâche qu'on repousse.
          </p>
          <div className="lp-problem-grid">
            <div className="lp-problem-card">
              <h3>Sans relance</h3>
              <p>Le client oublie, part chez un concurrent ou repousse indéfiniment. Votre devis finit aux oubliettes.</p>
            </div>
            <div className="lp-problem-card">
              <h3>Relances manuelles</h3>
              <p>Vous y pensez le dimanche soir, jamais le bon jour. Et finalement, vous n'envoyez rien.</p>
            </div>
            <div className="lp-problem-card">
              <h3>Avec Relya</h3>
              <p>Chaque devis est relancé automatiquement aux bons moments avec un ton professionnel. Vous ne faites rien.</p>
            </div>
          </div>
        </section>

        <section className="lp-section">
          <h2 className="lp-section-title">Comment ça marche</h2>
          <p className="lp-section-intro">En 3 étapes, vous ne ratez plus aucun devis.</p>
          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-step-num">1</div>
              <h3>Ajoutez votre devis</h3>
              <p>Nom du client, email, montant, date d'envoi. 30 secondes chrono.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">2</div>
              <h3>Relya prend le relais</h3>
              <p>Vos clients reçoivent une relance à J+2, puis J+5, puis J+10. Vous ne touchez à rien.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">3</div>
              <h3>Suivez les signatures</h3>
              <p>Dès qu'un client répond ou signe, marquez le devis comme gagné. Vos stats se mettent à jour.</p>
            </div>
          </div>
        </section>

        <section className="lp-stats">
          <div className="lp-stats-grid">
            <div>
              <div className="lp-stat-num">3×</div>
              <div className="lp-stat-label">Plus de devis signés en moyenne</div>
            </div>
            <div>
              <div className="lp-stat-num">0 min</div>
              <div className="lp-stat-label">Passées à relancer chaque semaine</div>
            </div>
            <div>
              <div className="lp-stat-num">2 min</div>
              <div className="lp-stat-label">Pour configurer votre compte</div>
            </div>
          </div>
        </section>

        <section className="lp-section">
          <h2 className="lp-section-title">Ce que disent les artisans</h2>
          <p className="lp-section-intro">Des témoignages d'utilisateurs au quotidien.</p>
          <div className="lp-testimonials">
            <div className="lp-testimonial">
              <div className="lp-testimonial-quote">
                « Je signe 2 devis de plus par semaine sans avoir à y penser. Le retour sur investissement a été immédiat. »
              </div>
              <div className="lp-testimonial-author">Julien M.</div>
              <div className="lp-testimonial-role">Plombier, Lyon</div>
              <div className="lp-testimonial-tag">exemple</div>
            </div>
            <div className="lp-testimonial">
              <div className="lp-testimonial-quote">
                « J'avais 40 devis en attente. En 2 mois, j'en ai converti 14 grâce aux relances. Bluffant. »
              </div>
              <div className="lp-testimonial-author">Sophie L.</div>
              <div className="lp-testimonial-role">Électricienne, Bordeaux</div>
              <div className="lp-testimonial-tag">exemple</div>
            </div>
            <div className="lp-testimonial">
              <div className="lp-testimonial-quote">
                « Avant, j'oubliais de relancer. Maintenant c'est Relya qui bosse, et moi je fais mes chantiers. »
              </div>
              <div className="lp-testimonial-author">Karim B.</div>
              <div className="lp-testimonial-role">Menuisier, Marseille</div>
              <div className="lp-testimonial-tag">exemple</div>
            </div>
          </div>
        </section>

        <section className="lp-section" id="pricing">
          <h2 className="lp-section-title">Un tarif simple</h2>
          <p className="lp-section-intro">Pas d'engagement. Résiliable à tout moment.</p>
          <div className="lp-pricing">
            <h3>Relya complet</h3>
            <p className="lp-pricing-sub">14 jours d'essai gratuit, puis :</p>
            <div className="lp-pricing-lines">
              <div className="lp-pricing-line">
                <span>Frais d'installation (une fois)</span>
                <strong>29 €</strong>
              </div>
              <div className="lp-pricing-line">
                <span>Abonnement mensuel</span>
                <strong>19 €</strong>
              </div>
            </div>
            <ul className="lp-pricing-features">
              <li>Devis illimités</li>
              <li>Relances automatiques J+2, J+5, J+10</li>
              <li>Emails personnalisés à votre nom</li>
              <li>Dashboard avec vos statistiques</li>
              <li>Support par email</li>
            </ul>
            <Link href="/signup" className="lp-cta-big" style={{ display: "block" }}>
              Commencer mon essai gratuit →
            </Link>
          </div>
        </section>

        <section className="lp-section">
          <h2 className="lp-section-title">Questions fréquentes</h2>
          <div className="lp-faq-list">
            <div className="lp-faq-item">
              <div className="lp-faq-q">Comment fonctionne l'essai gratuit ?</div>
              <div className="lp-faq-a">Vous avez 14 jours pour tester Relya gratuitement, sans saisir de carte bancaire. À la fin de l'essai, vous activez votre abonnement ou vous arrêtez, sans frais.</div>
            </div>
            <div className="lp-faq-item">
              <div className="lp-faq-q">Les relances sont-elles envoyées à mon nom ?</div>
              <div className="lp-faq-a">Oui. Vos clients reçoivent une relance signée en votre nom, avec votre email en réponse directe.</div>
            </div>
            <div className="lp-faq-item">
              <div className="lp-faq-q">Pourquoi des frais d'installation de 29 € ?</div>
              <div className="lp-faq-a">Ils couvrent la configuration initiale de votre compte et garantissent que chaque utilisateur est engagé. Ils sont facturés une seule fois.</div>
            </div>
            <div className="lp-faq-item">
              <div className="lp-faq-q">Puis-je résilier à tout moment ?</div>
              <div className="lp-faq-a">Oui. Vous gérez votre abonnement depuis votre espace client et pouvez l'annuler en un clic, sans justificatif.</div>
            </div>
            <div className="lp-faq-item">
              <div className="lp-faq-q">Mes données sont-elles en sécurité ?</div>
              <div className="lp-faq-a">Vos données sont hébergées en Europe (serveurs Supabase Francfort) et ne sont jamais revendues. Paiements sécurisés via Stripe.</div>
            </div>
          </div>
        </section>

        <section className="lp-final">
          <h2>Laissez Relya travailler pour vous.</h2>
          <p>14 jours d'essai gratuit. Configuration en 2 minutes.</p>
          <Link href="/signup" className="lp-final-cta">Créer mon compte gratuitement →</Link>
        </section>

        <footer className="lp-footer">
          <div className="lp-footer-inner">
            <div>© {new Date().getFullYear()} Relya. Tous droits réservés.</div>
            <div>
              <Link href="/cgu">CGU</Link>
              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/politique-confidentialite">Confidentialité</Link>
              <Link href="/pricing">Tarifs</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
