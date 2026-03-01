import { html, css, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import type { MealCategory } from '../../shared/db';

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
      .file-input-wrapper {
        position: relative;
        display: inline-block;
        margin-top: 10px;
        width: 100%;
      }
      .file-input-wrapper input[type="file"] {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
      .import-msg {
        margin-top: 8px;
        font-size: 0.9rem;
      }
      .import-msg.success { color: var(--palette-green, #4caf50); }
      .import-msg.error { color: var(--palette-red, #f44336); }
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
  @state() showExportModal: boolean = false;
  @state() exportFormat: 'json' | 'csv' = 'json';
  @state() exportStores: Set<string> = new Set(['daily_consumption', 'user_data', 'meals', 'products', 'favorites']);
  @state() showImportModal: boolean = false;
  @state() importData: any = null;
  @state() importOverride: boolean = false;
  @state() importMessage: { text: string, type: 'success' | 'error' } | null = null;

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

  private async _handleExport() {
    const { content, extension } = await this.db.getExportData(Array.from(this.exportStores), this.exportFormat);

    // Filename: BroteData_YYYY-mm-dd_hh-mm-ss.[json|csv]
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `BroteData_${dateStr}_${timeStr}.${extension}`;

    const blob = new Blob([content], { type: extension === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    this.showExportModal = false;
  }

  private _toggleExportStore(store: string) {
    const newStores = new Set(this.exportStores);
    if (newStores.has(store)) {
      newStores.delete(store);
    } else {
      newStores.add(store);
    }
    this.exportStores = newStores;
  }

  private _handleFileSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase();

      try {
        if (extension === 'json') {
          this.importData = JSON.parse(content);
        } else if (extension === 'csv') {
          this.importData = this._parseCSV(content);
        } else {
          throw new Error('Unsupported file format');
        }

        this.showImportModal = true;
        this.importMessage = null;
      } catch (err) {
        console.error('Import error:', err);
        this.importMessage = { text: this.translations.fileCannotBeParsed || 'File can not be parsed', type: 'error' };
        this.importData = null;
      }
      // Reset input
      (e.target as HTMLInputElement).value = '';
    };
    reader.readAsText(file);
  }

  private _parseCSV(content: string): any {
    const data: any = {};
    const lines = content.split('\n');
    let currentStore = '';
    let headers: string[] = [];

    lines.forEach(line => {
      line = line.trim();
      if (!line) return;

      if (line.startsWith('--- ')) {
        const storeName = line.replace(/---/g, '').trim().toLowerCase().replace(/ /g, '_');
        currentStore = storeName === 'saved_meals' ? 'meals' : storeName;
        headers = [];
      } else if (currentStore) {
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        if (headers.length === 0) {
          headers = parts;
        } else {
          const row: any = {};
          headers.forEach((h, i) => {
            row[h] = parts[i];
          });

          // Reconstruct nested structures if necessary
          if (currentStore === 'daily_consumption') {
            if (!data.daily_consumption) data.daily_consumption = [];
            let log = data.daily_consumption.find((l: any) => l.date === row.Date);
            if (!log) {
              log = { date: row.Date, breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [], snack3: [] };
              data.daily_consumption.push(log);
            }
            const cat = row.Category as MealCategory;
            log[cat].push({
              product: {
                product_name: row.ProductName,
                nutriments: {
                  'energy-kcal': Number(row.Calories),
                  carbohydrates: Number(row.Carbs),
                  fat: Number(row.Fat),
                  proteins: Number(row.Protein)
                }
              },
              quantity: Number(row.Quantity),
              unit: row.Unit
            });
          } else if (currentStore === 'weight_history') {
            if (!data.weight_history) data.weight_history = [];
            data.weight_history.push({ date: row.Date, weight: Number(row.Weight) });
          } else if (currentStore === 'user_profile') {
            data.user_profile = {
              height: Number(row.Height),
              weight: Number(row.Weight),
              gender: row.Gender,
              goals: {
                calories: Number(row.DailyCalories),
                macros: {
                  protein: Number(row.ProteinRatio || 30),
                  carbs: Number(row.CarbsRatio || 40),
                  fat: Number(row.FatRatio || 30)
                }
              }
            };
          } else if (currentStore === 'meals') {
            if (!data.meals) data.meals = [];
            let meal = data.meals.find((m: any) => m.id === row.MealID);
            if (!meal) {
              meal = { id: row.MealID, name: row.MealName, foods: [] };
              data.meals.push(meal);
            }
            meal.foods.push({
              product: { product_name: row.FoodName },
              quantity: Number(row.Quantity),
              unit: row.Unit
            });
          } else if (currentStore === 'favorites') {
            if (!data.favorites) data.favorites = [];
            data.favorites.push({ code: row.ProductCode });
          }
        }
      }
    });

    return data;
  }

  private async _proceedImport() {
    if (!this.importData) return;

    try {
      const count = await this.db.importData(this.importData, this.importOverride);
      this.importMessage = {
        text: `${this.translations.dataImportedCorrecty || 'Data imported correctly.'}\n Imported ${count} new values.`,
        type: 'success'
      };
      this.showImportModal = false;
      this.importData = null;
      // Refresh local state if profile was updated
      this.onPageInit();
    } catch (err) {
      console.error('Final import error:', err);
      this.importMessage = { text: 'Error importing data', type: 'error' };
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

      <div class="card">
        <h2>${this.translations.dataManagement || 'Data Management'}</h2>
        <p style="margin-bottom: 10px;">${this.translations.exportDataDesc || 'Backup your logs, account settings and weight history.'}</p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn" @click="${() => this.showExportModal = true}">
            ${this.translations.exportData || 'Export Data'}
          </button>
          
          <div class="file-input-wrapper">
            <button class="btn">${this.translations.importData || 'Import Data'}</button>
            <input type="file" accept=".json,.csv" @change="${this._handleFileSelect}" />
          </div>
        </div>

        ${this.importMessage ? html`
          <div class="import-msg ${this.importMessage.type}">
            ${this.importMessage.text.split('\n').map(line => html`<div>${line}</div>`)}
          </div>
        ` : ''}
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

      ${this.showExportModal ? html`
        <div class="modal-overlay">
          <div class="modal" style="width: 400px; max-width: 95%;">
            <div class="modal-header">
              <h3>${this.translations.exportData || 'Export Data'}</h3>
              <button class="close-btn" @click="${() => this.showExportModal = false}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <div style="text-align: left; margin-bottom: 20px;">
              <p style="font-weight: bold; margin-bottom: 10px;">${this.translations.selectDataToExport || 'Select data to export'}:</p>
              
              <label style="display: block; margin-bottom: 8px; cursor: pointer;">
                <input type="checkbox" ?checked="${this.exportStores.has('daily_consumption')}" @change="${() => this._toggleExportStore('daily_consumption')}">
                ${this.translations.dailyConsumption || 'Daily Consumption'}
              </label>
              
              <label style="display: block; margin-bottom: 8px; cursor: pointer;">
                <input type="checkbox" ?checked="${this.exportStores.has('user_data')}" @change="${() => this._toggleExportStore('user_data')}">
                ${this.translations.userData || 'User Profile & Weight History'}
              </label>

              <label style="display: block; margin-bottom: 8px; cursor: pointer;">
                <input type="checkbox" ?checked="${this.exportStores.has('meals')}" @change="${() => this._toggleExportStore('meals')}">
                ${this.translations.savedMeals || 'Saved Meals'}
              </label>

              <label style="display: block; margin-bottom: 8px; cursor: pointer;">
                <input type="checkbox" ?checked="${this.exportStores.has('products')}" @change="${() => this._toggleExportStore('products')}">
                ${this.translations.cachedProducts || 'Cached Products'}
              </label>

              <label style="display: block; margin-bottom: 8px; cursor: pointer;">
                <input type="checkbox" ?checked="${this.exportStores.has('favorites')}" @change="${() => this._toggleExportStore('favorites')}">
                ${this.translations.favorites || 'Favorites'}
              </label>

              <p style="font-weight: bold; margin: 20px 0 10px;">${this.translations.selectFormat || 'Select format'}:</p>
              
              <div style="display: flex; gap: 20px;">
                <label style="cursor: pointer;">
                  <input type="radio" name="format" value="json" ?checked="${this.exportFormat === 'json'}" @change="${() => this.exportFormat = 'json'}">
                  JSON
                </label>
                <label style="cursor: pointer;">
                  <input type="radio" name="format" value="csv" ?checked="${this.exportFormat === 'csv'}" @change="${() => this.exportFormat = 'csv'}">
                  CSV
                </label>
              </div>
            </div>

            <button class="btn" style="width: 100%;" ?disabled="${this.exportStores.size === 0}" @click="${this._handleExport}">
              ${this.translations.exportConfirm || 'Export Now'}
            </button>
          </div>
        </div>
      ` : ''}

      ${this.showImportModal ? html`
        <div class="modal-overlay">
          <div class="modal" style="width: 400px; max-width: 95%;">
            <h3>${this.translations.confirmImport || 'Confirm Import'}</h3>
            <p>${this.translations.confirmOverrideMsg || 'Do you want to override the current app data?'}</p>
            
            <label style="display: flex; align-items: center; justify-content: center; gap: 10px; margin: 20px 0; cursor: pointer;">
              <input type="checkbox" .checked="${this.importOverride}" @change="${(e: any) => this.importOverride = e.target.checked}">
              ${this.translations.overrideCurrentData || 'Override current data'}
            </label>

            <div class="modal-buttons">
              <button class="btn" @click="${() => this.showImportModal = false}">${this.translations.cancel || 'Cancel'}</button>
              <button class="btn" @click="${this._proceedImport}">${this.translations.import || 'Import'}</button>
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
