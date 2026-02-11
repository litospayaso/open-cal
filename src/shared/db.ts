import type { SearchProductItemInterface } from './http.interfaces';

export interface FoodEntry {
  product: SearchProductItemInterface;
  quantity: number;
  unit: string;
}

export type MealCategory = 'breakfast' | 'snack1' | 'lunch' | 'snack2' | 'dinner' | 'snack3';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  breakfast: FoodEntry[];
  snack1: FoodEntry[];
  lunch: FoodEntry[];
  snack2: FoodEntry[];
  dinner: FoodEntry[];
  snack3: FoodEntry[];
}

const DB_NAME = 'OpenCalDB';
const DB_VERSION = 1;
const STORE_NAME = 'daily_consumption';

export class DBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('Database error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'date' });
        }
      };
    });
  }

  async getDailyLog(date: string): Promise<DailyLog> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(date);

      request.onsuccess = () => {
        const result = request.result as DailyLog;
        if (result) {
          resolve(result);
        } else {
          // Return empty log if not exists
          resolve({
            date,
            breakfast: [],
            snack1: [],
            lunch: [],
            snack2: [],
            dinner: [],
            snack3: []
          });
        }
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async saveDailyLog(log: DailyLog): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(log);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async addFoodItem(date: string, category: MealCategory, item: FoodEntry): Promise<void> {
    const log = await this.getDailyLog(date);
    log[category].push(item);
    await this.saveDailyLog(log);
  }

  async removeFoodItem(date: string, category: MealCategory, index: number): Promise<void> {
    const log = await this.getDailyLog(date);
    if (log[category] && log[category][index]) {
      log[category].splice(index, 1);
      await this.saveDailyLog(log);
    }
  }

  private async ensureInit(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
  }
}

export const dbService = new DBService();
