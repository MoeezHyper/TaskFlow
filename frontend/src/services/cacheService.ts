interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheService {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();

  /**
   * Get an item from memory cache or localStorage if it hasn't expired.
   */
  get<T>(key: string): T | null {
    // 1. Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry) {
      if (Date.now() < memoryEntry.expiresAt) {
        return memoryEntry.data as T;
      }
      // Expired in memory
      this.memoryCache.delete(key);
    }

    // 2. Check localStorage
    try {
      const raw = localStorage.getItem(`app_cache_${key}`);
      if (!raw) return null;

      const entry: CacheEntry<T> = JSON.parse(raw);
      if (Date.now() < entry.expiresAt) {
        // Re-populate memory cache
        this.memoryCache.set(key, entry);
        return entry.data;
      }

      // Expired in localStorage
      localStorage.removeItem(`app_cache_${key}`);
    } catch (e) {
      console.warn('[CacheService] Error reading from localStorage:', e);
    }

    return null;
  }

  /**
   * Set an item in memory cache and localStorage with a specific TTL (in milliseconds).
   */
  set<T>(key: string, data: T, ttlMs: number): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttlMs,
    };

    // Store in memory
    this.memoryCache.set(key, entry);

    // Store in localStorage
    try {
      localStorage.setItem(`app_cache_${key}`, JSON.stringify(entry));
    } catch (e) {
      console.warn('[CacheService] Error writing to localStorage:', e);
    }
  }

  /**
   * Remove a specific item from cache.
   */
  remove(key: string): void {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(`app_cache_${key}`);
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Remove all items starting with a specific prefix.
   */
  clearByPrefix(prefix: string): void {
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`app_cache_${prefix}`)) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      // Ignore
    }
  }
}

export const cacheService = new CacheService();

// Weather Cache Helper (10 minutes TTL)
const WEATHER_CACHE_TTL = 10 * 60 * 1000;

export const weatherCache = {
  get(city: string) {
    const key = `weather_${city.trim().toLowerCase()}`;
    return cacheService.get<any>(key);
  },
  set(city: string, data: any) {
    const key = `weather_${city.trim().toLowerCase()}`;
    cacheService.set(key, data, WEATHER_CACHE_TTL);
  },
};

// Task Cache Helper (5 minutes TTL)
const TASK_CACHE_TTL = 5 * 60 * 1000;
const TASK_CACHE_KEY = 'tasks_all';

export const taskCache = {
  get() {
    return cacheService.get<any[]>(TASK_CACHE_KEY);
  },
  set(tasks: any[]) {
    cacheService.set(TASK_CACHE_KEY, tasks, TASK_CACHE_TTL);
  },
  invalidate() {
    cacheService.remove(TASK_CACHE_KEY);
  },
};
