export const TIPS: string[] = [
  "Envoyez toujours votre devis sous 24 h : un client ayant reçu rapidement son devis a 2× plus de chances de l'accepter.",
  "Une relance envoyée à J+3 double vos chances de signer — la plupart des concurrents ne relancent jamais.",
  "Un devis clair tient sur une page : intitulés courts, prix visibles, conditions en bas. Moins il y a à lire, plus vite il signe.",
  "Mentionnez toujours un délai de validité (ex. 30 jours) : cela crée une urgence douce et pousse à la décision.",
  "Appelez après l'envoi du devis, même 30 secondes : « Je voulais m'assurer que vous l'aviez bien reçu ». Taux d'accroche +40 %.",
  "Ne commencez jamais un email de relance par « Je me permets de… ». Préférez une question directe : « Avez-vous pu en discuter ? ».",
  "Ajoutez une photo d'un chantier similaire dans votre devis : preuve sociale visuelle, argument imparable.",
  "Les devis envoyés le mardi et le jeudi ont le meilleur taux d'ouverture. Évitez le lundi matin et le vendredi après-midi.",
  "Proposez toujours 2 options (standard + confort) : le client choisit entre deux oui plutôt qu'entre un oui et un non.",
  "Un acompte de 30 % à la signature protège votre trésorerie — et filtre les clients sérieux.",
  "Gardez une trace écrite de chaque échange : SMS, mail, note vocale. En cas de litige, c'est ce qui fera la différence.",
  "Répondez aux avis Google, même négatifs. Un artisan qui répond poliment rassure 3× plus qu'un concurrent sans avis.",
  "Demandez un avis après chaque chantier terminé : 1 client sur 3 le laissera si vous le demandez simplement.",
  "Un devis détaillé > un prix rond. « 2 847 € » paraît plus juste que « 2 800 € » — contre-intuitif mais efficace.",
  "Facturez le déplacement si vous en avez assez des devis gratuits aux curieux : 50 € déduits si le chantier est signé.",
  "Photographiez le chantier avant, pendant, après. C'est votre meilleur outil marketing pour le prochain client.",
  "Un client qui négocie n'est pas un client difficile — c'est un client intéressé. Gardez 5 à 10 % de marge pour y répondre.",
  "N'acceptez jamais un chantier uniquement sur devis oral. Même entre pros, un écrit protège les deux parties.",
  "Votre plus mauvais client vaut moins que vos 3 prochains bons : ne cédez pas sur le tarif pour « sauver » un dossier compliqué.",
  "Le bouche-à-oreille reste le canal #1 pour les artisans. Offrez 50 € au client qui vous amène un nouveau chantier signé.",
  "Sur les devis > 10 000 €, proposez un rendez-vous en visio avant d'envoyer. Humaniser la relation double le taux de signature.",
  "Réservez 30 min le vendredi pour faire le point sur vos devis en attente. C'est le jour où les gens finissent leurs décisions.",
];

export function getTipOfTheDay(): string {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return TIPS[dayIndex % TIPS.length];
}
