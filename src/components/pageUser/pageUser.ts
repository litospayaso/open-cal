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

      @media (max-width: 600px) {
        .macro-inputs {
          flex-direction: column;
        }
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
      .weight-history-list {
        max-height: 250px;
        overflow-y: auto;
        margin-bottom: 1rem;
        text-align: left;
      }
      .weight-history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0 8px 8px;
        border: 1px solid var(--card-border);
        border-radius: 8px;
        margin-bottom: 8px;
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      .modal-header h3 {
        margin: 0;
      }
      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--card-text);
        padding: 0;
        line-height: 1;
        width: auto;
      }
      .weight-history-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 2px solid var(--palette-green);
      }
      .chart-wrapper {
        height: 200px;
        margin: 15px 0;
      }
      .favorite-icon {
        width: 24px;
        height: 24px;
        fill: none;
        stroke: var(--fat-color);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: fill 0.3s ease, stroke 0.3s ease;
        padding: 5px;
        border-radius: 4px;
        cursor: pointer;
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
  @state() showWeightModal: boolean = false;
  @state() weightHistory: { date: string, weight: number }[] = [];
  @state() newWeightDate: string = new Date().toISOString().split('T')[0];
  @state() newWeightValue: number = 0;

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

    this._loadWeightHistory();
  }

  private async _loadWeightHistory() {
    this.weightHistory = await this.db.getWeightHistory();
    if (this.weight) {
      this.newWeightValue = this.weight;
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

  private async _handleNumberInput(field: 'height' | 'weight' | 'dailyCalories' | 'proteinRatio' | 'carbsRatio' | 'fatRatio', e: Event) {
    const value = Number((e.target as HTMLInputElement).value);
    // @ts-ignore
    this[field] = value;
    this._saveProfile();

    if (field === 'weight') {
      const today = new Date().toISOString().split('T')[0];
      await this.db.saveWeightEntry(today, value);
      await this._loadWeightHistory();
    }
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

  private async _deleteWeightEntry(date: string) {
    await this.db.deleteWeightEntry(date);
    await this._loadWeightHistory();
  }

  private async _saveNewWeightEntry() {
    if (this.newWeightDate && this.newWeightValue > 0) {
      await this.db.saveWeightEntry(this.newWeightDate, this.newWeightValue);
      await this._loadWeightHistory();

      // If we saved for today, update the current weight
      const today = new Date().toISOString().split('T')[0];
      if (this.newWeightDate === today) {
        this.weight = this.newWeightValue;
        this._saveProfile();
      }
    }
  }

  private _formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  private _renderTrashIcon(entry: { date: string, weight: number }) {
    return html`
      <svg
        class="favorite-icon"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        @click="${() => this._deleteWeightEntry(entry.date)}"
      >
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    `;
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

        <div class="chart-wrapper">
          <component-line-chart .data="${this.weightHistory.map(h => ({ tag: h.date, value: h.weight }))}"></component-line-chart>
        </div>

        <button class="btn" @click="${() => this.showWeightModal = true}">
          ${this.translations.updateHistoricalWeight || 'Update historical user weight data'}
        </button>
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

      ${this.showWeightModal ? html`
        <div class="modal-overlay">
          <div class="modal" style="width: 400px; max-width: 95%;">
            <div class="modal-header">
              <h3>${this.translations.weightHistory || 'Weight History'}</h3>
              <button class="close-btn" @click="${() => this.showWeightModal = false}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div class="weight-history-list">
              ${this.weightHistory.length === 0 ? html`<p style="text-align: center;">${this.translations.noResultsFound || 'No history found'}</p>` : ''}
              ${this.weightHistory.map(entry => html`
                <div class="weight-history-item">
                  <span>${this._formatDate(entry.date)}</span>
                  <div style="display: flex; align-items: center; gap: 12px; padding-right: 8px;">
                    <strong>${entry.weight} kg</strong>
                    ${this._renderTrashIcon(entry)}
                  </div>
                </div>
              `)}
            </div>

            <div class="weight-history-form">
              <div class="form-group" style="text-align: left;">
                <label>${this.translations.date || 'Date'}</label>
                <input type="date" .value="${this.newWeightDate}" @change="${(e: any) => this.newWeightDate = e.target.value}" />
              </div>
              <div class="form-group" style="text-align: left;">
                <label>${this.translations.weight || 'Weight'} (kg)</label>
                <input type="number" step="0.1" .value="${this.newWeightValue}" @input="${(e: any) => this.newWeightValue = Number(e.target.value)}" />
              </div>
              <button class="btn" @click="${this._saveNewWeightEntry}">
                ${this.translations.saveEntry || 'Save Entry'}
              </button>
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
