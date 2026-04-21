import { fetchCached } from './cache';

const BASE = 'https://wger.de/api/v2';

const LANG_FR = 12;
const LANG_EN = 2;

// ---------- Types (simplifiés) ----------

export type WgerImage = {
  id: number;
  image: string;
  is_main: boolean;
};

export type WgerTranslation = {
  id: number;
  name: string;
  description: string;
  language: number;
};

export type WgerCategory = { id: number; name: string };
export type WgerMuscle = { id: number; name: string; name_en: string };
export type WgerEquipment = { id: number; name: string };

export type WgerExerciseInfo = {
  id: number;
  uuid: string;
  category: WgerCategory;
  muscles: WgerMuscle[];
  muscles_secondary: WgerMuscle[];
  equipment: WgerEquipment[];
  images: WgerImage[];
  translations: WgerTranslation[];
};

export type ExerciseSummary = {
  id: number;
  name: string;
  category: string;
  categoryFr: string;
  muscles: string[];
  musclesFr: string[];
  equipment: string[];
  equipmentFr: string[];
  imageUrl: string | null;
  hasFrenchDescription: boolean;
};

export type ExerciseDetail = ExerciseSummary & {
  description: string;
  descriptionLang: 'fr' | 'en' | 'none';
  allImages: string[];
};

// ---------- Traductions de catégories / muscles / équipement ----------

const CATEGORY_FR: Record<string, string> = {
  Abs: 'Abdos',
  Arms: 'Bras',
  Back: 'Dos',
  Calves: 'Mollets',
  Cardio: 'Cardio',
  Chest: 'Pectoraux',
  Legs: 'Jambes',
  Shoulders: 'Épaules',
};

const EQUIPMENT_FR: Record<string, string> = {
  Barbell: 'Barre',
  Bench: 'Banc',
  'Dumbbell': 'Haltères',
  'Gym mat': 'Tapis',
  'Incline bench': 'Banc incliné',
  'Kettlebell': 'Kettlebell',
  'Pull-up bar': 'Barre de traction',
  'SZ-Bar': 'Barre EZ',
  'Swiss Ball': 'Swiss ball',
  'none (bodyweight exercise)': 'Aucun (poids du corps)',
  'Resistance band': 'Élastique',
  'Cable machine': 'Poulie',
  'Machine': 'Machine',
};

const MUSCLE_FR: Record<string, string> = {
  'Anterior deltoid': 'Deltoïde antérieur',
  'Biceps brachii': 'Biceps',
  'Biceps femoris': 'Ischio-jambiers',
  'Brachialis': 'Brachial',
  'Gastrocnemius': 'Mollet',
  'Gluteus maximus': 'Fessiers',
  'Latissimus dorsi': 'Grand dorsal',
  'Obliquus externus abdominis': 'Obliques',
  'Pectoralis major': 'Pectoraux',
  'Quadriceps femoris': 'Quadriceps',
  'Rectus abdominis': 'Abdos',
  'Serratus anterior': 'Serratus',
  'Soleus': 'Soléaire',
  'Trapezius': 'Trapèzes',
  'Triceps brachii': 'Triceps',
};

// ---------- Catégories exposées aux filtres ----------

export const EXERCISE_CATEGORIES = [
  { key: 'all', labelFr: 'Tous', wgerName: null as string | null },
  { key: 'chest', labelFr: 'Pectoraux', wgerName: 'Chest' },
  { key: 'back', labelFr: 'Dos', wgerName: 'Back' },
  { key: 'legs', labelFr: 'Jambes', wgerName: 'Legs' },
  { key: 'shoulders', labelFr: 'Épaules', wgerName: 'Shoulders' },
  { key: 'arms', labelFr: 'Bras', wgerName: 'Arms' },
  { key: 'abs', labelFr: 'Abdos', wgerName: 'Abs' },
  { key: 'cardio', labelFr: 'Cardio', wgerName: 'Cardio' },
];

export const EQUIPMENT_FILTERS = [
  { key: 'all', labelFr: 'Tout équipement' },
  { key: 'none', labelFr: 'Aucun' },
  { key: 'dumbbell', labelFr: 'Haltères' },
  { key: 'barbell', labelFr: 'Barre' },
  { key: 'machine', labelFr: 'Machine' },
  { key: 'band', labelFr: 'Élastique' },
];

function matchEquipmentFilter(equipmentList: string[], filterKey: string): boolean {
  if (filterKey === 'all') return true;
  const joined = equipmentList.join(' ').toLowerCase();
  switch (filterKey) {
    case 'none':
      return equipmentList.length === 0 || joined.includes('bodyweight');
    case 'dumbbell':
      return joined.includes('dumbbell');
    case 'barbell':
      return joined.includes('barbell') || joined.includes('sz-bar');
    case 'machine':
      return joined.includes('machine') || joined.includes('cable');
    case 'band':
      return joined.includes('resistance band') || joined.includes('elastic');
  }
  return true;
}

function pickTranslation(
  translations: WgerTranslation[]
): { translation: WgerTranslation | null; lang: 'fr' | 'en' | 'none' } {
  const fr = translations.find((t) => t.language === LANG_FR);
  if (fr && fr.name) return { translation: fr, lang: 'fr' };
  const en = translations.find((t) => t.language === LANG_EN);
  if (en && en.name) return { translation: en, lang: 'en' };
  return { translation: null, lang: 'none' };
}

function pickImage(images: WgerImage[]): string | null {
  if (!images || images.length === 0) return null;
  const main = images.find((i) => i.is_main);
  return (main ?? images[0]).image;
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>(\s*)/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function toSummary(info: WgerExerciseInfo): ExerciseSummary {
  const { translation, lang } = pickTranslation(info.translations);
  const name = translation?.name ?? `Exercice #${info.id}`;
  const catEn = info.category?.name ?? '';
  const musclesEn = (info.muscles ?? []).map((m) => m.name_en || m.name);
  const equipEn = (info.equipment ?? []).map((e) => e.name);
  return {
    id: info.id,
    name,
    category: catEn,
    categoryFr: CATEGORY_FR[catEn] ?? catEn,
    muscles: musclesEn,
    musclesFr: musclesEn.map((m) => MUSCLE_FR[m] ?? m),
    equipment: equipEn,
    equipmentFr: equipEn.map((e) => EQUIPMENT_FR[e] ?? e),
    imageUrl: pickImage(info.images ?? []),
    hasFrenchDescription: lang === 'fr',
  };
}

// ---------- API calls ----------

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`wger ${path} → HTTP ${res.status}`);
  return (await res.json()) as T;
}

type PaginatedInfo = {
  count: number;
  next: string | null;
  results: WgerExerciseInfo[];
};

export async function fetchExercisesPage(
  offset = 0,
  limit = 20
): Promise<{ items: ExerciseSummary[]; total: number; hasMore: boolean }> {
  const key = `wger:list:${offset}:${limit}`;
  const data = await fetchCached(
    key,
    () =>
      apiGet<PaginatedInfo>(
        `/exerciseinfo/?limit=${limit}&offset=${offset}&ordering=-id`
      ),
    24
  );
  const items = data.results.map(toSummary);
  return {
    items,
    total: data.count,
    hasMore: Boolean(data.next),
  };
}

export async function fetchExerciseDetail(id: number): Promise<ExerciseDetail> {
  const key = `wger:detail:${id}`;
  const info = await fetchCached(
    key,
    () => apiGet<WgerExerciseInfo>(`/exerciseinfo/${id}/`),
    24 * 7
  );
  const summary = toSummary(info);
  const { translation, lang } = pickTranslation(info.translations);
  const description = translation ? stripHtml(translation.description) : '';
  return {
    ...summary,
    description,
    descriptionLang: lang,
    allImages: (info.images ?? []).map((i) => i.image),
  };
}

// Recherche + filtres locaux (sur la page courante)
export function filterExercises(
  exercises: ExerciseSummary[],
  query: string,
  categoryKey: string,
  equipmentKey: string
): ExerciseSummary[] {
  const q = query.trim().toLowerCase();
  const cat = EXERCISE_CATEGORIES.find((c) => c.key === categoryKey);
  return exercises.filter((e) => {
    if (q && !e.name.toLowerCase().includes(q) && !e.musclesFr.join(' ').toLowerCase().includes(q)) {
      return false;
    }
    if (cat?.wgerName && e.category !== cat.wgerName) return false;
    if (!matchEquipmentFilter(e.equipment, equipmentKey)) return false;
    return true;
  });
}

export function fallbackImageFor(name: string): string {
  const seed = encodeURIComponent(name.split(' ').slice(0, 2).join(','));
  return `https://picsum.photos/seed/${seed}/400/400`;
}
