import { fetchCached } from './cache';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
};

export type MealDetail = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string;
  strYoutube: string | null;
  ingredients: { ingredient: string; measure: string }[];
};

export const MEAL_CATEGORIES = [
  { key: 'all', labelFr: 'Toutes', themealdb: null as string | null },
  { key: 'breakfast', labelFr: 'Petit-déj', themealdb: 'Breakfast' },
  { key: 'chicken', labelFr: 'Poulet', themealdb: 'Chicken' },
  { key: 'beef', labelFr: 'Bœuf', themealdb: 'Beef' },
  { key: 'seafood', labelFr: 'Poisson', themealdb: 'Seafood' },
  { key: 'pasta', labelFr: 'Pâtes', themealdb: 'Pasta' },
  { key: 'vegetarian', labelFr: 'Végé', themealdb: 'Vegetarian' },
  { key: 'vegan', labelFr: 'Vegan', themealdb: 'Vegan' },
  { key: 'side', labelFr: 'Accompagnement', themealdb: 'Side' },
  { key: 'dessert', labelFr: 'Dessert', themealdb: 'Dessert' },
];

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`themealdb ${path} → HTTP ${res.status}`);
  return (await res.json()) as T;
}

export async function fetchByCategory(category: string): Promise<MealSummary[]> {
  const key = `mdb:cat:${category}`;
  const data = await fetchCached(
    key,
    () => apiGet<{ meals: MealSummary[] | null }>(
      `/filter.php?c=${encodeURIComponent(category)}`
    ),
    24
  );
  return (data.meals ?? []).map((m) => ({ ...m, strCategory: category }));
}

export async function fetchByQuery(query: string): Promise<MealSummary[]> {
  const q = query.trim();
  if (!q) return [];
  const key = `mdb:search:${q.toLowerCase()}`;
  const data = await fetchCached(
    key,
    () =>
      apiGet<{ meals: any[] | null }>(
        `/search.php?s=${encodeURIComponent(q)}`
      ),
    24
  );
  return (data.meals ?? []).map(
    (m): MealSummary => ({
      idMeal: m.idMeal,
      strMeal: m.strMeal,
      strMealThumb: m.strMealThumb,
      strCategory: m.strCategory,
    })
  );
}

export async function fetchRandom(): Promise<MealDetail | null> {
  // Pas de cache : aléatoire à chaque fois sinon ça perd son intérêt
  try {
    const res = await fetch(`${BASE}/random.php`);
    if (!res.ok) return null;
    const data = (await res.json()) as { meals: any[] | null };
    const m = data.meals?.[0];
    if (!m) return null;
    return parseDetail(m);
  } catch {
    return null;
  }
}

export async function fetchMealDetail(idMeal: string): Promise<MealDetail | null> {
  const key = `mdb:detail:${idMeal}`;
  try {
    const data = await fetchCached(
      key,
      () => apiGet<{ meals: any[] | null }>(`/lookup.php?i=${idMeal}`),
      24 * 7
    );
    const m = data.meals?.[0];
    if (!m) return null;
    return parseDetail(m);
  } catch {
    return null;
  }
}

function parseDetail(m: any): MealDetail {
  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = (m[`strIngredient${i}`] ?? '').trim();
    const mea = (m[`strMeasure${i}`] ?? '').trim();
    if (ing) {
      ingredients.push({ ingredient: ing, measure: mea });
    }
  }
  return {
    idMeal: m.idMeal,
    strMeal: m.strMeal,
    strMealThumb: m.strMealThumb,
    strCategory: m.strCategory ?? null,
    strArea: m.strArea ?? null,
    strInstructions: m.strInstructions ?? '',
    strYoutube: m.strYoutube || null,
    ingredients,
  };
}

export function fallbackImageFor(name: string): string {
  const seed = encodeURIComponent(name.split(' ').slice(0, 2).join(','));
  return `https://picsum.photos/seed/${seed}/400/400`;
}
