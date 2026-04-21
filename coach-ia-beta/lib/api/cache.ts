import { getDb } from '../db/schema';

type CacheRow = {
  cache_key: string;
  content: string;
  fetched_at: string;
};

function isExpired(fetchedAt: string, ttlHours: number): boolean {
  const t = new Date(fetchedAt).getTime();
  if (isNaN(t)) return true;
  const ageMs = Date.now() - t;
  return ageMs > ttlHours * 3600 * 1000;
}

export async function getCacheRaw(key: string): Promise<CacheRow | null> {
  const db = await getDb();
  return (
    (await db.getFirstAsync<CacheRow>(
      'SELECT * FROM api_cache WHERE cache_key = ?',
      [key]
    )) ?? null
  );
}

export async function setCache(key: string, value: unknown): Promise<void> {
  const db = await getDb();
  const content = JSON.stringify(value);
  await db.runAsync(
    `INSERT INTO api_cache (cache_key, content, fetched_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(cache_key) DO UPDATE SET
       content = excluded.content,
       fetched_at = CURRENT_TIMESTAMP`,
    [key, content]
  );
}

export async function fetchCached<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  ttlHours = 24
): Promise<T> {
  const row = await getCacheRaw(cacheKey);
  if (row && !isExpired(row.fetched_at, ttlHours)) {
    try {
      return JSON.parse(row.content) as T;
    } catch {
      // fall through to refetch
    }
  }
  try {
    const fresh = await fetcher();
    await setCache(cacheKey, fresh);
    return fresh;
  } catch (e) {
    if (row) {
      // fallback to stale cache
      try {
        return JSON.parse(row.content) as T;
      } catch {
        /* ignore */
      }
    }
    throw e;
  }
}

export async function clearApiCache(): Promise<number> {
  const db = await getDb();
  const before = await db.getFirstAsync<{ c: number }>(
    'SELECT COUNT(*) as c FROM api_cache'
  );
  await db.execAsync('DELETE FROM api_cache');
  return before?.c ?? 0;
}
