import type { Message } from '../db/queries';

type MockInput = {
  userMessage: string;
  history: Message[];
  dossier: string;
};

function firstNameFromDossier(dossier: string): string | null {
  const m = dossier.match(/Prénom\s*:\s*([^\n]+)/i);
  if (!m) return null;
  const v = m[1].trim();
  if (!v || v === 'non renseigné') return null;
  return v;
}

function currentWeightKg(dossier: string): number | null {
  const m = dossier.match(/Poids\s*:\s*([\d.]+)\s*kg/i);
  if (!m) return null;
  const v = parseFloat(m[1]);
  return isNaN(v) ? null : v;
}

function sessionsPerWeek(dossier: string): number | null {
  const m = dossier.match(/Séances\/semaine\s*:\s*(\d+)/i);
  if (!m) return null;
  return parseInt(m[1], 10);
}

function equipment(dossier: string): string | null {
  const m = dossier.match(/Équipement\s*:\s*([^\n]+)/i);
  return m ? m[1].trim() : null;
}

function dietaryPattern(dossier: string): string | null {
  const m = dossier.match(/Régime\s*:\s*([^\n]+)/i);
  return m ? m[1].trim() : null;
}

function intolerances(dossier: string): string | null {
  const m = dossier.match(/Intolérances\s*:\s*([^\n]+)/i);
  return m ? m[1].trim() : null;
}

function hasFlag(dossier: string, kind: string): boolean {
  return dossier.includes(`[${kind}]`);
}

function includesAny(text: string, words: string[]): boolean {
  const t = text.toLowerCase();
  return words.some((w) => t.includes(w));
}

function parseLossRequest(text: string): { kg: number; weeks: number } | null {
  // "perdre 15 kg en 1 mois", "perdre 10kg en 6 semaines"
  const t = text.toLowerCase();
  const m = t.match(/perdre\s+(\d+(?:[.,]\d+)?)\s*kg\s+en\s+(\d+)\s*(jours?|semaines?|mois|an|ans|années?|annee|annees)/);
  if (!m) return null;
  const kg = parseFloat(m[1].replace(',', '.'));
  const n = parseInt(m[2], 10);
  const unit = m[3];
  let weeks: number;
  if (unit.startsWith('jour')) weeks = n / 7;
  else if (unit.startsWith('semaine')) weeks = n;
  else if (unit === 'mois') weeks = n * 4.33;
  else weeks = n * 52;
  return { kg, weeks };
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function mockReply(input: MockInput): Promise<string> {
  const { userMessage, dossier } = input;
  const delay = 800 + Math.random() * 700;
  await new Promise((r) => setTimeout(r, delay));

  const name = firstNameFromDossier(dossier);
  const namePart = name ? `${name}, ` : '';
  const msg = userMessage.trim();
  const lower = msg.toLowerCase();

  // ---- priorité 1 : détresse / TCA ----
  if (
    includesAny(lower, [
      'vomir',
      'purger',
      'anorexie',
      'boulimie',
      'me dégoûte',
      'me degoute',
      'me déteste',
      'me deteste',
      'me priver',
    ]) ||
    hasFlag(dossier, 'detresse') ||
    hasFlag(dossier, 'suspicion_tca')
  ) {
    return `${name ? name + ', ' : ''}ce que tu décris m'inquiète et je veux qu'on en parle sérieusement. Je ne vais pas te donner de conseil de sèche dans ce contexte — ce n'est pas ce dont tu as besoin. En France, tu peux appeler Anorexie Boulimie Info Écoute au 0 810 037 037 (anonyme, gratuit) pour en parler à quelqu'un de formé. Je suis là pour t'accompagner sur l'équilibre et le mouvement, pas sur la privation. Tu veux qu'on avance ensemble dans cette direction ?`;
  }

  // ---- prompt contextuel : exercice (détail page) ----
  const exoMatch = msg.match(/exercice\s+"([^"]+)"/i) || msg.match(/exercice\s+«\s*([^»]+)\s*»/i);
  if (exoMatch) {
    const exoName = exoMatch[1].trim();
    const eq = equipment(dossier);
    const injuries = (dossier.match(/Blessures\s*:\s*([^\n]+)/i) || [])[1]?.trim();
    const injuriesNote = injuries
      ? ` Vu que tu as mentionné "${injuries}", reste vigilant si le mouvement sollicite cette zone.`
      : '';
    return `${namePart}bon choix pour "${exoName}". Les points clés génériques : technique avant charge, amplitude complète, tempo contrôlé (2-3 s en excentrique), et respiration bloc/relâche. Vise 3-4 séries de 6-12 reps à 1-2 reps de la réserve, charge progressive sur 2-4 semaines.${injuriesNote}${eq ? ` Avec ton équipement (${eq}), tu peux adapter le chargement sans souci.` : ''} Si tu veux, décris-moi comment tu le fais et je te corrige.`;
  }

  // ---- prompt contextuel : recette ----
  const recetteMatch = msg.match(/recette\s+"([^"]+)"/i);
  if (recetteMatch) {
    const recetteName = recetteMatch[1].trim();
    const pattern = dietaryPattern(dossier);
    const intol = intolerances(dossier);
    const goalMatch = (dossier.match(/OBJECTIF\s*:\s*([^\n]+)/i) || [])[1]?.trim().toLowerCase() ?? '';
    const isLoss = /perte|s[eè]che|d[eé]ficit/.test(goalMatch);
    const isGain = /prise|masse/.test(goalMatch);
    const ing = (msg.match(/ingrédients principaux\s*:\s*([^)]+)\)/i) || [])[1];

    const notes: string[] = [];
    if (pattern && pattern !== 'omnivore' && ing) {
      if (/viande|bœuf|boeuf|poulet|porc|agneau/i.test(ing) && /vege|vegan/.test(pattern)) {
        notes.push(`⚠️ Les protéines animales ne collent pas à ton régime ${pattern} — remplace par tofu, tempeh ou légumineuses.`);
      }
    }
    if (intol && ing && new RegExp(intol.split(/[, ]+/).filter(Boolean).join('|'), 'i').test(ing)) {
      notes.push(`⚠️ Certains ingrédients sont dans tes intolérances (${intol}) — à adapter.`);
    }
    const objLine = isLoss
      ? "Pour ta phase de perte : réduis les portions de glucides et de gras ajouté (~1/3 en moins), augmente les légumes et les protéines."
      : isGain
      ? "Pour ta prise de masse : ajoute facilement 200-300 kcal avec une portion de riz/patate en plus et un filet d'huile d'olive."
      : "Pour du maintien, la recette telle quelle est déjà correcte.";
    return `${namePart}"${recetteName}", globalement c'est bon. ${objLine}${notes.length ? '\n\n' + notes.join('\n') : ''}\n\nPetit astuce : si tu doubles la quantité de légumes, tu rassasies mieux sans exploser les kcal.`;
  }

  // ---- prompt contextuel : article Savoir ----
  if (/explique.*sur\s+"[^"]+"/i.test(msg) || /plus sur "[^"]+"/i.test(msg)) {
    const topic = (msg.match(/"([^"]+)"/) || [])[1] ?? 'ce sujet';
    return `${namePart}parfait que tu sois tombé sur "${topic}". Le vrai enjeu pour toi, vu ton dossier, c'est de l'appliquer concrètement : choisis UNE chose à tester cette semaine (pas cinq), garde-la 7 jours, et ajuste selon comment tu te sens. La théorie c'est bien ; le faire, c'est ce qui change ton physique. Tu veux qu'on pick une action précise ensemble ?`;
  }

  // ---- prompt contextuel : exo rapide ce soir ----
  if (/s[eé]ance rapide|exo rapide|entrainement? rapide/i.test(lower)) {
    const eq = equipment(dossier);
    const eqLine = eq ? ` avec ton équipement (${eq})` : '';
    return `${namePart}version 20-25 min express${eqLine} :\n\n1. 5 min échauffement — mobilité hanches/épaules, un peu de corde ou rameur si dispo\n2. Circuit 3 tours, 40 s effort / 20 s repos :\n   • squat ou goblet squat\n   • poussée (pompes, dips, ou DC)\n   • tirage (rowing, traction, ou élastique)\n   • core (planche, ou relevé de jambes)\n3. 5 min retour au calme — étirements ou marche\n\nNiveau intensité : 7-8/10. Tu dois finir en ayant bien transpiré mais sans te cramer. Dis-moi si tu veux plus spécifique.`;
  }

  // ---- prompt contextuel : idée de repas simple ----
  if (/id[ée]e? de repas|id[ée]e? de petit[- ]?d[ée]j/i.test(lower)) {
    const pattern = dietaryPattern(dossier);
    const base = pattern && /vege|vegan/.test(pattern)
      ? `Bowl rapide : 150 g de tofu fumé poêlé + 100 g de quinoa (sec) + légumes verts sautés à l'ail + une demi-avocat + huile d'olive. ~550 kcal, ~25 g de protéines, rassasiant longtemps.`
      : `Poulet-riz-légumes mode simple : 150 g de poulet rôti (ou 2 œufs + 100 g de thon), 80 g de riz cru (~250 g cuit), 200 g de brocolis vapeur, un filet d'huile d'olive, sel-poivre-citron. ~600 kcal, ~45 g de protéines, se prépare en 20 min.`;
    return `${namePart}${base}\n\nSi tu veux, je t'en propose 3 autres variantes plus originales — dis-moi juste ce que tu as dans ton frigo.`;
  }

  // ---- salutations ----
  if (includesAny(lower, ['bonjour', 'salut', 'hello', 'coucou', 'hey '])) {
    const opts = [
      `Salut ${name ?? ''} 👋 Content de te retrouver. Qu'est-ce qu'on attaque aujourd'hui — entraînement, nutrition, ou juste un point d'étape ?`,
      `Hey ${name ?? ''}, prêt à bosser ? Dis-moi ce qui te trotte en tête en ce moment.`,
      `Yo ${name ?? ''} ! Sur quoi tu veux qu'on avance : séance du jour, idées de repas, ou on fait le bilan de la semaine ?`,
    ];
    return pick(opts);
  }

  // ---- perte excessive ----
  const loss = parseLossRequest(lower);
  if (loss) {
    const weight = currentWeightKg(dossier) ?? 70;
    const maxKgPerWeek = weight * 0.01;
    const maxKgTotal = +(maxKgPerWeek * loss.weeks).toFixed(1);
    const rate = loss.kg / loss.weeks / weight;
    if (rate > 0.01) {
      const recoWeeks = Math.ceil(loss.kg / (weight * 0.0075));
      return `${namePart}je t'arrête tout de suite. ${loss.kg} kg en ${Math.round(loss.weeks)} semaine(s), c'est ~${(rate * 100).toFixed(1)}% de ton poids par semaine — bien au-delà du seuil de sécurité (1%/sem max, 0,5-0,75% idéal). À ce rythme tu perds surtout du muscle et ton métabolisme s'effondre. Ce qui est réaliste et durable : ~${maxKgTotal} kg sur la même période, ou ${loss.kg} kg en ${recoWeeks} semaines environ. Tu préfères qu'on parte là-dessus ?`;
    }
  }

  // ---- calories / macros ----
  if (includesAny(lower, ['calorie', 'kcal', 'macro', 'macros', 'tdee', 'bmr'])) {
    return `${namePart}les calculs précis (calories, macros) viendront en phase 2 avec des outils dédiés — je ne veux pas te donner des chiffres approximatifs. En attendant, trois principes solides pour toi :\n• protéines à chaque repas (objectif ~1,6–2,2 g/kg/jour)\n• 80% d'aliments bruts, 20% de plaisir assumé\n• tu ajustes le volume total selon l'évolution de la balance sur 2 semaines, pas 2 jours\n\nTu veux que je t'aide à appliquer un de ces trois points cette semaine ?`;
  }

  // ---- training ----
  if (includesAny(lower, ['entrainement', 'entraînement', 'training', 'séance', 'seance', 'muscu', 'sport', 'workout'])) {
    const sess = sessionsPerWeek(dossier);
    const eq = equipment(dossier);
    const parts: string[] = [];
    if (sess) parts.push(`${sess} séances/semaine`);
    if (eq) parts.push(`avec ${eq}`);
    const ctx = parts.length ? `Vu ton dossier (${parts.join(', ')}), ` : '';
    return `${ctx}${name ? name + ', ' : ''}le schéma qui marche le mieux pour toi : priorité aux mouvements polyarticulaires (squat/hip hinge, push, pull) et progression sur la charge ou les reps semaine après semaine. 3-5 séries de 6-12 reps sur les gros groupes, technique nette avant tout. Tu veux qu'on détaille une séance précise ?`;
  }

  // ---- nutrition / repas ----
  if (includesAny(lower, ['manger', 'repas', 'petit-déj', 'petit dej', 'petit-dej', 'diet', 'dejeuner', 'déjeuner', 'diner', 'dîner', 'collation'])) {
    const pattern = dietaryPattern(dossier);
    const intol = intolerances(dossier);
    const parts: string[] = [];
    if (pattern && pattern !== 'omnivore') parts.push(pattern);
    if (intol) parts.push(`en évitant ${intol}`);
    const ctx = parts.length ? `En ${parts.join(' ')}, ` : '';
    return `${ctx}${name ? name + ', ' : ''}une base qui coche les cases : une source de protéines (œufs, yaourt grec, tofu, poisson), un glucide complet (avoine, pain complet, patate), un fruit ou des légumes, et un peu de bon gras (oléagineux, huile d'olive). Simple, rassasiant, ça tient sur la durée. Tu veux un exemple précis pour aujourd'hui ?`;
  }

  // ---- générique : référence au dossier ----
  const sess = sessionsPerWeek(dossier);
  const eq = equipment(dossier);
  const pattern = dietaryPattern(dossier);
  const contextBits: string[] = [];
  if (sess && eq) contextBits.push(`tu t'entraînes ${sess}x/semaine avec ${eq}`);
  else if (sess) contextBits.push(`tu es sur ${sess} séances/semaine`);
  else if (eq) contextBits.push(`tu t'entraînes avec ${eq}`);
  if (pattern && pattern !== 'omnivore') contextBits.push(`régime ${pattern}`);
  const ctxSentence = contextBits.length
    ? `Vu que ${contextBits.join(' et ')}, `
    : '';

  return `${ctxSentence}${name ? name + ', ' : ''}dis-m'en un peu plus sur ce que tu cherches — tu veux qu'on parle nutrition, entraînement, récupération, ou juste faire un point d'étape ? Je suis là pour t'aider à avancer concrètement, pas à théoriser.`;
}
