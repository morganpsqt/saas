import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Politique de confidentialité — Relya",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données personnelles est l'éditeur de Relya, identifié dans les mentions légales.
      </p>

      <h2>2. Données collectées</h2>
      <p>Relya collecte les données suivantes :</p>
      <ul>
        <li>Email et mot de passe (chiffré) pour la création du compte.</li>
        <li>Informations sur les devis (nom client, email client, montant, dates).</li>
        <li>Informations de paiement traitées exclusivement par Stripe (Relya ne stocke aucune donnée bancaire).</li>
        <li>Données techniques (adresse IP, logs de connexion) pour la sécurité du service.</li>
      </ul>

      <h2>3. Finalités</h2>
      <ul>
        <li>Fournir le service d'automatisation des relances.</li>
        <li>Gérer la facturation et l'abonnement.</li>
        <li>Assurer la sécurité et prévenir les abus.</li>
      </ul>

      <h2>4. Base légale</h2>
      <p>
        Le traitement repose sur l'exécution du contrat conclu entre l'utilisateur et Relya, et sur l'intérêt légitime de l'éditeur à sécuriser son service.
      </p>

      <h2>5. Durée de conservation</h2>
      <p>
        Les données du compte sont conservées pendant toute la durée de l'abonnement, puis pendant 30 jours après résiliation. Les données de facturation sont conservées 10 ans pour obligations comptables.
      </p>

      <h2>6. Destinataires</h2>
      <p>
        Les données peuvent être partagées avec les sous-traitants techniques strictement nécessaires :
      </p>
      <ul>
        <li>Supabase (hébergement base de données, UE).</li>
        <li>Vercel (hébergement application, UE / USA).</li>
        <li>Resend (envoi d'emails transactionnels).</li>
        <li>Stripe (paiements et facturation).</li>
      </ul>

      <h2>7. Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition sur vos données. Pour exercer ces droits, écrivez à contact@relya.fr.
      </p>

      <h2>8. Cookies</h2>
      <p>
        Relya utilise uniquement des cookies strictement nécessaires à l'authentification. Aucun cookie de tracking ou publicitaire n'est utilisé.
      </p>

      <h2>9. Contact</h2>
      <p>
        Toute question relative à cette politique peut être adressée à contact@relya.fr.
      </p>
    </LegalLayout>
  );
}
