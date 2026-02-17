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

export interface Meal {
  id: string;
  name: string;
  description?: string;
  foods: FoodEntry[];
}

const DB_NAME = 'OpenCalDB';
const DB_VERSION = 3;
const STORE_NAME = 'daily_consumption';
const STORE_PRODUCTS = 'products';
const STORE_FAVORITES = 'favorites';
const STORE_MEALS = 'meals';

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
        if (!db.objectStoreNames.contains(STORE_PRODUCTS)) {
          db.createObjectStore(STORE_PRODUCTS, { keyPath: 'code' });
        }
        if (!db.objectStoreNames.contains(STORE_FAVORITES)) {
          db.createObjectStore(STORE_FAVORITES, { keyPath: 'code' });
        }
        if (!db.objectStoreNames.contains(STORE_MEALS)) {
          db.createObjectStore(STORE_MEALS, { keyPath: 'id' });
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

  async cacheProduct(product: any): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_PRODUCTS], 'readwrite');
      const store = transaction.objectStore(STORE_PRODUCTS);
      const request = store.put(product);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedProduct(code: string): Promise<any | undefined> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_PRODUCTS], 'readonly');
      const store = transaction.objectStore(STORE_PRODUCTS);
      const request = store.get(code);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCachedProducts(): Promise<any[]> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_PRODUCTS], 'readonly');
      const store = transaction.objectStore(STORE_PRODUCTS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addFavorite(code: string): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_FAVORITES], 'readwrite');
      const store = transaction.objectStore(STORE_FAVORITES);
      const request = store.put({ code });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async removeFavorite(code: string): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_FAVORITES], 'readwrite');
      const store = transaction.objectStore(STORE_FAVORITES);
      const request = store.delete(code);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async isFavorite(code: string): Promise<boolean> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_FAVORITES], 'readonly');
      const store = transaction.objectStore(STORE_FAVORITES);
      const request = store.get(code);

      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getFavorites(): Promise<any[]> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_FAVORITES], 'readonly');
      const store = transaction.objectStore(STORE_FAVORITES);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveMeal(meal: Meal): Promise<void> {
    await this.ensureInit();

    // First save the meal
    await new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_MEALS], 'readwrite');
      const store = transaction.objectStore(STORE_MEALS);
      const request = store.put(meal);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Then propagate changes to diary logs
    await this._updateMealInLogs(meal);
  }

  private async _updateMealInLogs(meal: Meal): Promise<void> {
    // Calculate new totals for the meal
    const totals = meal.foods.reduce((acc, f) => {
      const ratio = f.quantity / 100;
      return {
        calories: acc.calories + (f.product.nutriments?.['energy-kcal'] || 0) * ratio,
        carbs: acc.carbs + (f.product.nutriments?.carbohydrates || 0) * ratio,
        fat: acc.fat + (f.product.nutriments?.fat || 0) * ratio,
        protein: acc.protein + (f.product.nutriments?.proteins || 0) * ratio
      };
    }, { calories: 0, carbs: 0, fat: 0, protein: 0 });

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          const log = cursor.value as DailyLog;
          let modified = false;
          const categories: MealCategory[] = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3'];

          categories.forEach(cat => {
            log[cat].forEach(item => {
              if (item.unit === 'meal' && item.product.code === meal.id) {
                // Update name and nutrients
                item.product.product_name = meal.name;
                // Ensure nutriments object exists
                if (!item.product.nutriments) {
                  item.product.nutriments = {} as any;
                }
                item.product.nutriments['energy-kcal'] = totals.calories;
                item.product.nutriments.carbohydrates = totals.carbs;
                item.product.nutriments.fat = totals.fat;
                item.product.nutriments.proteins = totals.protein;

                modified = true;
              }
            });
          });

          if (modified) {
            cursor.update(log);
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getMeal(id: string): Promise<Meal | undefined> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_MEALS], 'readonly');
      const store = transaction.objectStore(STORE_MEALS);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllMeals(): Promise<Meal[]> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_MEALS], 'readonly');
      const store = transaction.objectStore(STORE_MEALS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteMeal(id: string): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_MEALS], 'readwrite');
      const store = transaction.objectStore(STORE_MEALS);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async ensureInit(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
  }
}

export const dbService = new DBService();
