import { html, css, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';

export default class PageUser extends Page {
  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        padding: 1rem;
      }
    `
  ];

  @state() height: number = 0;
  @state() weight: number = 0;
  @state() theme: 'light' | 'dark' = 'light';
  @state() language: string = 'en';

  onPageInit(): void {
    const savedHeight = localStorage.getItem('userHs');
    const savedWeight = localStorage.getItem('userWs');

    // Page class handles language via getLanguage(), but we sync here for UI
    this.language = this.getLanguage();
    this.theme = (localStorage.getItem('theme') || 'light') as 'light' | 'dark';

    if (savedHeight) this.height = Number(savedHeight);
    if (savedWeight) this.weight = Number(savedWeight);
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('language')) {
      this.setLanguage(this.language);
    }
  }

  private _handleHeightChange(e: Event) {
    const value = Number((e.target as HTMLInputElement).value);
    this.height = value;
    localStorage.setItem('userHs', String(value));
  }

  private _handleWeightChange(e: Event) {
    const value = Number((e.target as HTMLInputElement).value);
    this.weight = value;
    localStorage.setItem('userWs', String(value));
  }

  private _handleThemeChange(theme: 'light' | 'dark') {
    this.setTheme(theme);
  }

  private _handleLanguageChange(e: Event) {
    this.language = (e.target as HTMLSelectElement).value;
    this.setLanguage(this.language);
  }

  render() {
    return html`
      <div class="card">
        <h2>${this.translations.userStats || 'User Stats'}</h2>
        <div class="form-group">
          <label>${this.translations.height || 'Height'} (cm)</label>
          <input type="number" .value="${this.height}" @input="${this._handleHeightChange}" placeholder="e.g. 175" />
        </div>
        <div class="form-group">
          <label>${this.translations.weight || 'Weight'} (kg)</label>
          <input type="number" .value="${this.weight}" @input="${this._handleWeightChange}" placeholder="e.g. 70" />
        </div>
      </div>

      <div class="card">
        <h2>${this.translations.settings || 'Settings'}</h2>
        <div class="form-group">
          <label>${this.translations.theme || 'Theme'}</label>
          <div class="theme-toggles">
            <button class="${this.theme === 'light' ? 'active' : ''}" @click="${() => this._handleThemeChange('light')}">${this.translations.light || 'Light'}</button>
            <button class="${this.theme === 'dark' ? 'active' : ''}" @click="${() => this._handleThemeChange('dark')}">${this.translations.dark || 'Dark'}</button>
          </div>
        </div>
        <div class="form-group">
          <label>${this.translations.language || 'Language'}</label>
          <select .value="${this.language}" @change="${this._handleLanguageChange}">
            <option value="en" ?selected="${this.language === 'en'}">English</option>
            <option value="es" ?selected="${this.language === 'es'}">Español</option>
            <option value="fr" ?selected="${this.language === 'fr'}">Français</option>
            <option value="de" ?selected="${this.language === 'de'}">Deutsch</option>
            <option value="it" ?selected="${this.language === 'it'}">Italiano</option>
          </select>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-user': PageUser;
  }
}
