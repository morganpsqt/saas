import {
  getProfile,
  getMedical,
  getNutrition,
  getTraining,
  getActiveGoal,
  getRecentMessages,
  type Message,
} from '../db/queries';
import { parseFlags } from './red-flags';

function ageFrom(dob: string | null | undefined): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const n = new Date();
  let a = n.getFullYear() - d.getFullYear();
  const m = n.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && n.getDate() < d.getDate())) a--;
  return a;
}

function bmi(h: number | null | undefined, w: number | null | undefined): number | null {
  if (!h || !w || h <= 0) return null;
  const m = h / 100;
  return +(w / (m * m)).toFixed(1);
}

export type BuiltContext = {
  dossier: string;
  history: Message[];
};

export async function buildContext(userId: number): Promise<BuiltContext> {
  const [profile, medical, nutrition, training, goal, history] = await Promise.all([
    getProfile(userId),
    getMedical(userId),
    getNutrition(userId),
    getTraining(userId),
    getActiveGoal(userId),
    getRecentMessages(userId, 20),
  ]);

  const age = ageFrom(profile?.date_of_birth);
  const bmiVal = bmi(profile?.height_cm, profile?.weight_kg);
  const flags = parseFlags(medical?.red_flags);

  const lines: string[] = ['<user_dossier>'];

  // identity
  lines.push(
    `Prénom : ${profile?.first_name ?? 'non renseigné'}`,
    `Âge : ${age ?? 'inconnu'} ${age !== null ? 'ans' : ''}`.trim(),
    `Sexe biologique : ${profile?.biological_sex ?? 'non renseigné'}`,
    `Taille : ${profile?.height_cm ?? '?'} cm`,
    `Poids : ${profile?.weight_kg ?? '?'} kg`,
    `IMC : ${bmiVal ?? '?'}`,
    `Masse grasse : ${profile?.body_fat_pct ?? '?'} %`,
    `Activité quotidienne : ${profile?.activity_level ?? '?'}`
  );

  // goal
  lines.push('', `OBJECTIF : ${goal?.goal_type ?? 'non défini'}`);
  if (goal?.target_metric) lines.push(`Cible : ${goal.target_metric}`);
  if (goal?.target_date) lines.push(`Échéance : ${goal.target_date}`);
  if (goal?.motivation_text) lines.push(`Motivation : ${goal.motivation_text}`);

  // medical
  lines.push('', 'MÉDICAL :');
  if (medical?.conditions) lines.push(`- Conditions : ${medical.conditions}`);
  if (medical?.medications) lines.push(`- Médicaments : ${medical.medications}`);
  if (medical?.injuries) lines.push(`- Blessures : ${medical.injuries}`);
  if (medical?.allergies) lines.push(`- Allergies : ${medical.allergies}`);
  if (medical?.pregnancy_or_lactation) lines.push(`- Grossesse / allaitement : OUI`);
  if (medical?.menstrual_cycle_regular !== null && medical?.menstrual_cycle_regular !== undefined) {
    lines.push(`- Cycle menstruel régulier : ${medical.menstrual_cycle_regular ? 'oui' : 'non'}`);
  }

  // nutrition
  lines.push('', 'NUTRITION :');
  if (nutrition?.dietary_pattern) lines.push(`- Régime : ${nutrition.dietary_pattern}`);
  if (nutrition?.intolerances) lines.push(`- Intolérances : ${nutrition.intolerances}`);
  if (nutrition?.disliked_foods) lines.push(`- Aliments détestés : ${nutrition.disliked_foods}`);
  if (nutrition?.meals_per_day) lines.push(`- Repas/jour : ${nutrition.meals_per_day}`);
  if (nutrition?.cooking_minutes_per_day)
    lines.push(`- Temps cuisine/jour : ${nutrition.cooking_minutes_per_day} min`);
  if (nutrition?.weekly_food_budget)
    lines.push(`- Budget hebdo : ${nutrition.weekly_food_budget} €`);
  if (nutrition?.current_habits_notes)
    lines.push(`- Habitudes : ${nutrition.current_habits_notes}`);

  // training
  lines.push('', 'TRAINING :');
  if (training?.experience_years !== null && training?.experience_years !== undefined)
    lines.push(`- Expérience : ${training.experience_years} ans`);
  if (training?.equipment) lines.push(`- Équipement : ${training.equipment}`);
  if (training?.sessions_per_week)
    lines.push(`- Séances/semaine : ${training.sessions_per_week}`);
  if (training?.max_session_minutes)
    lines.push(`- Durée max séance : ${training.max_session_minutes} min`);
  if (training?.preferences) lines.push(`- Préférences : ${training.preferences}`);
  if (training?.injuries_to_respect)
    lines.push(`- Blessures à respecter : ${training.injuries_to_respect}`);

  // flags
  if (flags.length > 0) {
    lines.push('', 'RED FLAGS DÉTECTÉS :');
    for (const f of flags) {
      lines.push(`- [${f.kind}] ${f.detail}`);
    }
  }

  lines.push('</user_dossier>');

  return { dossier: lines.join('\n'), history };
}
