/* eslint-disable @typescript-eslint/unbound-method */
import { type CSSResultGroup, css, LitElement } from 'lit';
import { translations } from './translations';
import { dbService, DBService } from './db';

export default class Page<api = {}> extends LitElement {
  /**
   * It will be overrided with api decorator.
   */
  api!: api;

  translations: { [key: string]: string } = translations.en;

  protected db: DBService = dbService;

  constructor() {
    super();
    this.translations = translations[this.getLanguage() as keyof typeof translations] || translations.en;
  }

  static styles = [css`
    .card {
      background: var(--card-background);
      color: var(--card-text);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }
    h2 {
      margin-top: 0;
      border-bottom: 2px solid var(--palette-green, #4fb9ad);
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    input, select {
      width: 100%;
      padding: 0.5rem;
      background-color: var(--input-background);
      color: var(--input-text);
      border: 1px solid var(--input-border, #a19fa2);
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    .theme-toggles {
      display: flex;
      gap: 1rem;
    }
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: var(--palette-green, #a19fa2);
      color: white;
      transition: background 0.3s;
    }
    button.active {
      background: var(--palette-purple, #a285bb);
    }
    button:hover {
      opacity: 0.9;
    }
    ` as CSSResultGroup];

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

  /**
   * Function to get language from local storage.
   * @returns language
   */
  getLanguage(): string {
    const language = localStorage.getItem('language');
    if (language) {
      return language;
    } else {
      localStorage.setItem('language', 'en');
      return 'en';
    }
  }

  /**
   * Function to set language in local storage.
   * @param {string} language language to set
   */
  setLanguage(language: string): void {
    localStorage.setItem('language', language);
    this.translations = translations[language as keyof typeof translations] || translations.en;
    this.requestUpdate();
  }

  /**
   * Function to set theme in local storage.
   * @param {string} theme theme to set
   */
  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  /**
   * Function to apply theme.
   */
  applyTheme() {
    const theme = localStorage.getItem('theme') || 'light';
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
    console.log('%c this.getHref()', 'background: #df03fc; color: #f8fc03', this.getHref());
    const url: URL = new URL(this.getHref());
    return url.searchParams;
  }

  /**
   * Function to set queryparams in current url
   * @param queryParams object with key value pairs
   */
  setQueryParamsURL(queryParams: { [key: string]: string }): void {
    const queryParamsString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    window.history.replaceState(null, null as unknown as string, `?${queryParamsString}`);
  }

  triggerPageNavigation(queryParams: { [key: string]: string }) {
    this.dispatchEvent(new CustomEvent('page-navigation', {
      detail: { ...queryParams },
      bubbles: true,
      composed: true
    }));
  }

  connectedCallback() {
    super.connectedCallback();
    this.onPageInit();
  }

  /**
   * It will be called after the Page component is loaded.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onPageInit(): void { }
}

