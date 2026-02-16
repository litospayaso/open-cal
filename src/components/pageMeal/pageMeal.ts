import { css, html } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import type { Meal } from '../../shared/db';

export default class PageMeal extends Page {
  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        padding: 20px;
        font-family: sans-serif;
      }
      .page-container {
        max-width: 600px;
        margin: 0 auto;
      }
      .input-group {
        margin-bottom: 1rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
      }
      input, textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--input-border, #ccc);
        border-radius: 4px;
        box-sizing: border-box;
        font-family: inherit;
      }
      .foods-list {
        margin-top: 1rem;
        background: var(--card-background);
      }
      .food-item-container {
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--card-border);
        padding-right: 10px;
      }
      .food-item-container:last-child {
        border-bottom: none;
      }
      .food-item-content {
        flex: 1;
      }
      .delete-food-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        color: #ff4d4d;
        padding: 5px;
      }
      .empty-foods {
        padding: 1rem;
        text-align: center;
        color: var(--text-color-secondary);
      }
      .buttons-container {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      button.primary {
        background-color: var(--palette-green);
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
      }
      button.secondary {
        background-color: var(--palette-purple);
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
      }
      button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .error-message {
        color: red;
        margin-top: 0.5rem;
        text-align: center;
      }
    `
  ];

  @state() meal: Meal = {
    id: '',
    name: '',
    description: '',
    foods: []
  };
  @state() isNew: boolean = true;
  @state() error: string = '';
  @state() loading: boolean = false;

  async onPageInit(): Promise<void> {
    await this.db.init();
    const params = this.getQueryParamsURL();
    const id = params.get('id');

    if (id && id !== 'new') {
      const meal = await this.db.getMeal(id);
      if (meal) {
        this.meal = meal;
        this.isNew = false;
        // Also update draft to match current db state for editing
        localStorage.setItem('current_draft_meal', JSON.stringify(meal));
      } else {
        // Fallback or error? Check draft if ID matches
        this._loadDraft(id);
      }
    } else {
      this.isNew = true;
      // Check for existing draft or create new
      const draft = localStorage.getItem('current_draft_meal');
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          // If we want to support multiple drafts we might need logic here, but for now single draft
          this.meal = parsed;
        } catch (e) {
          this._initNewDraft();
        }
      } else {
        this._initNewDraft();
      }
    }
  }

  private _generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private _initNewDraft() {
    this.meal = {
      id: this._generateId(),
      name: '',
      description: '',
      foods: []
    };
    this._saveDraft();
  }

  private _loadDraft(id: string) {
    const draft = localStorage.getItem('current_draft_meal');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.id === id) {
          this.meal = parsed;
          return;
        }
      } catch (e) {
        console.error("Error parsing draft", e);
      }
    }
    // If no draft matches, init new one or show error
    this.error = "Meal not found";
  }

  private _saveDraft() {
    localStorage.setItem('current_draft_meal', JSON.stringify(this.meal));
  }

  private _handleNameChange(e: Event) {
    this.meal = { ...this.meal, name: (e.target as HTMLInputElement).value };
    this._saveDraft();
  }

  private _handleDescriptionChange(e: Event) {
    this.meal = { ...this.meal, description: (e.target as HTMLInputElement).value };
    this._saveDraft();
  }

  private _handleAddFood() {
    this._saveDraft(); // ensure latest state saved
    this.triggerPageNavigation({ page: 'search', mealId: this.meal.id });
  }

  private async _handleSave() {
    this.error = '';
    if (!this.meal.name.trim()) {
      this.error = this.translations.errorName;
      return;
    }
    if (this.meal.foods.length < 2) {
      this.error = this.translations.errorMinFoods;
      return;
    }

    try {
      await this.db.saveMeal(this.meal);
      localStorage.removeItem('current_draft_meal'); // Clear draft on save

      // Navigate to meals list? or stay? For now navigate to meals list
      // We don't have a direct "meals list" page separate from search yet
      this.triggerPageNavigation({ page: 'search', viewMode: 'meals' }); // Default to meals tab
    } catch (e) {
      console.error("Error saving meal", e);
      this.error = "Failed to save meal";
    }
  }

  private async _addToDiary() {
    // Add all items to today's diary? Or selected date? 
    // Usually "Add to Diary" implies adding to today/selected date context.
    // For now let's assume valid today's date or similar default
    const date = new Date().toISOString().split('T')[0];
    const category = 'lunch'; // default or ask? 
    // Requirement says: "The meal can be added to the dairy" using db methods.

    // We iterate
    try {
      for (const food of this.meal.foods) {
        await this.db.addFoodItem(date, category, food);
      }
      this.triggerPageNavigation({ page: 'home' });
    } catch (e) {
      console.error("Error adding meal to diary", e);
      this.error = "Failed to add to diary";
    }
  }

  // Handling removal of food item from the list
  private _removeFood(index: number) {
    const newFoods = [...this.meal.foods];
    newFoods.splice(index, 1);
    this.meal = { ...this.meal, foods: newFoods };
    this._saveDraft();
  }

  render() {
    return html`
      <div class="page-container">
        <h1>${this.isNew ? this.translations.createNewMeal : this.translations.editProduct}</h1>
        
        <div class="input-group">
          <label>${this.translations.mealName}</label>
          <input 
            type="text" 
            .value="${this.meal.name}" 
            placeholder="${this.translations.enterMealName}" 
            @input="${this._handleNameChange}"
          >
        </div>

        <div class="input-group">
          <label>${this.translations.mealDescription}</label>
          <textarea 
            .value="${this.meal.description}" 
            placeholder="${this.translations.enterMealDescription}"
            @input="${this._handleDescriptionChange}"
          ></textarea>
        </div>

        <h3>${this.translations.addFood}</h3>
        
        <div class="foods-list">
          ${this.meal.foods.length === 0 ? html`
            <div class="empty-foods">${this.translations.noFoodsAdded}</div> 
          ` : this.meal.foods.map((food, index) => html`
            <div class="food-item-container">
                <div class="food-item-content">
                    <component-search-result 
                    name="${food.product.product_name}" 
                    code="${food.product.code}" 
                    calories="${food.product.nutriments?.['energy-kcal'] || 0}" 
                    removable="true"
                    @remove-click="${() => this._removeFood(index)}"
                    >
                  </component-search-result>
                </div>
            </div>
          `)}
        </div>

        <div class="buttons-container">
          <button class="secondary" @click="${this._handleAddFood}">
            + ${this.translations.addFood}
          </button>
          
          <button class="primary" @click="${this._handleSave}" ?disabled="${false}">
             ${this.translations.saveMeal}
          </button>

          ${!this.isNew ? html`
             <button class="secondary" @click="${this._addToDiary}">
                 Add to Diary
             </button>
          ` : ''}

          ${this.error ? html`<div class="error-message">${this.error}</div>` : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-meal': PageMeal;
  }
}
