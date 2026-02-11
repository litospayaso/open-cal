/* eslint-disable @typescript-eslint/unbound-method */
import { type CSSResultGroup, css, LitElement } from 'lit';
import { translations } from './translations';

export default class Page<api = {}> extends LitElement {
  /**
   * It will be overrided with api decorator.
   */
  api!: api;

  translations: { [key: string]: string } = translations.en;

  constructor() {
    super();
    this.translations = translations[this.getLanguage() as keyof typeof translations] || translations.en;
  }

  static styles = [css`` as CSSResultGroup];

  /**
   * Function to navigate to another url.
   * If the string starts with / will concat string to the current url.
   * If it starts with http the whole location will be replaced.
   * Other case it will use the same origin to concat the url.
   * @param {string} url location to navigate
   */
  navigate(url: string): void {
    if (url.startsWith('/')) {
      window.location.href = window.location.href.concat(url);
    } else if (url.startsWith('http')) {
      window.location.href = url;
    } else {
      window.location.href = `${window.location.origin}/${url}`;
    }
  }

  getLanguage(): string {
    const language = localStorage.getItem('language');
    if (language) {
      return language;
    } else {
      localStorage.setItem('language', 'en');
      return 'en';
    }
  }

  setLanguage(language: string): void {
    localStorage.setItem('language', language);
    this.translations = translations[language as keyof typeof translations] || translations.en;
    this.requestUpdate();
  }

  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  applyTheme(theme: 'light' | 'dark') {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.background = '#191c25';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.background = 'white';
    }
  }

  /**
   * Function to open a url in a new tab.
   * @param {string} url to open in a new tab
   */
  openNewTab(url: string): void {
    window.open(url, '_blank');
  }

  /**
   * Function to get current url where the webcomponent is located
   * @returns window.location.href
   */
  getHref(): string {
    return window.location.href;
  }

  /**
   * Function to get hostname of current url
   * @returns window.location.hostname
   */
  getHostname(): string {
    return window.location.hostname;
  }

  /**
   * Function to get queryparams from current url
   * @returns url.searchParams: URLSearchParams
   */
  getQueryParamsURL(): URLSearchParams {
    const url: URL = new URL(this.getHref());
    return url.searchParams;
  }

  connectedCallback() {
    super.connectedCallback();
    this.onPageInit();
  }

  protected db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('FoodDB', 1);

      request.onerror = () => {
        console.error('Database error:', request.error);
        reject(request.error);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'code' });
        }
        if (!db.objectStoreNames.contains('favorites')) {
          db.createObjectStore('favorites', { keyPath: 'code' });
        }
      };
    });
  }

  async cacheProduct(product: any): Promise<void> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['products'], 'readwrite');
      const store = transaction.objectStore('products');
      const request = store.put(product);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedProduct(code: string): Promise<any | undefined> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['products'], 'readonly');
      const store = transaction.objectStore('products');
      const request = store.get(code);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addFavorite(code: string): Promise<void> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favorites'], 'readwrite');
      const store = transaction.objectStore('favorites');
      const request = store.put({ code });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async removeFavorite(code: string): Promise<void> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favorites'], 'readwrite');
      const store = transaction.objectStore('favorites');
      const request = store.delete(code);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async isFavorite(code: string): Promise<boolean> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favorites'], 'readonly');
      const store = transaction.objectStore('favorites');
      const request = store.get(code);

      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getFavorites(): Promise<any[]> {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favorites'], 'readonly');
      const store = transaction.objectStore('favorites');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * It will be called after the Page component is loaded.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onPageInit(): void { }
}
