import { html, css, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';

interface UserProfile {
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'non-binary';
  goals: {
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    }
  }
}

export default class PageUser extends Page {
  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        padding: 1rem;
      }
      
      .section-title {
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--app-text-color-primary, #333);
      }

      .macro-inputs {
        display: flex;
        gap: 10px;
      }

      .macro-inputs .form-group {
        flex: 1;
      }

      .theme-toggles {
        display: flex;
        gap: 10px;
      }

      .theme-toggles button {
        flex: 1;
        padding: 8px;
        border: 1px solid #ccc;
        background: transparent;
        cursor: pointer;
        border-radius: 4px;
        color: inherit;
      }

      .theme-toggles button.active {
        background: var(--palette-green, #4caf50);
        color: white;
        border-color: var(--palette-green, #4caf50);
      }

      .input-calories {
        border-color: var(--calories-color) !important;
        border-width: var(--counter-border-width) !important;
      }
      .input-protein {
        border-color: var(--protein-color) !important;
        border-width: var(--counter-border-width) !important;
      }
      .input-carbs {
        border-color: var(--carbs-color) !important;
        border-width: var(--counter-border-width) !important;
      }
      .input-fat {
        border-color: var(--fat-color) !important;
        border-width: var(--counter-border-width) !important;
      }
      .danger-zone {
        border: 1px solid var(--palette-red, #f44336);
        background: rgba(244, 67, 54, 0.1);
      }
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        color: var(--app-text-color-primary, #333);
      }
      .modal {
        background: var(--card-background, #fff);
        color: var(--card-text);
        padding: 20px;
        border-radius: 8px;
        max-width: 90%;
        width: 300px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        text-align: center;
      }
      .modal-buttons {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        justify-content: center;
      }
      .btn-secondary {
        background: #ccc;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
      }
    `
  ];

  @state() height: number = 0;
  @state() weight: number = 0;
  @state() gender: 'male' | 'female' | 'non-binary' = 'male';
  @state() dailyCalories: number = 2000;
  @state() proteinRatio: number = 30;
  @state() carbsRatio: number = 40;
  @state() fatRatio: number = 30;

  @state() theme: 'light' | 'dark' = 'light';
  @state() language: string = 'en';
  @state() showClearModal: boolean = false;

  onPageInit(): void {
    const savedProfile = localStorage.getItem('user_profile');

    // Theme and Language are global app settings, handled separately often, but synced here
    this.language = this.getLanguage();
    this.theme = (localStorage.getItem('theme') || 'light') as 'light' | 'dark';

    if (savedProfile) {
      try {
        const profile: UserProfile = JSON.parse(savedProfile);
        this.height = profile.height || 0;
        this.weight = profile.weight || 0;
        this.gender = profile.gender || 'male';
        this.dailyCalories = profile.goals?.calories || 2000;
        this.proteinRatio = profile.goals?.macros?.protein || 30;
        this.carbsRatio = profile.goals?.macros?.carbs || 40;
        this.fatRatio = profile.goals?.macros?.fat || 30;
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    } else {
      // Migration logic for legacy data
      const legacyHeight = localStorage.getItem('userHs');
      const legacyWeight = localStorage.getItem('userWs');

      if (legacyHeight) this.height = Number(legacyHeight);
      if (legacyWeight) this.weight = Number(legacyWeight);

      // Save immediatly to create the new structure
      this._saveProfile();
    }
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('language')) {
      this.setLanguage(this.language);
    }
  }

  private _saveProfile() {
    const profile: UserProfile = {
      height: this.height,
      weight: this.weight,
      gender: this.gender,
      goals: {
        calories: this.dailyCalories,
        macros: {
          protein: this.proteinRatio,
          carbs: this.carbsRatio,
          fat: this.fatRatio
        }
      }
    };
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }

  private _handleNumberInput(field: 'height' | 'weight' | 'dailyCalories' | 'proteinRatio' | 'carbsRatio' | 'fatRatio', e: Event) {
    const value = Number((e.target as HTMLInputElement).value);
    // @ts-ignore
    this[field] = value;
    this._saveProfile();
  }

  private _handleGenderChange(e: Event) {
    this.gender = (e.target as HTMLSelectElement).value as 'male' | 'female' | 'non-binary';
    this._saveProfile();
  }

  private _handleThemeChange(theme: 'light' | 'dark') {
    this.setTheme(theme);
  }

  private _handleLanguageChange(e: Event) {
    this.language = (e.target as HTMLSelectElement).value;
    this.setLanguage(this.language);
  }

  private async _clearAllData() {
    try {
      localStorage.clear();
      await this.db.clearAllData();
      window.location.reload();
    } catch (e) {
      console.error('Failed to clear data', e);
      alert('Failed to clear data');
    }
  }

  render() {
    return html`
      <div class="card">
        <h2>${this.translations.personalDetails || 'Personal Details'}</h2>
        
        <div class="form-group">
          <label>${this.translations.gender || 'Gender'}</label>
          <select .value="${this.gender}" @change="${this._handleGenderChange}">
            <option value="male" ?selected="${this.gender === 'male'}">${this.translations.male || 'Male'}</option>
            <option value="female" ?selected="${this.gender === 'female'}">${this.translations.female || 'Female'}</option>
            <option value="non-binary" ?selected="${this.gender === 'non-binary'}">${this.translations.nonBinary || 'Non-binary'}</option>
          </select>
        </div>

        <div class="form-group">
          <label>${this.translations.height || 'Height'} (cm)</label>
          <input type="number" .value="${this.height}" @input="${(e: Event) => this._handleNumberInput('height', e)}" placeholder="e.g. 175" />
        </div>
        <div class="form-group">
          <label>${this.translations.weight || 'Weight'} (kg)</label>
          <input type="number" step="0.1" .value="${this.weight}" @input="${(e: Event) => this._handleNumberInput('weight', e)}" placeholder="e.g. 70.5" />
        </div>
      </div>

      <div class="card">
        <h2>${this.translations.nutritionalGoals || 'Nutritional Goals'}</h2>
        
        <div class="form-group">
          <label>${this.translations.dailyCalories || 'Daily Calories'}</label>
          <input class="input-calories" type="number" .value="${this.dailyCalories}" @input="${(e: Event) => this._handleNumberInput('dailyCalories', e)}" placeholder="e.g. 2000" />
        </div>

        <label>${this.translations.macroRatio || 'Macronutrient Ratio'} (%)</label>
        <div class="macro-inputs">
          <div class="form-group">
            <label>${this.translations.protein || 'Protein'}</label>
            <input class="input-protein" type="number" .value="${this.proteinRatio}" @input="${(e: Event) => this._handleNumberInput('proteinRatio', e)}" />
          </div>
          <div class="form-group">
            <label>${this.translations.carbs || 'Carbs'}</label>
            <input class="input-carbs" type="number" .value="${this.carbsRatio}" @input="${(e: Event) => this._handleNumberInput('carbsRatio', e)}" />
          </div>
          <div class="form-group">
            <label>${this.translations.fat || 'Fat'}</label>
            <input class="input-fat" type="number" .value="${this.fatRatio}" @input="${(e: Event) => this._handleNumberInput('fatRatio', e)}" />
          </div>
        </div>
        <div style="font-size: 0.8rem; color: #666; margin-top: 5px; text-align: right;">
          Total: ${this.proteinRatio + this.carbsRatio + this.fatRatio}%
        </div>
      </div>

      <div class="card">
        <h2>${this.translations.settings || 'Settings'}</h2>
        <div class="form-group">
          <label>${this.translations.theme || 'Theme'}</label>
          <div class="theme-toggles">
            <button class="btn" style="color: white; background-color:var(--palette-green)" @click="${() => this._handleThemeChange('light')}">${this.translations.light || 'Light'}</button>
            <button class="btn" style="color: white; background-color:var(--palette-purple)" @click="${() => this._handleThemeChange('dark')}">${this.translations.dark || 'Dark'}</button>
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

      <div class="card danger-zone">
        <h2>${this.translations.dangerZone || 'Danger Zone'}</h2>
        <p style="margin-bottom: 10px;">${this.translations.clearDataWarning || 'Clear all your data permanently. This cannot be undone.'}</p>
        <button class="btn-danger" @click="${() => this.showClearModal = true}">
          ${this.translations.clearAllData || 'Clear All Data'}
        </button>
      </div>

      ${this.showClearModal ? html`
        <div class="modal-overlay">
          <div class="modal">
            <h3>${this.translations.confirmClearData || 'Are you sure?'}</h3>
            <p>${this.translations.confirmClearDataDesc || 'This will delete all your logs, meals, and settings permanently.'}</p>
            <div class="modal-buttons">
              <button class="btn" @click="${() => this.showClearModal = false}">${this.translations.cancel || 'Cancel'}</button>
              <button class="btn-danger" @click="${this._clearAllData}">${this.translations.confirm || 'Confirm'}</button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-user': PageUser;
  }
}
