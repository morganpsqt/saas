import { getDb } from './schema';

export type Profile = {
  id: number;
  first_name: string | null;
  date_of_birth: string | null;
  biological_sex: 'male' | 'female' | null;
  height_cm: number | null;
  weight_kg: number | null;
  body_fat_pct: number | null;
  activity_level: string | null;
  created_at: string;
};

export type MedicalProfile = {
  user_id: number;
  conditions: string | null;
  medications: string | null;
  injuries: string | null;
  allergies: string | null;
  menstrual_cycle_regular: number | null;
  pregnancy_or_lactation: number | null;
  red_flags: string | null;
  free_text: string | null;
  updated_at: string;
};

export type NutritionProfile = {
  user_id: number;
  dietary_pattern: string | null;
  intolerances: string | null;
  disliked_foods: string | null;
  meals_per_day: number | null;
  cooking_minutes_per_day: number | null;
  weekly_food_budget: number | null;
  current_habits_notes: string | null;
};

export type TrainingProfile = {
  user_id: number;
  experience_years: number | null;
  equipment: string | null;
  sessions_per_week: number | null;
  max_session_minutes: number | null;
  preferences: string | null;
  injuries_to_respect: string | null;
};

export type Goal = {
  id: number;
  user_id: number;
  goal_type: string | null;
  target_date: string | null;
  target_metric: string | null;
  motivation_text: string | null;
  status: string;
};

export type Message = {
  id: number;
  user_id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

// ---------- Profile ----------

export async function createProfile(data: Partial<Profile>): Promise<number> {
  const db = await getDb();
  const res = await db.runAsync(
    `INSERT INTO profiles (first_name, date_of_birth, biological_sex, height_cm, weight_kg, body_fat_pct, activity_level)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.first_name ?? null,
      data.date_of_birth ?? null,
      data.biological_sex ?? null,
      data.height_cm ?? null,
      data.weight_kg ?? null,
      data.body_fat_pct ?? null,
      data.activity_level ?? null,
    ]
  );
  return res.lastInsertRowId;
}

export async function updateProfile(id: number, data: Partial<Profile>): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE profiles SET
      first_name = COALESCE(?, first_name),
      date_of_birth = COALESCE(?, date_of_birth),
      biological_sex = COALESCE(?, biological_sex),
      height_cm = COALESCE(?, height_cm),
      weight_kg = COALESCE(?, weight_kg),
      body_fat_pct = COALESCE(?, body_fat_pct),
      activity_level = COALESCE(?, activity_level)
    WHERE id = ?`,
    [
      data.first_name ?? null,
      data.date_of_birth ?? null,
      data.biological_sex ?? null,
      data.height_cm ?? null,
      data.weight_kg ?? null,
      data.body_fat_pct ?? null,
      data.activity_level ?? null,
      id,
    ]
  );
}

export async function getProfile(id: number): Promise<Profile | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Profile>('SELECT * FROM profiles WHERE id = ?', [id]);
  return row ?? null;
}

export async function getFirstProfile(): Promise<Profile | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Profile>(
    'SELECT * FROM profiles ORDER BY id ASC LIMIT 1'
  );
  return row ?? null;
}

// ---------- Medical ----------

export async function upsertMedical(userId: number, data: Partial<MedicalProfile>): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO medical_profile
      (user_id, conditions, medications, injuries, allergies, menstrual_cycle_regular, pregnancy_or_lactation, red_flags, free_text, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id) DO UPDATE SET
      conditions = excluded.conditions,
      medications = excluded.medications,
      injuries = excluded.injuries,
      allergies = excluded.allergies,
      menstrual_cycle_regular = excluded.menstrual_cycle_regular,
      pregnancy_or_lactation = excluded.pregnancy_or_lactation,
      red_flags = excluded.red_flags,
      free_text = excluded.free_text,
      updated_at = CURRENT_TIMESTAMP`,
    [
      userId,
      data.conditions ?? null,
      data.medications ?? null,
      data.injuries ?? null,
      data.allergies ?? null,
      data.menstrual_cycle_regular ?? null,
      data.pregnancy_or_lactation ?? null,
      data.red_flags ?? null,
      data.free_text ?? null,
    ]
  );
}

export async function getMedical(userId: number): Promise<MedicalProfile | null> {
  const db = await getDb();
  return (
    (await db.getFirstAsync<MedicalProfile>(
      'SELECT * FROM medical_profile WHERE user_id = ?',
      [userId]
    )) ?? null
  );
}

export async function updateRedFlags(userId: number, flags: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE medical_profile SET red_flags = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
    [flags, userId]
  );
}

// ---------- Nutrition ----------

export async function upsertNutrition(userId: number, data: Partial<NutritionProfile>): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO nutrition_profile
      (user_id, dietary_pattern, intolerances, disliked_foods, meals_per_day, cooking_minutes_per_day, weekly_food_budget, current_habits_notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
      dietary_pattern = excluded.dietary_pattern,
      intolerances = excluded.intolerances,
      disliked_foods = excluded.disliked_foods,
      meals_per_day = excluded.meals_per_day,
      cooking_minutes_per_day = excluded.cooking_minutes_per_day,
      weekly_food_budget = excluded.weekly_food_budget,
      current_habits_notes = excluded.current_habits_notes`,
    [
      userId,
      data.dietary_pattern ?? null,
      data.intolerances ?? null,
      data.disliked_foods ?? null,
      data.meals_per_day ?? 3,
      data.cooking_minutes_per_day ?? null,
      data.weekly_food_budget ?? null,
      data.current_habits_notes ?? null,
    ]
  );
}

export async function getNutrition(userId: number): Promise<NutritionProfile | null> {
  const db = await getDb();
  return (
    (await db.getFirstAsync<NutritionProfile>(
      'SELECT * FROM nutrition_profile WHERE user_id = ?',
      [userId]
    )) ?? null
  );
}

// ---------- Training ----------

export async function upsertTraining(userId: number, data: Partial<TrainingProfile>): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO training_profile
      (user_id, experience_years, equipment, sessions_per_week, max_session_minutes, preferences, injuries_to_respect)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
      experience_years = excluded.experience_years,
      equipment = excluded.equipment,
      sessions_per_week = excluded.sessions_per_week,
      max_session_minutes = excluded.max_session_minutes,
      preferences = excluded.preferences,
      injuries_to_respect = excluded.injuries_to_respect`,
    [
      userId,
      data.experience_years ?? null,
      data.equipment ?? null,
      data.sessions_per_week ?? null,
      data.max_session_minutes ?? null,
      data.preferences ?? null,
      data.injuries_to_respect ?? null,
    ]
  );
}

export async function getTraining(userId: number): Promise<TrainingProfile | null> {
  const db = await getDb();
  return (
    (await db.getFirstAsync<TrainingProfile>(
      'SELECT * FROM training_profile WHERE user_id = ?',
      [userId]
    )) ?? null
  );
}

// ---------- Goals ----------

export async function createGoal(userId: number, data: Partial<Goal>): Promise<number> {
  const db = await getDb();
  const res = await db.runAsync(
    `INSERT INTO goals (user_id, goal_type, target_date, target_metric, motivation_text, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      data.goal_type ?? null,
      data.target_date ?? null,
      data.target_metric ?? null,
      data.motivation_text ?? null,
      data.status ?? 'active',
    ]
  );
  return res.lastInsertRowId;
}

export async function getActiveGoal(userId: number): Promise<Goal | null> {
  const db = await getDb();
  return (
    (await db.getFirstAsync<Goal>(
      `SELECT * FROM goals WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1`,
      [userId]
    )) ?? null
  );
}

// ---------- Messages ----------

export async function addMessage(
  userId: number,
  role: 'user' | 'assistant',
  content: string
): Promise<number> {
  const db = await getDb();
  const res = await db.runAsync(
    `INSERT INTO messages (user_id, role, content) VALUES (?, ?, ?)`,
    [userId, role, content]
  );
  return res.lastInsertRowId;
}

export async function getRecentMessages(userId: number, limit = 20): Promise<Message[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Message>(
    `SELECT * FROM (
       SELECT * FROM messages WHERE user_id = ? ORDER BY id DESC LIMIT ?
     ) ORDER BY id ASC`,
    [userId, limit]
  );
  return rows;
}

export async function getAllMessages(userId: number): Promise<Message[]> {
  const db = await getDb();
  return db.getAllAsync<Message>(
    `SELECT * FROM messages WHERE user_id = ? ORDER BY id ASC`,
    [userId]
  );
}
