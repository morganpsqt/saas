import LegalLayout from "@/components/LegalLayout";

export const metadata = {
  title: "Mentions légales — Relya",
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Relya est édité par [Nom de l'éditeur à compléter], [forme juridique — SASU / EI / auto-entrepreneur], immatriculé au RCS de [ville] sous le numéro [SIREN à compléter].
      </p>
      <p>
        Siège social : [adresse complète à compléter].<br />
        Email : contact@relya.fr<br />
        Directeur de la publication : [Nom à compléter].
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — https://vercel.com.
      </p>
      <p>
        Les données utilisateurs sont hébergées par Supabase, Inc., dans ses datacenters situés en Europe (Francfort, Allemagne).
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur Relya (textes, logos, graphismes, code) est la propriété exclusive de l'éditeur, sauf mentions contraires. Toute reproduction sans autorisation est interdite.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question concernant les présentes mentions légales ou le service, écrivez à contact@relya.fr.
      </p>
    </LegalLayout>
  );
}
