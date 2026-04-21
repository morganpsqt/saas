export type TipCategory =
  | 'nutrition'
  | 'training'
  | 'mindset'
  | 'recovery'
  | 'habits';

export type Tip = {
  id: number;
  category: TipCategory;
  emoji: string;
  text: string;
};

export const dailyTips: Tip[] = [
  // Nutrition (7)
  {
    id: 1,
    category: 'nutrition',
    emoji: '🥚',
    text: 'Ajoute 30g de protéines à ton petit-déj. Yaourt grec, œufs, ou whey — tu tiendras mieux la matinée et tu grignoteras moins.',
  },
  {
    id: 2,
    category: 'nutrition',
    emoji: '💧',
    text: 'Bois un grand verre d\'eau avant chaque repas. Ça module l\'appétit et ça évite de confondre soif et faim.',
  },
  {
    id: 3,
    category: 'nutrition',
    emoji: '🥦',
    text: 'Règle simple du repas équilibré : une protéine, un glucide complet, une portion de légumes, un peu de bon gras. Le reste est du détail.',
  },
  {
    id: 4,
    category: 'nutrition',
    emoji: '🍫',
    text: 'Tu veux du sucré ? Prends-en, mais mange-le assis. Debout ou devant l\'écran, tu n\'en profites pas et tu en veux plus.',
  },
  {
    id: 5,
    category: 'nutrition',
    emoji: '🧂',
    text: 'Sale tes aliments bruts sans crainte si tu cuisines maison. Le sel problématique vient des produits ultra-transformés, pas du sel de table.',
  },
  {
    id: 6,
    category: 'nutrition',
    emoji: '🐟',
    text: '2 portions de poisson gras par semaine (saumon, sardine, maquereau). Oméga-3, protéines, peu d\'efforts, gros bénéfices.',
  },
  {
    id: 7,
    category: 'nutrition',
    emoji: '📝',
    text: 'Écris ce que tu manges 3 jours par an, juste pour voir. Pas pour tracker à vie — pour prendre conscience de la réalité vs ta perception.',
  },

  // Training (7)
  {
    id: 8,
    category: 'training',
    emoji: '🏋️',
    text: 'Le jour sans motivation = le jour qui fait la différence. Pas besoin de séance parfaite : 30 min et tu y retourneras demain.',
  },
  {
    id: 9,
    category: 'training',
    emoji: '📈',
    text: 'Note chaque séance. Charge × reps × séries. Sans mesure, pas de progression — c\'est valable pour la muscu comme pour le reste.',
  },
  {
    id: 10,
    category: 'training',
    emoji: '🧱',
    text: 'Pour progresser, soit tu ajoutes une rep, soit tu ajoutes un kilo. Pas les deux en même temps, pas rien non plus.',
  },
  {
    id: 11,
    category: 'training',
    emoji: '⏱️',
    text: 'Un entraînement de 30 min bien fait vaut mieux qu\'une séance de 90 min bâclée. Intensité > durée.',
  },
  {
    id: 12,
    category: 'training',
    emoji: '🎯',
    text: 'Priorise les mouvements polyarticulaires : squat, hip hinge, poussée, tirage. Les bras et abdos se travaillent ensuite.',
  },
  {
    id: 13,
    category: 'training',
    emoji: '🔁',
    text: 'Stagnation depuis 3-4 semaines ? Fais une semaine de deload (50-60% du volume). Tu repartiras mieux derrière.',
  },
  {
    id: 14,
    category: 'training',
    emoji: '👣',
    text: 'Viser 8 000 à 12 000 pas par jour. Plus efficace que le cardio de 30 min 3x/sem pour la santé et la silhouette.',
  },

  // Mindset (6)
  {
    id: 15,
    category: 'mindset',
    emoji: '🪞',
    text: 'Compare-toi à toi d\'il y a 3 mois, pas à l\'Instagram d\'aujourd\'hui. Les seules stats qui comptent sont les tiennes.',
  },
  {
    id: 16,
    category: 'mindset',
    emoji: '🔄',
    text: 'Règle d\'or : jamais deux jours off de suite. Un raté, c\'est un raté. Deux ratés, c\'est le début d\'un abandon.',
  },
  {
    id: 17,
    category: 'mindset',
    emoji: '🧭',
    text: 'Pose-toi cette question chaque dimanche : qu\'est-ce que mon moi de dans 6 mois me remercierait d\'avoir fait cette semaine ?',
  },
  {
    id: 18,
    category: 'mindset',
    emoji: '🚫',
    text: 'Pensée binaire = ton pire ennemi. "J\'ai mangé un cookie donc j\'ai foiré" → non. Un cookie, c\'est un cookie. Pas une trahison.',
  },
  {
    id: 19,
    category: 'mindset',
    emoji: '⚖️',
    text: 'La balance ment sur le court terme (hydratation, glycogène, sel). Regarde la moyenne sur 10 jours, jamais le chiffre isolé.',
  },
  {
    id: 20,
    category: 'mindset',
    emoji: '💭',
    text: 'Action précède motivation. Mets les baskets et sors. La motivation arrive en cours de route, pas avant.',
  },

  // Recovery (5)
  {
    id: 21,
    category: 'recovery',
    emoji: '😴',
    text: 'Couche-toi 30 min plus tôt cette semaine. Pas plus, pas moins. C\'est le plus gros levier de récupération existant.',
  },
  {
    id: 22,
    category: 'recovery',
    emoji: '☀️',
    text: '10 min de lumière extérieure dans l\'heure du réveil. Ton sommeil de ce soir en dépend, littéralement.',
  },
  {
    id: 23,
    category: 'recovery',
    emoji: '☕',
    text: 'Stop caféine à midi. Demi-vie 5-6h. Un café à 16h = la moitié encore active à 22h, et ton sommeil avec.',
  },
  {
    id: 24,
    category: 'recovery',
    emoji: '🚶',
    text: '10 min de marche après le dîner = meilleure glycémie postprandiale, digestion plus douce, sommeil plus profond.',
  },
  {
    id: 25,
    category: 'recovery',
    emoji: '📱',
    text: 'Moins d\'écrans 1h avant le coucher. Pas la lumière bleue, surtout le contenu : il te garde activé/anxieux.',
  },

  // Habits (5)
  {
    id: 26,
    category: 'habits',
    emoji: '🎯',
    text: 'Une habitude à la fois. Pas cinq. Installe-en une pendant 30 jours avant d\'en ajouter une autre. Ça tient dans la durée.',
  },
  {
    id: 27,
    category: 'habits',
    emoji: '🔗',
    text: 'Empile : "Après [habitude existante], je ferai [nouvelle habitude]". L\'ancienne sert de déclencheur automatique.',
  },
  {
    id: 28,
    category: 'habits',
    emoji: '🏠',
    text: 'Visible = probable. Tennis à la porte, gourde sur le bureau. Invisible = improbable. Biscuits dans le placard, pas sur le plan.',
  },
  {
    id: 29,
    category: 'habits',
    emoji: '⚡',
    text: 'Baisse la friction. Prépare tes repas la veille. Prends un abo salle sur ton chemin. La volonté s\'use, la logistique non.',
  },
  {
    id: 30,
    category: 'habits',
    emoji: '✅',
    text: 'Coche ton habitude chaque jour, même symboliquement. Le cerveau ancre ce qui est suivi d\'une récompense immédiate.',
  },
];

export function getTodayTip(): Tip {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return dailyTips[dayOfYear % dailyTips.length];
}

export function greetingFr(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}
