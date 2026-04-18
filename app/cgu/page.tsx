import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Conditions générales d'utilisation — Relya",
};

export default function CguPage() {
  return (
    <LegalLayout title="Conditions générales d'utilisation">
      <h2>1. Objet</h2>
      <p>
        Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'usage du service Relya, plateforme en ligne permettant aux artisans et indépendants d'automatiser les relances de devis auprès de leurs clients.
      </p>

      <h2>2. Acceptation</h2>
      <p>
        L'utilisation du service implique l'acceptation pleine et entière des présentes CGU. Tout utilisateur qui ne les accepte pas doit renoncer à utiliser Relya.
      </p>

      <h2>3. Inscription et compte</h2>
      <p>
        L'inscription est gratuite et nécessite une adresse email valide. L'utilisateur s'engage à fournir des informations exactes et à préserver la confidentialité de ses identifiants.
      </p>

      <h2>4. Période d'essai et abonnement</h2>
      <p>
        Relya propose une période d'essai gratuite de 14 jours. À l'issue de cette période, l'accès au service nécessite un abonnement payant (frais d'installation de 29 € puis 19 €/mois).
      </p>
      <p>
        L'abonnement est sans engagement de durée et peut être résilié à tout moment depuis l'espace client.
      </p>

      <h2>5. Obligations de l'utilisateur</h2>
      <ul>
        <li>Utiliser le service uniquement pour des relances commerciales légitimes.</li>
        <li>Ne pas importer d'emails de clients sans leur consentement préalable, conformément au RGPD.</li>
        <li>Ne pas utiliser Relya pour envoyer du spam ou des communications non sollicitées.</li>
      </ul>

      <h2>6. Responsabilité</h2>
      <p>
        Relya s'engage à faire ses meilleurs efforts pour assurer la continuité du service mais ne saurait être tenu responsable des interruptions temporaires, pertes de données ou erreurs d'acheminement des emails.
      </p>

      <h2>7. Résiliation</h2>
      <p>
        L'utilisateur peut résilier son abonnement à tout moment. Relya se réserve le droit de suspendre un compte en cas d'utilisation abusive du service.
      </p>

      <h2>8. Droit applicable</h2>
      <p>
        Les présentes CGU sont soumises au droit français. Tout litige relèvera de la compétence des tribunaux français.
      </p>
    </LegalLayout>
  );
}
