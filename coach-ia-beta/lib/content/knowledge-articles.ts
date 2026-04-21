export type ArticleCategory = 'body' | 'nutrition' | 'training' | 'lifestyle' | 'mindset';

export type Article = {
  slug: string;
  category: ArticleCategory;
  title: string;
  summary: string;
  readMinutes: number;
  emoji: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
  keyTakeaways: string[];
};

export const CATEGORIES: { key: ArticleCategory; labelFr: string; emoji: string; color: string }[] = [
  { key: 'body', labelFr: 'Comprendre ton corps', emoji: '🧬', color: '#8b5cf6' },
  { key: 'nutrition', labelFr: 'Nutrition de base', emoji: '🍎', color: '#10b981' },
  { key: 'training', labelFr: 'Entraînement intelligent', emoji: '🏋️', color: '#f59e0b' },
  { key: 'lifestyle', labelFr: 'Routine et lifestyle', emoji: '😴', color: '#0ea5e9' },
  { key: 'mindset', labelFr: 'Psychologie du changement', emoji: '🧠', color: '#ec4899' },
];

export const articles: Article[] = [
  // ==================== COMPRENDRE TON CORPS ====================
  {
    slug: 'hypertrophie-muscles',
    category: 'body',
    title: 'Comment tes muscles grossissent vraiment',
    summary: 'Derrière le bras qui gonfle à l\'entraînement, un processus précis. Voici ce qui se passe, sans jargon.',
    readMinutes: 4,
    emoji: '💪',
    sections: [
      {
        heading: 'Ce n\'est pas la séance qui te fait grandir',
        paragraphs: [
          "Quand tu soulèves une charge, tu ne construis pas de muscle pendant la série — tu l\'endommages. Tu crées des micro-déchirures dans les fibres, tu fatigues les motoneurones qui les commandent, et tu accumules des signaux chimiques. Le muscle grossit après, au repos, pendant que ton corps réagit à l\'agression en reconstruisant plus gros et plus résistant.",
          "C\'est pour ça qu\'une séance sans récupération correcte n\'a quasiment aucun effet : le stimulus est là, mais la machine qui fabrique le tissu n\'a pas le temps ni les ressources pour faire son boulot.",
        ],
      },
      {
        heading: 'Les trois leviers qui comptent',
        paragraphs: [
          "La recherche moderne (Schoenfeld en tête) identifie trois mécanismes principaux de l\'hypertrophie :",
          "1. La **tension mécanique** : forcer le muscle à produire beaucoup de force contre une charge lourde ou proche de l\'échec. C\'est le levier le plus puissant.",
          "2. Le **stress métabolique** : l\'accumulation de métabolites pendant des séries longues qui te font brûler. Utile mais secondaire.",
          "3. Les **dommages musculaires** : les micro-lésions qu\'on évoquait. Un peu, c\'est bon. Trop, tu ne récupères plus et tu régresses.",
          "En pratique : la tension mécanique domine. Si tu n\'es jamais proche de l\'échec, tu laisses la majorité du potentiel sur la table.",
        ],
      },
      {
        heading: 'Combien de volume, combien de fréquence ?',
        paragraphs: [
          "Pour la plupart des gens entraînés, l\'hypertrophie optimale se situe entre 10 et 20 séries par groupe musculaire par semaine, réparties sur 2 à 3 séances pour ce même groupe. En-dessous de 10, tu stagnes ; au-dessus de 25, les gains deviennent minimes et la récupération craque.",
          "Tu peux progresser en full-body 3x/semaine comme en split 5x/semaine : ce qui compte, c\'est que chaque muscle voie la charge plusieurs fois, avec des séries proches de l\'échec (1 à 3 reps en réserve).",
        ],
      },
      {
        heading: 'Le rôle sous-estimé de la protéine',
        paragraphs: [
          "Sans briques, pas de mur. Autour de 1,6 à 2,2 g de protéines par kilo de poids corporel par jour, réparties sur 3 à 5 repas, c\'est la fourchette qui maximise la synthèse des protéines musculaires. En-dessous, tu plafonnes vite — même si ton training est parfait.",
        ],
      },
    ],
    keyTakeaways: [
      "Le muscle grossit au repos, pas pendant la séance.",
      "La tension mécanique (charge + intensité proche de l\'échec) est le levier n°1.",
      "10 à 20 séries par muscle par semaine, 2 à 3 sessions hebdo par groupe.",
      "1,6 à 2,2 g de protéines/kg/jour : sans ça, rien ne pousse.",
      "Dors et mange : c\'est là que tu construis, pas à la salle.",
    ],
  },

  {
    slug: 'metabolisme-explique',
    category: 'body',
    title: 'Le métabolisme expliqué simplement',
    summary: 'BMR, TDEE, "métabolisme lent"… Tout ce qu\'on te répète sans vraiment t\'expliquer. On clarifie.',
    readMinutes: 5,
    emoji: '🔥',
    sections: [
      {
        heading: "Ton métabolisme, c\'est quoi exactement",
        paragraphs: [
          "Le métabolisme, c\'est la somme de toute l\'énergie que ton corps brûle pour te maintenir en vie et te faire bouger. On le découpe en quatre morceaux :",
          "• Le **BMR** (métabolisme de base) : ce que tu brûles au repos, rien qu\'à exister. Il couvre 60 à 75 % du total.",
          "• Le **NEAT** : l\'activité non sportive — marcher, taper sur ton clavier, gesticuler. Entre 10 et 30 %.",
          "• Le **TEF** : l\'effet thermique des aliments — digérer te coûte de l\'énergie. Environ 10 %.",
          "• L\'**exercice** : ce que tu brûles en t\'entraînant. Souvent bien moins qu\'on ne croit.",
          "Additionne le tout et tu obtiens le **TDEE** (Total Daily Energy Expenditure), ta dépense journalière totale.",
        ],
      },
      {
        heading: "Le mythe du métabolisme lent",
        paragraphs: [
          "Deux personnes de même poids, même âge, même sexe, ont des BMR qui varient rarement de plus de 10 à 15 %. Ce qui creuse l\'écart, c\'est surtout le NEAT : certains bougent instinctivement tout le temps, d\'autres sont statiques. Tu peux doubler ton NEAT sans jamais faire de sport, juste en marchant, prenant les escaliers, bougeant au téléphone.",
          "Les études (Helms, Trexler) montrent que les gens qui pensent avoir un \"métabolisme lent\" sous-estiment massivement ce qu\'ils mangent et surestiment leur activité. C\'est la règle, pas l\'exception.",
        ],
      },
      {
        heading: "L\'adaptation métabolique, elle, est réelle",
        paragraphs: [
          "Quand tu es en déficit calorique prolongé, ton corps réagit : il réduit le NEAT inconsciemment (tu bouges moins sans t\'en rendre compte), il baisse légèrement ton BMR (moins de masse = moins de consommation), et tes hormones s\'adaptent. Ce phénomène s\'appelle adaptation métabolique, et il explique pourquoi une sèche devient de plus en plus dure avec le temps.",
          "Solution : ne pas rester en déficit agressif trop longtemps. Alterner avec des phases d\'entretien, faire des \"diet breaks\" de 1 à 2 semaines à maintenance toutes les 8 à 12 semaines.",
        ],
      },
      {
        heading: "Ce qui influence vraiment ta dépense",
        paragraphs: [
          "Muscle, activité quotidienne, sommeil, stress. Une personne avec 5 kg de muscle en plus brûle 50 à 100 kcal/jour de plus au repos. Une personne qui dort 6 h/nuit sur la durée a un NEAT plus bas, une appétit plus élevé, et une moins bonne sensibilité à l\'insuline. Les petits paramètres du quotidien pèsent plus lourd que la potion miracle qui \"booste le métabolisme\".",
        ],
      },
    ],
    keyTakeaways: [
      "TDEE = BMR + NEAT + TEF + exercice.",
      "Les écarts entre individus viennent surtout du NEAT, pas du BMR.",
      "Le \"métabolisme lent\" est souvent une sous-estimation des calories réelles.",
      "L\'adaptation métabolique existe : alterner déficit et maintenance.",
      "Plus de muscle + plus de pas par jour = plus de marge alimentaire.",
    ],
  },

  {
    slug: 'graisse-corporelle',
    category: 'body',
    title: 'Graisse corporelle : à quoi elle sert, comment on la perd',
    summary: 'La graisse n\'est pas ton ennemie. C\'est un organe. Mais en excès, elle devient un problème. Mode d\'emploi.',
    readMinutes: 5,
    emoji: '🔬',
    sections: [
      {
        heading: "La graisse, un organe endocrinien",
        paragraphs: [
          "Le tissu adipeux n\'est pas un stock passif. C\'est un organe actif qui sécrète des hormones (leptine, adiponectine), participe à la régulation de l\'inflammation, stocke les vitamines liposolubles (A, D, E, K), protège tes organes, isole thermiquement et sert de réserve d\'énergie en cas de famine — ce qui était vital pour nos ancêtres.",
          "Tu as besoin d\'un minimum : environ 3 à 5 % de graisse essentielle chez l\'homme, 10 à 13 % chez la femme. En-dessous, ta santé décroche (testostérone en chute, cycle menstruel qui s\'arrête, os fragilisés).",
        ],
      },
      {
        heading: "Où elle se stocke, où elle part",
        paragraphs: [
          "Ton corps stocke préférentiellement dans certaines zones selon tes gènes, ton sexe et tes hormones : ventre et tour de taille chez l\'homme, hanches et cuisses chez la femme typique. Ces patterns sont largement génétiques. Et surtout : **tu ne peux pas choisir où tu perds**. Les abdos ne font pas perdre le ventre, les fentes ne font pas maigrir des cuisses — les zones qui ont stocké en premier sont les dernières à partir.",
          "La seule chose qui crée la perte de gras, c\'est un **déficit calorique** sur la durée : dépenser plus d\'énergie que tu n\'en absorbes. Le corps va alors puiser dans ses réserves, et les libérer dans l\'ordre dicté par ta génétique.",
        ],
      },
      {
        heading: "Le processus : la lipolyse",
        paragraphs: [
          "Quand tu es en déficit, des signaux hormonaux (baisse d\'insuline, hausse des catécholamines) déclenchent la libération des triglycérides stockés dans les adipocytes sous forme d\'acides gras libres. Ces acides gras voyagent dans le sang jusqu\'aux muscles et aux organes qui les brûlent comme carburant (bêta-oxydation). Le tout fabrique du CO₂ et de l\'eau — expirés et éliminés.",
          "Fun fact : 84 % de la masse que tu perds part littéralement en respirant.",
        ],
      },
      {
        heading: "Vitesse réaliste et pièges à éviter",
        paragraphs: [
          "Viser 0,5 à 0,75 % de ton poids corporel par semaine. Au-delà de 1 %/semaine, tu perds surtout du muscle et de l\'eau, pas de la graisse. Et plus tu es maigre, plus la vitesse doit ralentir : un BF de 25 % peut viser 0,75 %/sem, un BF de 12 % devrait se contenter de 0,3 à 0,5 %/sem pour préserver la masse maigre et les hormones.",
          "Ce qui fait foirer la plupart des sèches : aller trop vite, couper le training de force (grosse erreur : c\'est lui qui signale à ton corps de préserver le muscle), et manquer de protéines.",
        ],
      },
    ],
    keyTakeaways: [
      "La graisse est un organe endocrinien, vital jusqu\'à un certain seuil.",
      "Impossible de cibler la perte localisée : la génétique décide de l\'ordre.",
      "La perte de gras se fait via un déficit calorique, point.",
      "0,5 à 0,75 % du poids/semaine : plus vite = perte musculaire.",
      "Training de force + protéines élevées = sèche qui préserve le muscle.",
    ],
  },

  {
    slug: 'hormones-physique',
    category: 'body',
    title: 'Les hormones qui contrôlent ton physique',
    summary: 'Testostérone, cortisol, insuline, leptine, ghréline : les 5 hormones qui font le jeu. Sans pseudo-science.',
    readMinutes: 6,
    emoji: '🧪',
    sections: [
      {
        heading: "La testostérone : puissance et récupération",
        paragraphs: [
          "Chez l\'homme comme chez la femme (en quantité plus faible), la testostérone est l\'hormone anabolique principale : elle favorise la synthèse des protéines musculaires, la libido, l\'énergie, la densité osseuse. Les niveaux varient énormément entre individus et avec l\'âge (déclin d\'environ 1 % par an après 30 ans).",
          "Ce qui la plombe : sommeil insuffisant, surentraînement chronique, déficit calorique sévère, surpoids important, carences en zinc et vitamine D. Ce qui l\'optimise : dormir 7 à 9 h, s\'entraîner en force, maintenir un poids de forme, corriger les carences. Rien de magique, mais cumulé ça fait une grosse différence.",
        ],
      },
      {
        heading: "Le cortisol : pas le diable qu\'on dit",
        paragraphs: [
          "Le cortisol est souvent diabolisé, à tort. C\'est l\'hormone du réveil et de la mobilisation : elle te sort du lit, te donne l\'énergie de gérer un stress ponctuel, participe au déstockage des graisses. Le problème est le **cortisol chronique élevé**, dû à un stress permanent, un sommeil pourri, un déficit trop long.",
          "Chroniquement élevé, il stimule l\'appétit (surtout pour le sucre), favorise le stockage viscéral, dégrade la sensibilité à l\'insuline et perturbe la qualité du sommeil. Cercle vicieux classique.",
        ],
      },
      {
        heading: "L\'insuline : stockage, pas poison",
        paragraphs: [
          "L\'insuline est sécrétée par le pancréas en réponse à une montée de glucose sanguin. Son rôle : faire entrer le glucose dans les cellules (muscles, foie, tissu adipeux) pour qu\'elles l\'utilisent ou le stockent.",
          "Le discours \"l\'insuline fait grossir\" est une simplification. Tu grossis si tu manges plus que ta dépense, point. Mais une **sensibilité à l\'insuline dégradée** (résistance à l\'insuline, pré-diabète) rend la perte de gras plus lente et la prise de gras plus facile. Tu l\'améliores avec : entraînement régulier (surtout training de force), sommeil suffisant, perte de gras viscéral, et alimentation riche en fibres.",
        ],
      },
      {
        heading: "Leptine et ghréline : l\'axe de la faim",
        paragraphs: [
          "La **leptine** est fabriquée par le tissu adipeux et signale au cerveau \"tu as assez de réserves\". Plus tu as de gras, plus elle monte — sauf qu\'en cas d\'obésité, le cerveau devient résistant au signal. En déficit calorique, elle chute rapidement : c\'est pour ça que la faim augmente en sèche.",
          "La **ghréline** est son opposée : fabriquée par l\'estomac, elle monte quand tu es à jeun et signale \"mange\". Un repas la fait chuter ; un sommeil court la fait monter (explication physiologique du craving nocturne des mauvais dormeurs).",
          "Ce que tu peux faire : dormir assez, manger assez de protéines et de fibres (rassasiantes), éviter les déficits extrêmes qui explosent la ghréline et effondrent la leptine.",
        ],
      },
    ],
    keyTakeaways: [
      "La testostérone s\'optimise par le sommeil, la force, et éviter les carences.",
      "Le cortisol chronique, pas le cortisol ponctuel, est le problème.",
      "L\'insuline ne fait pas grossir : c\'est le surplus calorique qui fait grossir.",
      "Leptine et ghréline régulent la faim ; le sommeil court les dérègle.",
      "Aucune hormone ne se \"hack\" avec un complément : ce sont des habitudes.",
    ],
  },

  // ==================== NUTRITION ====================
  {
    slug: 'proteines-combien-quand',
    category: 'nutrition',
    title: 'Protéines : combien, quand, pourquoi',
    summary: 'La nutriment que la moitié des gens sous-consomment. Comment bien doser, et pourquoi le timing est surestimé.',
    readMinutes: 4,
    emoji: '🥩',
    sections: [
      {
        heading: "La dose qui marche",
        paragraphs: [
          "La position officielle de l\'ISSN (International Society of Sports Nutrition) est claire : entre **1,4 et 2,0 g de protéines par kilo de poids corporel et par jour** pour un adulte qui s\'entraîne. En phase de sèche ou chez les sportifs avancés, la fourchette haute (1,8 à 2,2 g/kg/j) préserve mieux la masse musculaire.",
          "Pour 75 kg : environ 120 à 165 g de protéines par jour. Concrètement, ça fait 3 à 5 repas contenant chacun 30 à 45 g de protéines. C\'est beaucoup plus que la moyenne des gens.",
        ],
      },
      {
        heading: "Les meilleures sources",
        paragraphs: [
          "Animales — quantité et qualité imbattables : œufs, poisson, volaille, viande maigre, yaourt grec, fromage blanc 0 %, skyr, whey en complément. Un œuf = 6 g. Un yaourt grec 150 g = 15 g. 100 g de poulet = 25 g.",
          "Végétales — parfait si bien combinées : lentilles, pois chiches, haricots, tofu, tempeh, seitan, edamame, levure nutritionnelle, protéines de pois ou de riz en poudre. 100 g de lentilles cuites = 9 g. 100 g de tofu ferme = 15 g.",
          "Pour les régimes végé ou vegan, il faut légèrement plus (environ 10 à 15 % de plus) pour compenser la digestibilité plus faible et le profil en acides aminés.",
        ],
      },
      {
        heading: "Le timing : largement surestimé",
        paragraphs: [
          "La fameuse \"fenêtre anabolique\" de 30 minutes post-entraînement est un mythe bien installé. Les méta-analyses récentes (Schoenfeld) montrent que tant que ton apport total sur la journée est correct, peu importe si tu prends ta whey 15 min ou 2 h après la séance.",
          "Ce qui **compte vraiment** : répartir les protéines sur 3 à 5 repas espacés de 3 à 5 h, avec au moins 0,3 à 0,4 g/kg par repas (soit ~25-40 g selon ton poids). Ça maximise la stimulation de la synthèse protéique sur la journée.",
        ],
      },
      {
        heading: "Faut-il vraiment autant ?",
        paragraphs: [
          "Si tu es sédentaire et en bonne santé, 0,8 g/kg/j suffit pour éviter les carences — c\'est l\'ANSES officielle. Mais si tu t\'entraînes, veux prendre du muscle, sécher sans fonte musculaire, ou juste mieux te sentir : non, 0,8 g/kg ne suffit pas. La méta-analyse Morton (2018) sur 49 études montre un plafond de gains autour de 1,6 g/kg/j — mais aller un peu plus haut ne pose aucun problème et sécurise le chiffre en pratique.",
        ],
      },
    ],
    keyTakeaways: [
      "1,6 à 2,2 g de protéines/kg de poids/jour pour qui s\'entraîne.",
      "Répartir sur 3 à 5 repas de 30-40 g chacun.",
      "Le timing post-training compte moins que le total quotidien.",
      "Sources animales et végétales marchent, adapte si tu es végé/vegan.",
      "Sous les 1,4 g/kg, tu laisses du muscle sur la table.",
    ],
  },

  {
    slug: 'glucides-role',
    category: 'nutrition',
    title: 'Glucides : l\'ennemi ou ton meilleur allié ?',
    summary: 'Les glucides sont détestés depuis 20 ans. À tort. Voici ce qu\'ils font vraiment dans ton corps.',
    readMinutes: 5,
    emoji: '🍚',
    sections: [
      {
        heading: "Le carburant de ton cerveau et tes muscles",
        paragraphs: [
          "Les glucides, c\'est du glucose : la monnaie énergétique préférée du cerveau (qui en consomme ~120 g/jour) et des muscles à haute intensité. Quand tu manges des glucides, ils sont digérés en glucose, stockés dans les muscles et le foie sous forme de **glycogène** (environ 300 à 500 g au total), ou utilisés immédiatement.",
          "Sans glucides, ton corps peut fabriquer du glucose à partir des protéines et des graisses (cétose, néoglucogenèse), mais à un coût métabolique. Pour un entraînement intense, le glycogène est imbattable : plus de force, plus de volume, meilleure récupération.",
        ],
      },
      {
        heading: "Pourquoi ils sont autant détestés",
        paragraphs: [
          "Le discours \"les glucides font grossir\" vient de la confusion entre **excès** et **nutriment**. Les glucides ultra-transformés et raffinés (sodas, viennoiseries, bonbons, chips) sont calorie-dense, peu rassasiants, et faciles à sur-consommer. D\'où association glucides = prise de poids.",
          "Mais un régime riche en glucides complexes (riz, patates, avoine, légumineuses, pain complet, fruits) n\'est pas l\'ennemi. Les populations les plus en santé au monde (Okinawa, régions bleues méditerranéennes) mangent 55 à 70 % de leurs calories en glucides.",
        ],
      },
      {
        heading: "Index glycémique : utile mais survendu",
        paragraphs: [
          "L\'IG mesure la vitesse à laquelle un aliment fait monter la glycémie. Un aliment à IG bas (lentilles, avoine) lâche son glucose lentement ; un IG haut (pain blanc, riz soufflé) le fait monter vite.",
          "En pratique, l\'IG compte surtout dans trois cas : diabète/pré-diabète, timing pré-training (IG bas pour tenir), post-training (IG haut pour recharger vite). Pour Monsieur-Madame Tout-Le-Monde qui mange des repas mixtes avec protéines, fibres et gras, l\'IG d\'un glucide isolé est largement atténué par le reste du repas.",
        ],
      },
      {
        heading: "Combien en manger",
        paragraphs: [
          "Dépend de ton activité. Fourchettes réalistes pour un adulte qui s\'entraîne : 3 à 5 g/kg/jour pour un entraînement modéré, 5 à 7 g/kg/jour pour un entraînement soutenu (musculation intense + cardio), jusqu\'à 8-10 g/kg pour les athlètes d\'endurance.",
          "En sèche, on peut descendre à 2-3 g/kg sans problème — à condition de garder les protéines hautes et les gras raisonnables. En prise de masse, on monte les glucides, pas les gras.",
        ],
      },
      {
        heading: "Priorise les sources qui t\'aident",
        paragraphs: [
          "Riz basmati, riz complet, patate douce, patate classique, avoine, pain complet au levain, quinoa, légumineuses, fruits entiers. Riche en fibres, rassasiant, digeste, stable pour l\'énergie. Limite (sans bannir) : sodas, jus de fruits, pâtisseries, céréales sucrées, pain ultra-raffiné. Le 80/20 s\'applique parfaitement ici.",
        ],
      },
    ],
    keyTakeaways: [
      "Les glucides sont le carburant principal du cerveau et du training intense.",
      "Ce n\'est pas les glucides qui font grossir, c\'est le surplus calorique total.",
      "L\'IG compte dans des cas précis, pas pour tout le monde.",
      "3 à 7 g/kg/jour selon ton activité, ajuste selon ton objectif.",
      "80 % de sources complètes, 20 % de plaisir : pas besoin de bannir.",
    ],
  },

  {
    slug: 'lipides-bons-mauvais',
    category: 'nutrition',
    title: 'Lipides : les bons, les mauvais, les essentiels',
    summary: 'Les gras ne se valent pas. Certains sont vitaux, d\'autres à limiter, d\'autres à éviter. On trie.',
    readMinutes: 5,
    emoji: '🥑',
    sections: [
      {
        heading: "Pourquoi tu as besoin de gras",
        paragraphs: [
          "Les lipides ne sont pas un luxe : ils sont **essentiels**. Ils participent à la structure des membranes cellulaires, fabriquent les hormones stéroïdiennes (dont la testostérone), permettent d\'absorber les vitamines A, D, E, K, protègent les organes, isolent les nerfs. Descendre trop bas en gras (<20 % des calories) plombe les hormones et la récupération.",
          "Pour un adulte qui s\'entraîne, viser **0,8 à 1,2 g/kg/jour** de lipides est la zone de confort. Soit 60 à 90 g pour 75 kg.",
        ],
      },
      {
        heading: "Les oméga-3 : la star sous-consommée",
        paragraphs: [
          "Les oméga-3 longue chaîne (EPA, DHA) sont anti-inflammatoires, bons pour le cerveau, le cœur, et la récupération. On en trouve dans les poissons gras (saumon, maquereau, sardine, hareng, anchois), les œufs \"bleu-blanc-cœur\", et en plus petite quantité dans les graines de lin et de chia (ALA, moins efficace).",
          "Viser 2 portions de poisson gras par semaine, ou complémenter si tu ne manges pas de poisson. Le ratio oméga-6/oméga-3 occidental est catastrophique (autour de 15:1 quand l\'idéal est 4:1), ce qui entretient une inflammation de fond.",
        ],
      },
      {
        heading: "Saturés : pas le diable qu\'on a cru",
        paragraphs: [
          "Pendant 40 ans, on nous a dit que les graisses saturées (beurre, viande rouge, fromage) étaient la cause n°1 des maladies cardiovasculaires. Les méta-analyses récentes (Chowdhury 2014, Siri-Tarino 2010) ont largement nuancé ce message. Les saturés ne sont pas \"bons\" mais ne sont pas non plus le poison qu\'on nous a vendu.",
          "La recommandation raisonnable : ne pas en faire le pilier, limiter à 10 % max des calories totales, mais pas besoin d\'en avoir peur. Un peu de beurre, de fromage, de viande rouge, dans une alimentation variée, sans problème.",
        ],
      },
      {
        heading: "Trans : la seule catégorie vraiment toxique",
        paragraphs: [
          "Les gras trans industriels (huiles partiellement hydrogénées), créés pour prolonger la durée de conservation des produits industriels, sont le seul type de gras dont la réduction est universellement bénéfique. Ils augmentent le LDL, baissent le HDL, favorisent l\'inflammation, augmentent clairement le risque cardiovasculaire.",
          "Où ils se cachent : viennoiseries industrielles, biscuits, margarines bas de gamme, fritures de fast-food. Regarde les étiquettes : \"huile hydrogénée\" ou \"partiellement hydrogénée\" = non.",
        ],
      },
      {
        heading: "Mono-insaturés et huile d\'olive",
        paragraphs: [
          "L\'huile d\'olive extra-vierge, les avocats, les noix et amandes, l\'huile de colza : les gras mono-insaturés sont associés à une meilleure santé cardiovasculaire (études MedDiet, PREDIMED). C\'est la base de la diète méditerranéenne. Utiliser l\'huile d\'olive comme huile principale de cuisson douce et d\'assaisonnement est un choix sûr.",
        ],
      },
    ],
    keyTakeaways: [
      "0,8 à 1,2 g de lipides/kg/jour : ne descends pas en-dessous sans raison.",
      "Oméga-3 (EPA/DHA) : 2 portions de poisson gras/sem ou complément.",
      "Saturés : ni héros ni vilains. À limiter, pas à bannir.",
      "Gras trans industriels : seul type à éviter activement.",
      "Huile d\'olive + avocats + noix : socle des gras de qualité.",
    ],
  },

  {
    slug: 'micronutriments',
    category: 'nutrition',
    title: 'Micronutriments qui changent tout',
    summary: 'Vitamine D, magnésium, zinc, fer, iode. Les 5 micros que la moitié des gens en manquent sans le savoir.',
    readMinutes: 5,
    emoji: '💊',
    sections: [
      {
        heading: "Vitamine D : la plus carencée",
        paragraphs: [
          "En France, environ 70 % des adultes sont en déficit ou insuffisance de vitamine D en hiver. La vitamine D joue sur l\'immunité, la santé osseuse, l\'humeur, la fonction musculaire, la testostérone.",
          "Sources naturelles : le soleil (le corps fabrique de la D via l\'exposition UVB cutanée), un peu dans les poissons gras et les œufs. Pas grand-chose ailleurs. Une complémentation de 1000 à 2000 UI/jour en hiver est raisonnable pour la plupart des gens adultes. Vraiment carencé ? Demande un dosage sanguin et ajuste avec un pro.",
        ],
      },
      {
        heading: "Magnésium : sommeil, récupération, nerfs",
        paragraphs: [
          "Le magnésium intervient dans plus de 300 réactions enzymatiques. Il joue sur le sommeil, la récupération musculaire, la régulation du stress, la contraction musculaire, la fonction cardiaque.",
          "Sources : chocolat noir 70 %+, noix et amandes, graines de courge, légumes verts à feuilles, légumineuses, eaux minéralisées (Rozana, Hépar). Si tu as des crampes, des troubles du sommeil, un stress chronique, ou que tu transpires beaucoup en sport — envisager 300-400 mg/jour sous forme de bisglycinate ou de citrate (pas l\'oxyde, mal absorbé).",
        ],
      },
      {
        heading: "Zinc : testostérone et immunité",
        paragraphs: [
          "Le zinc participe à la synthèse de testostérone, à la réparation tissulaire, à l\'immunité, au goût et à l\'odorat. Les végétariens et vegans sont souvent limites parce que les sources végétales contiennent des phytates qui limitent l\'absorption.",
          "Sources : huîtres (record absolu, 5 huîtres couvrent la journée), bœuf, graines de courge, lentilles, pois chiches. Un apport de 10 à 15 mg/jour suffit ; complémenter seulement si carence avérée (trop de zinc sur la durée bloque l\'absorption du cuivre).",
        ],
      },
      {
        heading: "Fer : énergie et hématies",
        paragraphs: [
          "Le fer transporte l\'oxygène via l\'hémoglobine. La carence entraîne fatigue, essoufflement, baisse de performance, pâleur. Les femmes réglées, les femmes enceintes, les vegans et les gros sportifs en endurance sont particulièrement exposés.",
          "Deux formes : **héminique** (viande rouge, abats, crustacés — bien absorbé) et **non-héminique** (lentilles, épinards, céréales — moins bien absorbé). Consommer de la vitamine C avec le repas boost l\'absorption du fer végétal. Éviter de boire du thé/café pendant le repas (tanins qui bloquent l\'absorption).",
        ],
      },
      {
        heading: "Iode : la thyroïde et l\'énergie",
        paragraphs: [
          "L\'iode est essentiel à la fabrication des hormones thyroïdiennes, qui règlent le métabolisme global. Une carence ralentit tout : fatigue, prise de poids, peau sèche, chute de cheveux.",
          "Sources : poissons, crustacés, algues (attention, certaines sont ultra-concentrées), sel iodé, produits laitiers. La plupart des gens qui utilisent du sel iodé et mangent du poisson occasionnellement sont couverts. Vegans qui n\'utilisent pas de sel iodé : attention, complémentation à envisager.",
        ],
      },
      {
        heading: "Le vrai réflexe",
        paragraphs: [
          "Avant de courir acheter 10 compléments, fais un bilan sanguin une fois par an (NFS, ferritine, vitamine D, TSH). C\'est la seule façon sérieuse de savoir ce qu\'il te manque vraiment. Complémenter \"à l\'aveugle\" est souvent inutile, parfois contre-productif.",
        ],
      },
    ],
    keyTakeaways: [
      "Vitamine D : 1000-2000 UI/jour en hiver pour la plupart.",
      "Magnésium : bisglycinate/citrate si sommeil/stress/crampes.",
      "Zinc : surveille si végé/vegan.",
      "Fer : vitamine C au repas si sources végétales. Pas de thé aux repas.",
      "Iode : sel iodé + poisson couvrent. Vegans, vigilance.",
      "Bilan sanguin annuel > compléments à l\'aveugle.",
    ],
  },

  // ==================== TRAINING ====================
  {
    slug: 'surcharge-progressive',
    category: 'training',
    title: 'Surcharge progressive : le seul principe qui compte',
    summary: 'Sans surcharge progressive, tu ne progresses pas. Peu importe ton programme. Explication et méthode.',
    readMinutes: 5,
    emoji: '📈',
    sections: [
      {
        heading: "Le principe fondamental",
        paragraphs: [
          "Ton corps s\'adapte au stress qu\'on lui impose. Si tu soulèves chaque semaine les mêmes charges pour les mêmes reps, tu lui dis : \"le niveau actuel est OK\", et il n\'a aucune raison de grossir ou de devenir plus fort. La surcharge progressive, c\'est l\'idée toute simple d\'augmenter progressivement le stimulus pour forcer l\'adaptation à continuer.",
          "C\'est le seul principe universel et non-négociable du training hypertrophique et de force. Tout programme qui fonctionne repose dessus. Aucun programme qui l\'ignore ne fonctionne sur la durée.",
        ],
      },
      {
        heading: "Comment surcharger concrètement",
        paragraphs: [
          "Il y a plusieurs leviers, à utiliser dans cet ordre de priorité :",
          "1. **Ajouter des reps** avec la même charge. Exemple : tu faisais 4×8 à 60 kg au développé couché ? Cette semaine, vise 4×9, puis 4×10 la suivante.",
          "2. **Augmenter la charge** quand tu plafonnes à ton nombre de reps cible. Tu fais 4×10 à 60 kg ? Monte à 62,5 kg et recommence à 4×8.",
          "3. **Ajouter une série** toutes les 3-4 semaines sur un exercice principal.",
          "4. **Réduire le temps de repos** (surtout pour l\'endurance musculaire).",
          "5. **Améliorer la technique** : plus d\'amplitude, meilleure tempo excentrique. Souvent oublié, pourtant énorme.",
          "Tu n\'as pas besoin d\'ajouter des kilos chaque semaine. Augmenter d\'une rep par série toutes les 1-2 semaines, c\'est déjà de la surcharge.",
        ],
      },
      {
        heading: "Tracker ou mourir",
        paragraphs: [
          "Impossible de surcharger si tu ne sais pas ce que tu as fait la semaine dernière. Note tes séances. Un carnet, une app, peu importe. Charge × reps × séries × RPE (effort perçu de 1 à 10). Sans ça, tu fais du sport sans t\'entraîner.",
          "Les programmes qui performent le mieux sont ceux où le pratiquant sait, à chaque série, combien il a mis la fois d\'avant et ce qu\'il doit battre aujourd\'hui.",
        ],
      },
      {
        heading: "Quand ça bloque : la périodisation",
        paragraphs: [
          "La progression n\'est pas linéaire. Tu vas stagner, régresser parfois. Normal. La solution : **périodiser** ton training. Alterner des phases de volume élevé et d\'intensité modérée avec des phases d\'intensité élevée et de volume réduit. Intégrer des semaines de **deload** (50-60 % du volume) toutes les 4 à 8 semaines pour recharger.",
          "Les débutants progressent presque chaque semaine. Les intermédiaires progressent par blocs de 4-6 semaines. Les avancés, par blocs de plusieurs mois.",
        ],
      },
    ],
    keyTakeaways: [
      "Pas de surcharge progressive, pas de progrès. Point.",
      "Ordre : +reps → +charge → +séries → meilleure technique.",
      "Noter ses séances est non-négociable pour progresser.",
      "Semaine de deload tous les 4 à 8 blocs d\'entraînement.",
      "La progression ralentit avec le niveau — c\'est normal, pas un échec.",
    ],
  },

  {
    slug: 'fullbody-vs-split',
    category: 'training',
    title: 'Full-body vs split : lequel choisir',
    summary: 'Tu peux progresser avec les deux. Voici comment choisir selon ton emploi du temps et ton niveau.',
    readMinutes: 4,
    emoji: '🏋️‍♂️',
    sections: [
      {
        heading: "Full-body : bosser tout à chaque séance",
        paragraphs: [
          "Tu fais squat, tirage, développé, à chaque séance. Tu entraînes chaque groupe 2 à 3 fois par semaine. Idéal si :",
          "• Tu t\'entraînes 2 à 4 fois par semaine maximum.",
          "• Tu es débutant ou intermédiaire bas.",
          "• Tu veux une fréquence élevée par groupe (2 à 3x/sem, ce qui maximise l\'hypertrophie).",
          "• Tu manques régulièrement de séances — impact moindre si tu rates un jour, car tout est couvert souvent.",
          "Inconvénient : séances longues si tu veux du volume (3 à 4 exercices par groupe), et la fatigue CNS peut s\'accumuler si mal géré.",
        ],
      },
      {
        heading: "Split : spécialiser chaque jour",
        paragraphs: [
          "Tu dédies chaque séance à un groupe ou deux. Classiques : **Push-Pull-Legs** (poussée / tirage / jambes, souvent 6x/sem), **Upper-Lower** (haut/bas, souvent 4x/sem), **Bro-split** (1 groupe par jour, souvent 5-6x/sem).",
          "Idéal si :",
          "• Tu t\'entraînes 4 à 6 fois par semaine.",
          "• Tu es intermédiaire+ et tu as besoin d\'un gros volume par groupe musculaire (plus de 12 séries/sem).",
          "• Tu veux des séances plus focus, plus courtes (45-75 min).",
          "• Tu aimes la variété d\'attaquer un groupe à fond sans penser aux autres.",
        ],
      },
      {
        heading: "Ce que dit la science",
        paragraphs: [
          "Les méta-analyses (Schoenfeld 2016) comparant fréquence 1x vs 2x/semaine par groupe montrent un léger avantage pour 2x. 3x ne bat pas franchement 2x. **La fréquence compte, mais à volume égal, split et full-body se valent** pour l\'hypertrophie.",
          "Autrement dit : ne choisis pas en fonction de la magie du système. Choisis en fonction de ton emploi du temps, de ta capacité de récupération, de tes préférences. Le meilleur programme est celui que tu vas **tenir 6 mois** sans abandonner.",
        ],
      },
      {
        heading: "Recommandations selon ton cas",
        paragraphs: [
          "• **Débutant, 3 séances/sem** → full-body. Simple, efficace, progression rapide.",
          "• **Intermédiaire, 3-4 séances/sem** → upper-lower. Bon compromis volume/fréquence.",
          "• **Intermédiaire/avancé, 5-6 séances/sem** → PPL ou upper-lower x2. Tu fais 10-20 séries/groupe/sem sans sur-fatigue.",
          "• **Avancé avec priorités** → split modulable avec double session sur le groupe faible.",
        ],
      },
    ],
    keyTakeaways: [
      "Fullbody marche très bien 2-4x/sem, idéal pour débutants et emplois du temps serrés.",
      "Split (PPL, upper-lower) brille à partir de 4x/sem et pour les volumes élevés.",
      "2x/sem par groupe > 1x ; 3x ne bat pas 2x à volume égal.",
      "Le meilleur programme est celui que tu tiens 6 mois.",
    ],
  },

  {
    slug: 'cardio-pour-secher',
    category: 'training',
    title: 'La vérité sur le cardio pour sécher',
    summary: 'Tu peux sécher sans cardio. Tu peux sécher avec. Mais pas n\'importe lequel, pas n\'importe comment.',
    readMinutes: 5,
    emoji: '🏃',
    sections: [
      {
        heading: "Rappel : c\'est le déficit qui fait sécher",
        paragraphs: [
          "Pas le cardio. Le déficit calorique. Le cardio n\'est qu\'un moyen d\'augmenter ta dépense énergétique et donc de creuser ce déficit, exactement comme manger 300 kcal de moins le ferait. Mathématiquement, c\'est équivalent. Physiologiquement, c\'est différent, et c\'est là que ça devient intéressant.",
        ],
      },
      {
        heading: "Cardio ou diète ?",
        paragraphs: [
          "Le déficit par la diète (manger moins) est plus efficient : une part de brioche en moins = 150 kcal, ça prend 30 secondes. Pour brûler 150 kcal, tu marches 30 min. Tu arrives plus vite à ton déficit avec la fourchette qu\'avec les baskets.",
          "Mais le cardio apporte des bénéfices que la diète n\'a pas : santé cardiovasculaire, VO2 max, sensibilité à l\'insuline, humeur, récupération entre les séances de muscu, appétit régulé. Zéro cardio, c\'est dommage.",
          "L\'équilibre gagnant : **diète pour le déficit principal, cardio modéré pour la santé et la marge**.",
        ],
      },
      {
        heading: "Marche : la meilleure arme sous-estimée",
        paragraphs: [
          "La marche rapide, c\'est probablement le meilleur outil cardio pour sécher. Elle brûle plus de calories qu\'on ne le pense (~4-5 kcal/min soit 240-300 kcal/h), n\'impacte pas la récupération, améliore la digestion et l\'humeur, et se cumule facilement dans la journée.",
          "Objectif réaliste : **8 000 à 12 000 pas par jour** en sèche. Une marche de 30 min après le dîner améliore la glycémie postprandiale. Un trajet à pied plutôt que la voiture. C\'est le NEAT qui se cumule.",
        ],
      },
      {
        heading: "HIIT vs LISS : faux débat",
        paragraphs: [
          "Le HIIT (intervalles à haute intensité, type 30 s sprint / 30 s repos) brûle beaucoup de calories en peu de temps, améliore la VO2 max et la sensibilité à l\'insuline. Mais il tape sur la récupération : si tu fais déjà 4-5 séances de muscu, coller du HIIT plusieurs fois par semaine va cannibaliser tes gains en force.",
          "Le LISS (low intensity steady state : marche, vélo tranquille, natation easy) est plus léger, n\'interfère pas avec la muscu, et peut se faire en volume sans limite.",
          "Recommandation pour la plupart : **2 à 3 séances de LISS par semaine + beaucoup de marche au quotidien**. Ajouter 1 séance de HIIT si tu aimes et que ta récupération suit.",
        ],
      },
      {
        heading: "Les pièges à éviter",
        paragraphs: [
          "1. Compenser en mangeant plus après le cardio. Tu viens de brûler 300 kcal ? Ce cookie en fait 400. Bilan : zéro.",
          "2. Couper le training de force en sèche. C\'est lui qui protège ta masse musculaire. Le cardio ne remplace pas la muscu.",
          "3. Trop de cardio trop vite. Ton corps s\'y habitue, il devient plus efficient (brûle moins), et il t\'affame.",
          "Commence bas (2 séances de 30 min/sem), augmente progressivement si besoin.",
        ],
      },
    ],
    keyTakeaways: [
      "Le déficit calorique sèche, pas le cardio en lui-même.",
      "Diète pour le déficit principal, cardio modéré pour la santé.",
      "La marche (8-12k pas/jour) est l\'outil le plus sous-estimé.",
      "LISS > HIIT dans la majorité des cas pour le/la pratiquant(e) de muscu.",
      "Ne compense jamais un cardio par de la bouffe en plus.",
    ],
  },

  {
    slug: 'recuperation-invisible',
    category: 'training',
    title: 'Récupération : l\'entraînement invisible',
    summary: 'Tu te construis entre les séances, pas pendant. Sommeil, stress, deload, étirements : ce qui compte vraiment.',
    readMinutes: 5,
    emoji: '🛌',
    sections: [
      {
        heading: "Le sommeil, pilier n°1",
        paragraphs: [
          "Pas de récupération sans sommeil. Pendant que tu dors, ton corps libère l\'hormone de croissance (GH), reconstruit le tissu musculaire, consolide les apprentissages moteurs, régule les hormones (testostérone, cortisol, ghréline, leptine). Une nuit mauvaise = un entraînement suivant médiocre. Plusieurs nuits mauvaises = progression qui s\'arrête.",
          "Études clés : Dattilo 2011, Van Cauter 2008. Des sujets privés de sommeil montrent une baisse de 20-30 % de la synthèse protéique musculaire et de la testostérone en quelques jours seulement. Objectif : **7 à 9 h par nuit**, régulièrement.",
        ],
      },
      {
        heading: "Les deload : dégonfler pour mieux rebondir",
        paragraphs: [
          "Une semaine de deload = une semaine à 50-60 % du volume habituel. Même exercices, mêmes charges ou légèrement plus basses, mais moins de séries et/ou moins de reps par série. L\'objectif est de laisser ton système nerveux, tes articulations et tes tissus se régénérer, sans perdre le geste.",
          "Fréquence : toutes les **4 à 8 semaines** selon ton niveau. Débutant, tu peux pousser 8 semaines sans problème. Avancé en full-contact intensité, 4 semaines peuvent être nécessaires.",
          "Les gens qui refusent les deloads pensent \"perdre\". Dans les faits, ils régressent ensuite et finissent par prendre 2 semaines off forcées à cause d\'une blessure ou d\'un burn-out. Deload > blessure.",
        ],
      },
      {
        heading: "Étirements : utiles, mais surestimés",
        paragraphs: [
          "Les étirements statiques (tenir une position 30 s) n\'améliorent pas significativement la récupération musculaire, n\'empêchent pas les courbatures et, fait moins connu, **réduisent temporairement la force** s\'ils sont faits juste avant une séance. À garder pour après, ou en session dédiée.",
          "Le **mobility work** (mobilité articulaire active, foam roller, travail des hanches, des épaules, des chevilles) apporte beaucoup plus : plus d\'amplitude sur les mouvements, meilleure posture, moins de compensations, moins de douleurs chroniques. 10 minutes par jour, c\'est un excellent investissement.",
        ],
      },
      {
        heading: "Le stress chronique : le tueur silencieux",
        paragraphs: [
          "Le stress psychologique (boulot, relations, charge mentale) fonctionne comme un stress physique pour ton corps : cortisol chronique élevé, inflammation, sommeil dégradé, appétit perturbé. Les études sur étudiants en période d\'examens montrent que leur récupération post-training est sensiblement dégradée.",
          "Ce qui marche, d\'après la recherche : marche en nature, respiration diaphragmatique, méditation 5-15 min/jour, limiter les écrans le soir, vie sociale de qualité. Pas magique, mais solide. Si ton stress est ingérable, baisser temporairement le volume d\'entraînement est plus intelligent que s\'acharner.",
        ],
      },
    ],
    keyTakeaways: [
      "7 à 9 h de sommeil : le pilier absolu de la récupération.",
      "Deload toutes les 4-8 semaines : investissement, pas perte.",
      "Mobility > étirement statique avant la séance.",
      "Stress chronique = cortisol chronique = récupération dégradée.",
      "Quand la vie tape fort, baisse le volume. C\'est intelligent.",
    ],
  },

  // ==================== LIFESTYLE ====================
  {
    slug: 'sommeil-7h',
    category: 'lifestyle',
    title: "Pourquoi 7h de sommeil, c\'est non négociable",
    summary: 'Le sommeil est le levier n°1 de la santé, de la performance et de la composition corporelle. Preuves et méthode.',
    readMinutes: 5,
    emoji: '😴',
    sections: [
      {
        heading: "Ce qui se passe pendant que tu dors",
        paragraphs: [
          "Le sommeil n\'est pas une mise en veille : c\'est l\'un des moments les plus actifs de ta journée. Ton cerveau consolide les apprentissages, nettoie les déchets métaboliques (via le système glymphatique), régule les émotions. Ton corps fabrique de l\'hormone de croissance, répare les tissus, règle la sensibilité à l\'insuline, régule leptine et ghréline.",
          "Les cycles durent 90 minutes et alternent sommeil léger, profond (réparation physique) et REM (consolidation mentale). Tu as besoin d\'**environ 4-5 cycles complets**, soit 6h30 à 7h30 pour la plupart des gens — certains ayant besoin de 8h+.",
        ],
      },
      {
        heading: "Les coûts du manque de sommeil",
        paragraphs: [
          "Études solides (Spaeth 2013, Nedeltcheva 2010) : dormir 5h/nuit pendant 2 semaines induit une prise de gras plus rapide et une perte de muscle plus lente en déficit calorique. Les sujets mangent en moyenne 300-400 kcal de plus par jour (ghréline élevée, leptine basse, cortex préfrontal affaibli — tu craques plus facilement sur le sucré).",
          "La performance sportive chute : moins de force, moins de puissance, récupération dégradée, risque de blessure multiplié par 1,7 selon les études de sports collectifs. Et côté santé : risque cardiovasculaire, cognitif, dépression — tous augmentés avec un sommeil chroniquement court.",
        ],
      },
      {
        heading: "L\'hygiène de sommeil qui marche vraiment",
        paragraphs: [
          "1. **Heure de lever constante** (oui, même le week-end). C\'est ce qui cale le rythme circadien.",
          "2. **Lumière naturelle le matin** : 10-15 min de lumière extérieure dans l\'heure qui suit le lever. Signal fort pour la vigilance diurne et la mélatonine nocturne.",
          "3. **Caféine : stop à midi**. Demi-vie 5-6h. Un café à 16h = 50% encore actif à 22h.",
          "4. **Chambre fraîche (18-19°C) et sombre**. La température corporelle doit baisser pour endormir.",
          "5. **Écrans en baisse 1h avant coucher**. La lumière bleue retarde la mélatonine, mais surtout c\'est le contenu qui te garde stimulé/anxieux.",
          "6. **Pas d\'alcool** : il t\'endort vite mais fragmente le sommeil en 2e partie de nuit.",
        ],
      },
      {
        heading: "Et si je peux vraiment pas 7h ?",
        paragraphs: [
          "Réalité : parfois tu gères un bébé, un boulot à rallonge, un deuil. Dans ces cas : prends 20-30 min de sieste entre 13h et 15h si possible (ça récupère un peu), baisse temporairement le volume d\'entraînement, descends le déficit calorique à zéro ou +100-200 kcal, priorise les fondamentaux (protéines, marche, sommeil quand tu peux). C\'est une phase, pas une règle. Mais ne t\'illusionne pas : tu ne progresseras pas pendant cette phase comme en temps normal.",
        ],
      },
    ],
    keyTakeaways: [
      "Sommeil = construction, réparation, régulation hormonale. Non négociable.",
      "Moins de 6h chronique = prise de gras, perte de muscle, baisse de perf.",
      "Heure de lever constante + lumière matinale = règle des règles.",
      "Caféine stop à midi ; chambre à 18°C ; écrans -1h avant.",
      "Quand la vie tape, priorise le sommeil, pas le workout.",
    ],
  },

  {
    slug: 'matinee-optimale',
    category: 'lifestyle',
    title: 'Matinée optimale : ce qui marche vraiment',
    summary: 'Pas de morning routine de 3h. Les 4 gestes qui améliorent ton énergie et ton focus, pour un coût minimal.',
    readMinutes: 4,
    emoji: '🌅',
    sections: [
      {
        heading: "Lumière naturelle : le geste qui change tout",
        paragraphs: [
          "Dans les 30-60 minutes après le réveil, 10 à 15 minutes de lumière extérieure directe. Ouvre la fenêtre, sors sur le balcon, marche jusqu\'à la boulangerie. C\'est le signal le plus puissant pour ton horloge circadienne : la vigilance monte vite dans la journée, la mélatonine baisse, et surtout — cette exposition avancera ta mélatonine du soir, donc tu t\'endormiras plus tôt et mieux.",
          "Aucun éclairage intérieur ne remplace ça : la lumière du jour, même par temps couvert, est 10 à 100 fois plus intense que la meilleure lampe.",
        ],
      },
      {
        heading: "Attendre 60 à 90 minutes pour le premier café",
        paragraphs: [
          "Au réveil, l\'adénosine (la molécule de la fatigue) est basse, et le cortisol naturel monte — tu n\'as pas besoin de caféine tout de suite. Prendre son café dans l\'heure qui suit le réveil crée une dépendance plus forte et un coup de barre vers 10-11h.",
          "Méthode Huberman-compatible : eau + lumière au réveil → café 60-90 min plus tard. Certains s\'y font facilement, d\'autres non. Si tu ne peux pas : réduis au moins la dose matinale.",
        ],
      },
      {
        heading: "Bouger même 5 minutes",
        paragraphs: [
          "5 à 10 minutes de mouvement au réveil : marche, mobilité, quelques burpees, de la corde à sauter, peu importe. L\'objectif est de monter un peu la température corporelle, activer la circulation, réveiller le système nerveux. Gain d\'énergie et de focus sur la matinée, prouvé par les études de chrono-performance.",
          "Ça ne remplace pas ta séance de muscu de 17h. C\'est un petit déclic pour démarrer la journée.",
        ],
      },
      {
        heading: "Manger ou pas au petit-déj ?",
        paragraphs: [
          "Débat sans importance si tu respectes ton apport calorique journalier et tes protéines. Le \"petit-déjeuner est le repas le plus important\" est un mythe commercial. Ce qui compte : **répartition des protéines sur la journée** et **régularité**.",
          "Si tu as faim : prends un petit-déj riche en protéines (25-40 g), un peu de fibres et de bon gras. Ex : yaourt grec + flocons d\'avoine + fruit + amandes. Si tu n\'as pas faim (jeûne intermittent 16:8 par exemple) : ça va, décale ton premier repas, mais vise plus de protéines quand tu casses le jeûne.",
        ],
      },
      {
        heading: "Anti-exemples : ce qui plombe ta matinée",
        paragraphs: [
          "Scroll téléphone au lit pendant 20 min → cortisol et anxiété en hausse, rythme circadien perturbé. Pas l\'idéal. Mieux : enfile un vêtement, sors, regarde dehors.",
          "Sucre rapide dès le lever → pic glycémique puis chute = coup de barre à 10h. Préfère des glucides complexes + protéines.",
          "Trop de caféine (300+ mg) dès 7h → anxiété, tremblements, et crash à 11h. Dose raisonnable : 100-200 mg.",
        ],
      },
    ],
    keyTakeaways: [
      "10-15 min de lumière extérieure dans l\'heure du réveil.",
      "Attendre 60-90 min avant le premier café si possible.",
      "5-10 min de mouvement matinal = énergie + focus sur la matinée.",
      "Petit-déj pas obligatoire, mais protéines oui à long terme.",
      "Évite le scroll au lit et le sucre rapide au réveil.",
    ],
  },

  {
    slug: 'gerer-stress',
    category: 'lifestyle',
    title: 'Gérer le stress quand tu veux progresser',
    summary: 'Le stress chronique sabote discrètement tes gains et ta sèche. Pratiques simples qui marchent vraiment.',
    readMinutes: 5,
    emoji: '🧘',
    sections: [
      {
        heading: "Pourquoi le stress te fait stagner",
        paragraphs: [
          "Le cortisol chronique élevé réduit la synthèse protéique, dégrade la sensibilité à l\'insuline, augmente l\'appétit (surtout pour le sucre), fragmente le sommeil, et érode la testostérone. Résultat : tu t\'entraînes bien, tu manges bien, et tu ne progresses pas.",
          "La \"surcharge allostatique\" — cumul de stresseurs multiples (boulot, sommeil court, déficit calorique, entraînement intense, vie perso) — est le vrai ennemi. Ton corps ne distingue pas \"stress utile\" de \"stress inutile\". Tout rentre dans la même colonne.",
        ],
      },
      {
        heading: "Respiration diaphragmatique : le hack à 0 €",
        paragraphs: [
          "La respiration nasale lente active le système parasympathique (calme). En 5 minutes de respiration 4-7-8 (inspire 4 s, retiens 7 s, expire 8 s) ou de cohérence cardiaque (5 s inspire / 5 s expire pendant 5 min), ton rythme cardiaque baisse, ton cortisol suit.",
          "C\'est la seule chose de ce type à avoir une base scientifique solide (Streeter 2010, Zaccaro 2018). Pratiqué 2-3x/jour sur quelques semaines, tu ressens clairement la différence sur le sommeil et la réactivité au stress.",
        ],
      },
      {
        heading: "Marche en nature : sous-estimée",
        paragraphs: [
          "Les études japonaises sur le shinrin-yoku (\"bain de forêt\") montrent des baisses mesurables du cortisol et de la tension artérielle après 30-60 minutes en forêt ou en parc. Même en ville, sortir marcher 20-30 min sans téléphone est l\'un des reset mentaux les plus efficaces.",
          "Combo : marche + pas de podcasts ni musique = pensées qui se déroulent et se classent toutes seules. Tu rentres avec la tête plus claire.",
        ],
      },
      {
        heading: "Méditation : pas mystique, pratique",
        paragraphs: [
          "5 à 15 minutes par jour de méditation (focus sur la respiration, body scan, ou app type Petit Bambou, Insight Timer) pratiquées sur 4-8 semaines = baisse d\'anxiété et amélioration de l\'attention documentées dans de nombreuses études (Goyal 2014, méta-analyse JAMA).",
          "Pas besoin d\'y croire. C\'est un entraînement d\'attention. Comme la muscu : quelques minutes régulièrement > une heure une fois de temps en temps.",
        ],
      },
      {
        heading: "Limiter l\'input informationnel",
        paragraphs: [
          "L\'abus de réseaux sociaux, d\'info continue et de notifications est un stresseur reconnu. Tu n\'as pas besoin de 10 check par jour. Réduire simplement les notifications, définir 2-3 plages de consultation par jour, désactiver les alertes d\'actualité — baisse notable du stress de fond.",
          "Et ne confonds pas \"être informé\" et \"être submergé\". L\'actualité quotidienne n\'améliore pas tes décisions. Les news hebdo en résumé, souvent, oui.",
        ],
      },
      {
        heading: "Quand rien ne marche",
        paragraphs: [
          "Si le stress est trop lourd (burnout, anxiété généralisée, deuil, maladie), les outils ci-dessus aident mais ne suffisent pas. Un accompagnement psy (TCC notamment) a des taux de réussite comparables aux médicaments pour l\'anxiété et la dépression modérée. Pas un échec d\'aller voir : c\'est la même logique qu\'un kiné quand tu te blesses.",
        ],
      },
    ],
    keyTakeaways: [
      "Cortisol chronique = progrès qui s\'évaporent, même si tout est \"parfait\".",
      "Respiration 4-7-8 ou cohérence cardiaque : 5 min, 2-3x/jour.",
      "Marche en nature sans téléphone : reset mental solide.",
      "Méditation 5-15 min/jour : entraînement d\'attention efficace.",
      "Limite les notifications et les news en continu.",
    ],
  },

  {
    slug: 'alcool-tabac-soirees',
    category: 'lifestyle',
    title: 'Alcool, tabac, soirées : les vraies conséquences sur ton physique',
    summary: 'Sans moralisme. Juste la physiologie : ce que ça te coûte vraiment, et combien tu peux te permettre.',
    readMinutes: 6,
    emoji: '🍷',
    sections: [
      {
        heading: "Alcool : le plus sous-estimé",
        paragraphs: [
          "Au-delà des calories (7 kcal/g, presque autant que les gras), l\'alcool a des effets physiologiques clairs et documentés :",
          "• **Baisse de la synthèse protéique musculaire** pouvant atteindre 30 à 40 % dans les 24h suivant une consommation d\'environ 1 g/kg (gros apéro-alcool) — études Parr 2014.",
          "• **Dégradation du sommeil** : tu t\'endors plus vite mais la 2e moitié de nuit est fragmentée, moins de sommeil profond et REM. Résultat : récupération dégradée.",
          "• **Déshydratation** via l\'inhibition de l\'ADH.",
          "• **Testostérone** réduite temporairement après une grosse consommation.",
          "À petite dose (1-2 verres occasionnels), l\'impact est mesurable mais pas dramatique. À dose chronique ou binge régulier, la progression ralentit significativement.",
          "La dose \"sécurité relative\" selon les recos santé actuelles : **maximum 10 verres/semaine**, idéalement moins, avec des jours off. Zéro est le mieux, mais pas obligatoire pour progresser.",
        ],
      },
      {
        heading: "Tabac : moins discuté côté perf, dramatique côté santé",
        paragraphs: [
          "Effets sur la performance :",
          "• Réduction de la capacité d\'oxygénation (monoxyde de carbone qui se fixe sur l\'hémoglobine).",
          "• VO2 max dégradé.",
          "• Récupération plus lente, cicatrisation plus longue.",
          "• Sensibilité à l\'insuline dégradée.",
          "Côté santé long terme, les risques cardiovasculaires et pulmonaires sont tellement documentés qu\'on ne va pas les détailler ici. La seule quantité vraiment sans risque, c\'est zéro.",
          "Conseil pratique : si tu fumes et que tu veux sérieusement progresser, l\'arrêt est le single biggest levier disponible. Tout compte fait, aucun supplément, aucun programme, aucune diète n\'égale les gains de l\'arrêt du tabac.",
        ],
      },
      {
        heading: "Les soirées : gérer sans culpabilité",
        paragraphs: [
          "Le vrai sujet, ce n\'est pas le verre isolé — c\'est l\'effet domino qui suit : coucher à 3h, petit-déj sauté, grignotage compensatoire, séance loupée le lendemain, culpabilité qui fait saboter la semaine. C\'est la cascade qui fait des dégâts, pas le moment.",
          "Quelques stratégies qui marchent :",
          "1. **Alterner alcool et eau**. Tu bois la même durée, moitié moins de dégâts.",
          "2. **Manger avant de boire** (protéines + gras + fibres) pour ralentir l\'absorption.",
          "3. **Choisir consciemment** : 3 verres plaisir > 6 verres automatiques qui ne t\'apportent rien.",
          "4. **Le lendemain : routine normale**. Tu t\'es couché à 2h ? Lève-toi à 8h au lieu de 11h, va marcher, mange protéines + eau. Une soirée mal gérée ne doit pas tuer le dimanche.",
          "5. **Week-end ≠ 48h en roue libre**. Les 2 jours peuvent facilement ruiner les 5 jours \"parfaits\" si tu mets 2000 kcal excédentaires samedi + dimanche.",
        ],
      },
      {
        heading: "La question chronique vs ponctuelle",
        paragraphs: [
          "Une soirée par mois n\'a quasiment aucun effet sur ton physique si les 29 autres jours sont solides. Deux soirées par semaine pendant 6 mois, elles, creusent un écart mesurable entre \"qui tu pourrais être\" et \"qui tu es devenu\". La fréquence compte infiniment plus que l\'intensité ponctuelle.",
        ],
      },
    ],
    keyTakeaways: [
      "Alcool : -30 à -40 % de synthèse protéique après une grosse conso.",
      "Tabac : arrêter est le plus gros levier santé et perf disponible.",
      "Le dégât vient de la cascade post-soirée, pas du verre.",
      "Alterner eau/alcool, choisir consciemment, routine le lendemain.",
      "Ponctuel OK, chronique coûte cher sur 6 mois.",
    ],
  },

  // ==================== MINDSET ====================
  {
    slug: 'regimes-echouent',
    category: 'mindset',
    title: 'Pourquoi les régimes échouent (et comment les tiens ne le feront pas)',
    summary: '95% des régimes sont repris dans les 5 ans. Voici ce que disent les données, et comment ne pas être dans le lot.',
    readMinutes: 6,
    emoji: '🎯',
    sections: [
      {
        heading: "Les chiffres qui fâchent",
        paragraphs: [
          "Les méta-analyses de suivi à 5 ans (Mann 2007, Montesi 2016) montrent que 80 à 95 % des personnes ayant suivi un régime classique reprennent le poids perdu — et souvent plus. Ce n\'est pas un défaut de motivation ni de discipline individuelle. C\'est un phénomène structurel : les régimes de courte durée, restrictifs, binaire \"autorisé/interdit\", ne produisent pas de changement durable.",
          "Le corps aussi joue contre toi : adaptation métabolique, hormones de faim dérégulées, système de récompense qui amplifie le désir des aliments évités. Plus le régime est extrême, plus le rebond est violent.",
        ],
      },
      {
        heading: "Ce qui distingue ceux qui réussissent",
        paragraphs: [
          "Les 5-20 % qui maintiennent la perte de poids sur 5 ans partagent des traits clairs (National Weight Control Registry) :",
          "• Ils ne sont plus \"au régime\", ils ont **changé leur mode de vie**.",
          "• Ils pèsent régulièrement (pas obsessionnellement, mais pour détecter tôt une dérive).",
          "• Ils font de l\'activité physique régulière (en moyenne 1 h/jour, souvent juste de la marche).",
          "• Ils mangent un petit-déj (pas magique, mais corrélé à la régularité).",
          "• Ils ont des stratégies pour les week-ends et les vacances (pas de laissez-aller binaire).",
          "• Ils **tolèrent l\'imperfection** : un écart ne déclenche pas une spirale négative.",
        ],
      },
      {
        heading: "Les pièges des régimes populaires",
        paragraphs: [
          "**Interdictions absolues** (\"plus jamais de pain\", \"zéro sucre\") : créent une obsession, garantissent la rechute. Tout aliment qui devient tabou devient plus désirable.",
          "**Pertes rapides** (>1 % du poids/sem) : perte surtout d\'eau et de muscle, rebond quasi certain.",
          "**Détox / smoothies / soupes aux choux** : -6 kg en 10 jours = -6 kg d\'eau et de glycogène, repris dans la semaine suivante.",
          "**Diabolisation d\'un macronutriment** (tous les glucides, toutes les graisses) : pauvreté nutritionnelle et rapport malsain à la bouffe.",
          "**Tracking obsessionnel 24/7** pendant des années : corrélé à des troubles du comportement alimentaire.",
        ],
      },
      {
        heading: "Ce qui fonctionne à long terme",
        paragraphs: [
          "1. **Aucune interdiction absolue**. Tu peux toujours manger ce que tu veux. Tu choisis la fréquence.",
          "2. **Une vision sur 12-24 mois**, pas sur 6 semaines. Un objectif qui met 18 mois à arriver durera 10 ans. Un objectif atteint en 6 semaines dure 3 mois.",
          "3. **Des habitudes empilées, pas un système parfait**. Une par mois : -250 kcal/jour sur 4 mois = -1000 kcal. Insoutenable d\'un coup, normal en empilement.",
          "4. **Un déficit modéré** : 15 à 20 % sous ta maintenance max. Plus doux = plus long, mais plus durable.",
          "5. **Maintenance > perte**. Quand tu as atteint ton objectif, passe en maintenance stricte pendant 3-6 mois avant de relancer une perte si besoin.",
          "6. **Auto-bienveillance**. Un week-end \"raté\" ne veut pas dire \"j\'ai tout gâché\". Un écart = une info, pas un verdict.",
        ],
      },
      {
        heading: "L\'ennemi : ta vision binaire",
        paragraphs: [
          "La plupart des échecs viennent de la pensée tout-ou-rien : \"j\'ai mangé une pizza donc j\'ai foiré ma semaine donc je peux aussi bien finir tout le frigo\". C\'est la distorsion cognitive la plus destructrice en nutrition.",
          "La réalité : un repas qui dévie, c\'est un repas sur 21 dans la semaine. 95 % de l\'effet reste. Le \"tout\" n\'existe pas. Ce qui compte, c\'est la trajectoire sur 3 mois, pas le point de mardi soir.",
        ],
      },
    ],
    keyTakeaways: [
      "80-95 % des régimes échouent à 5 ans : c\'est le système, pas toi.",
      "Aucune interdiction absolue : pense fréquence, pas binaire.",
      "Vision 12-24 mois > vision 6 semaines.",
      "Déficit modéré et maintenance régulière > yo-yo extrême.",
      "Un écart est une info, pas un verdict. Reprends au repas suivant.",
    ],
  },

  {
    slug: 'consistance-motivation',
    category: 'mindset',
    title: 'Consistance > motivation : construire des habitudes qui tiennent',
    summary: 'La motivation va et vient. Les habitudes, elles, portent tout. Voici comment les installer pour de vrai.',
    readMinutes: 5,
    emoji: '🔁',
    sections: [
      {
        heading: "La motivation est une mauvaise stratégie",
        paragraphs: [
          "La motivation, c\'est l\'envie subjective de faire quelque chose. Elle fluctue selon ton sommeil, ton stress, ta météo interne, la saison. S\'appuyer sur la motivation, c\'est s\'assurer que les jours où tu en as le moins (= ceux où tu as le plus besoin de t\'y tenir), tu lâcheras.",
          "La consistance, c\'est faire quand tu n\'as pas envie. C\'est l\'infrastructure qui tient quand la motivation n\'est pas là. Et contre-intuitivement : **faire crée de la motivation, pas l\'inverse**. L\'action précède l\'envie, pas le contraire.",
        ],
      },
      {
        heading: "Les trois leviers d\'une habitude qui tient",
        paragraphs: [
          "Issu du travail de BJ Fogg et James Clear :",
          "1. **Rendre l\'habitude ultra-petite au démarrage**. Objectif : rendre impossible l\'échec. Tu veux faire du sport ? Début : mets tes baskets tous les jours. C\'est tout. Une fois fait 30 jours, tu peux ajouter \"sors de chez toi\", puis \"marche 5 min\", etc. Les \"macro-habitudes\" qui démarrent fort s\'éteignent à la 2e semaine.",
          "2. **Empiler sur une habitude existante**. \"Après X, je ferai Y\". Après le café du matin, je note 3 objectifs. Après me brosser les dents, je fais 10 pompes. L\'habitude existante devient le déclencheur automatique.",
          "3. **Se récompenser immédiatement** même symboliquement. Le cerveau ancre ce qui est suivi de récompense. Cocher une case, se dire \"bien joué\", ressentir la satisfaction d\'avoir tenu — tout compte.",
        ],
      },
      {
        heading: "Environnement : le facteur que tu sous-estimes",
        paragraphs: [
          "La volonté est une ressource limitée et facilement épuisée. L\'environnement, lui, tourne 24/24. Si la malbouffe est à portée de main, elle sera mangée. Si le tapis de course est dans la cave sous trois cartons, il ne sera pas utilisé.",
          "Design de l\'environnement :",
          "• **Visible = probable**. Mets tes tennis à la porte, une gourde d\'eau sur le bureau.",
          "• **Invisible = improbable**. Les biscuits ? Dans un placard fermé, pas sur le plan de travail. Mieux : pas dans la maison.",
          "• **Friction faible = action facile**. Prépare tes repas la veille, prends un abo salle proche de ton chemin, pose l\'app \"journal\" sur l\'écran d\'accueil.",
        ],
      },
      {
        heading: "L\'effet compound",
        paragraphs: [
          "1 % d\'amélioration par jour pendant un an = ×37 (les math des intérêts composés). Évidemment, tu ne vas pas améliorer littéralement 1 %/jour, mais la logique est juste : les petits gains cumulés **écrasent** les grands coups d\'éclat isolés.",
          "Cette semaine, tu peux commencer UNE chose. Pas cinq. Pas dix. Une. La tenir 30 jours. Ensuite, en ajouter une. Au bout d\'un an, tu as installé 8-10 habitudes, et ton quotidien est transformé sans avoir eu à serrer les dents une seule seconde.",
        ],
      },
      {
        heading: "Comment remonter après un décrochage",
        paragraphs: [
          "Tu vas décrocher. Tout le monde décroche. La différence entre les gens qui transforment leur physique et les autres n\'est **pas** qu\'ils ne ratent jamais : c\'est qu\'ils reprennent plus vite.",
          "La règle : **jamais deux fois de suite**. Un jour raté, OK. Deux jours raté, non. L\'identité qu\'on se construit est \"quelqu\'un qui revient\", pas \"quelqu\'un qui ne tombe jamais\". Énorme différence mentale et énorme différence de résultats à long terme.",
        ],
      },
    ],
    keyTakeaways: [
      "La motivation fluctue, la consistance est une infrastructure.",
      "Habitude ultra-petite au début : impossible à rater.",
      "Empile sur une habitude existante : déclencheur automatique.",
      "Design d\'environnement > force de volonté.",
      "Jamais deux décrochages de suite. L\'identité, c\'est \"je reviens\".",
    ],
  },
];

export function getArticleBySlug(slug: string): Article | null {
  return articles.find((a) => a.slug === slug) ?? null;
}

export function getArticlesByCategory(cat: ArticleCategory | 'all'): Article[] {
  if (cat === 'all') return articles;
  return articles.filter((a) => a.category === cat);
}
