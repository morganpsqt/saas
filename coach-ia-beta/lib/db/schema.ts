import * as SQLite from 'expo-sqlite';

const DB_NAME = 'maya.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbInstance;
}

const SCHEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT,
  date_of_birth TEXT,
  biological_sex TEXT CHECK(biological_sex IN ('male','female')),
  height_cm INTEGER,
  weight_kg REAL,
  body_fat_pct REAL,
  activity_level TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medical_profile (
  user_id INTEGER PRIMARY KEY REFERENCES profiles(id),
  conditions TEXT,
  medications TEXT,
  injuries TEXT,
  allergies TEXT,
  menstrual_cycle_regular INTEGER,
  pregnancy_or_lactation INTEGER DEFAULT 0,
  red_flags TEXT,
  free_text TEXT,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nutrition_profile (
  user_id INTEGER PRIMARY KEY REFERENCES profiles(id),
  dietary_pattern TEXT,
  intolerances TEXT,
  disliked_foods TEXT,
  meals_per_day INTEGER DEFAULT 3,
  cooking_minutes_per_day INTEGER,
  weekly_food_budget REAL,
  current_habits_notes TEXT
);

CREATE TABLE IF NOT EXISTS training_profile (
  user_id INTEGER PRIMARY KEY REFERENCES profiles(id),
  experience_years REAL,
  equipment TEXT,
  sessions_per_week INTEGER,
  max_session_minutes INTEGER,
  preferences TEXT,
  injuries_to_respect TEXT
);

CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES profiles(id),
  goal_type TEXT,
  target_date TEXT,
  target_metric TEXT,
  motivation_text TEXT,
  status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES profiles(id),
  role TEXT CHECK(role IN ('user','assistant')),
  content TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_user_created ON messages(user_id, created_at);
`;

export async function initDatabase(): Promise<void> {
  const db = await getDb();
  await db.execAsync(SCHEMA);
}

export async function resetDatabase(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    DROP TABLE IF EXISTS messages;
    DROP TABLE IF EXISTS goals;
    DROP TABLE IF EXISTS training_profile;
    DROP TABLE IF EXISTS nutrition_profile;
    DROP TABLE IF EXISTS medical_profile;
    DROP TABLE IF EXISTS profiles;
  `);
  await db.execAsync(SCHEMA);
}
