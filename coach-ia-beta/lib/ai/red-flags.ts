export type RedFlagKind =
  | 'suspicion_tca'
  | 'mineur_restriction'
  | 'detresse'
  | 'grossesse'
  | 'medication_sensible';

export type RedFlag = {
  kind: RedFlagKind;
  detail: string;
};

type ProfileInput = {
  date_of_birth?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  pregnancy_or_lactation?: boolean | number | null;
  medications?: string | null;
  free_text?: string | null;
  goal_type?: string | null;
};

const DISTRESS_KEYWORDS = [
  'vomir',
  'me faire vomir',
  'purger',
  'boulimie',
  'anorexie',
  'me priver',
  'je déteste mon corps',
  'je me dégoûte',
  'me dégoûte',
];

const SENSITIVE_MEDS = [
  'corticoïde',
  'corticoide',
  'cortisone',
  'prednisone',
  'prednisolone',
  'chimio',
  'chimiothérapie',
  'chimiotherapie',
  'antipsychotique',
  'olanzapine',
  'rispéridone',
  'risperidone',
  'clozapine',
];

function ageFromDob(dob?: string | null): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

function bmi(height_cm?: number | null, weight_kg?: number | null): number | null {
  if (!height_cm || !weight_kg || height_cm <= 0) return null;
  const m = height_cm / 100;
  return weight_kg / (m * m);
}

export function detectRedFlags(p: ProfileInput): RedFlag[] {
  const flags: RedFlag[] = [];
  const isLossGoal = /perte|sèche|seche|deficit|maigrir/i.test(p.goal_type ?? '');

  const calcBmi = bmi(p.height_cm, p.weight_kg);
  if (calcBmi !== null && calcBmi < 17.5 && isLossGoal) {
    flags.push({
      kind: 'suspicion_tca',
      detail: `IMC = ${calcBmi.toFixed(1)} (< 17.5) avec objectif de perte de poids`,
    });
  }

  const age = ageFromDob(p.date_of_birth);
  if (age !== null && age < 18 && isLossGoal) {
    flags.push({
      kind: 'mineur_restriction',
      detail: `Utilisateur mineur (${age} ans) avec objectif de restriction`,
    });
  }

  const text = (p.free_text ?? '').toLowerCase();
  const matched = DISTRESS_KEYWORDS.filter((kw) => text.includes(kw));
  if (matched.length > 0) {
    flags.push({
      kind: 'detresse',
      detail: `Mots-clés détectés : ${matched.join(', ')}`,
    });
  }

  if (p.pregnancy_or_lactation) {
    flags.push({ kind: 'grossesse', detail: 'Grossesse ou allaitement déclaré' });
  }

  const meds = (p.medications ?? '').toLowerCase();
  const sensitive = SENSITIVE_MEDS.filter((m) => meds.includes(m));
  if (sensitive.length > 0) {
    flags.push({
      kind: 'medication_sensible',
      detail: `Médicament(s) sensible(s) : ${sensitive.join(', ')}`,
    });
  }

  return flags;
}

export function serializeFlags(flags: RedFlag[]): string {
  return JSON.stringify(flags);
}

export function parseFlags(raw: string | null | undefined): RedFlag[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
