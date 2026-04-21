import { getDb } from './schema';

// ---------- Types ----------

export type DailyHabit = {
  id: number;
  user_id: number;
  log_date: string;
  water_ml: number;
  sleep_hours: number | null;
  mood_1_10: number | null;
  energy_1_10: number | null;
  weight_kg: number | null;
  notes: string | null;
};

export type FavoriteExercise = {
  id: number;
  user_id: number;
  exercise_api_id: string;
  exercise_name: string | null;
  added_at: string;
};

export type FavoriteRecipe = {
  id: number;
  user_id: number;
  recipe_api_id: string;
  recipe_name: string | null;
  added_at: string;
};

export type ReadArticle = {
  id: number;
  user_id: number;
  article_slug: string;
  read_at: string;
};

// ---------- Helpers ----------

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// ---------- Daily habits ----------

export async function getTodayHabits(userId: number): Promise<DailyHabit | null> {
  const db = await getDb();
  return (
    (await db.getFirstAsync<DailyHabit>(
      'SELECT * FROM daily_habits WHERE user_id = ? AND log_date = ?',
      [userId, todayStr()]
    )) ?? null
  );
}

export async function ensureTodayHabits(userId: number): Promise<DailyHabit> {
  const existing = await getTodayHabits(userId);
  if (existing) return existing;
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO daily_habits (user_id, log_date) VALUES (?, ?)',
    [userId, todayStr()]
  );
  const created = await getTodayHabits(userId);
  if (!created) throw new Error('Failed to create today habit row');
  return created;
}

export async function updateTodayHabits(
  userId: number,
  patch: Partial<Pick<DailyHabit, 'water_ml' | 'sleep_hours' | 'mood_1_10' | 'energy_1_10' | 'weight_kg' | 'notes'>>
): Promise<DailyHabit> {
  await ensureTodayHabits(userId);
  const db = await getDb();
  const fields: string[] = [];
  const values: any[] = [];
  for (const [k, v] of Object.entries(patch)) {
    fields.push(`${k} = ?`);
    values.push(v);
  }
  if (fields.length === 0) return (await getTodayHabits(userId))!;
  values.push(userId, todayStr());
  await db.runAsync(
    `UPDATE daily_habits SET ${fields.join(', ')} WHERE user_id = ? AND log_date = ?`,
    values
  );
  return (await getTodayHabits(userId))!;
}

export async function incrementWater(userId: number, ml: number): Promise<DailyHabit> {
  await ensureTodayHabits(userId);
  const db = await getDb();
  await db.runAsync(
    `UPDATE daily_habits SET water_ml = COALESCE(water_ml, 0) + ? WHERE user_id = ? AND log_date = ?`,
    [ml, userId, todayStr()]
  );
  return (await getTodayHabits(userId))!;
}

export async function resetWater(userId: number): Promise<DailyHabit> {
  await ensureTodayHabits(userId);
  const db = await getDb();
  await db.runAsync(
    `UPDATE daily_habits SET water_ml = 0 WHERE user_id = ? AND log_date = ?`,
    [userId, todayStr()]
  );
  return (await getTodayHabits(userId))!;
}

export async function countHabitDays(userId: number): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM daily_habits WHERE user_id = ?',
    [userId]
  );
  return row?.c ?? 0;
}

// ---------- Favorites: exercises ----------

export async function addFavoriteExercise(
  userId: number,
  apiId: string,
  name: string
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR IGNORE INTO favorite_exercises (user_id, exercise_api_id, exercise_name)
     VALUES (?, ?, ?)`,
    [userId, apiId, name]
  );
}

export async function removeFavoriteExercise(userId: number, apiId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'DELETE FROM favorite_exercises WHERE user_id = ? AND exercise_api_id = ?',
    [userId, apiId]
  );
}

export async function isFavoriteExercise(userId: number, apiId: string): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM favorite_exercises WHERE user_id = ? AND exercise_api_id = ?',
    [userId, apiId]
  );
  return (row?.c ?? 0) > 0;
}

export async function listFavoriteExercises(userId: number): Promise<FavoriteExercise[]> {
  const db = await getDb();
  return db.getAllAsync<FavoriteExercise>(
    'SELECT * FROM favorite_exercises WHERE user_id = ? ORDER BY added_at DESC',
    [userId]
  );
}

export async function countFavoriteExercises(userId: number): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM favorite_exercises WHERE user_id = ?',
    [userId]
  );
  return row?.c ?? 0;
}

// ---------- Favorites: recipes ----------

export async function addFavoriteRecipe(
  userId: number,
  apiId: string,
  name: string
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR IGNORE INTO favorite_recipes (user_id, recipe_api_id, recipe_name)
     VALUES (?, ?, ?)`,
    [userId, apiId, name]
  );
}

export async function removeFavoriteRecipe(userId: number, apiId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'DELETE FROM favorite_recipes WHERE user_id = ? AND recipe_api_id = ?',
    [userId, apiId]
  );
}

export async function isFavoriteRecipe(userId: number, apiId: string): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM favorite_recipes WHERE user_id = ? AND recipe_api_id = ?',
    [userId, apiId]
  );
  return (row?.c ?? 0) > 0;
}

export async function listFavoriteRecipes(userId: number): Promise<FavoriteRecipe[]> {
  const db = await getDb();
  return db.getAllAsync<FavoriteRecipe>(
    'SELECT * FROM favorite_recipes WHERE user_id = ? ORDER BY added_at DESC',
    [userId]
  );
}

export async function countFavoriteRecipes(userId: number): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM favorite_recipes WHERE user_id = ?',
    [userId]
  );
  return row?.c ?? 0;
}

// ---------- Read articles ----------

export async function markArticleRead(userId: number, slug: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR IGNORE INTO read_articles (user_id, article_slug) VALUES (?, ?)`,
    [userId, slug]
  );
}

export async function isArticleRead(userId: number, slug: string): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM read_articles WHERE user_id = ? AND article_slug = ?',
    [userId, slug]
  );
  return (row?.c ?? 0) > 0;
}

export async function listReadArticleSlugs(userId: number): Promise<string[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ article_slug: string }>(
    'SELECT article_slug FROM read_articles WHERE user_id = ?',
    [userId]
  );
  return rows.map((r) => r.article_slug);
}

export async function countReadArticles(userId: number): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM read_articles WHERE user_id = ?',
    [userId]
  );
  return row?.c ?? 0;
}
