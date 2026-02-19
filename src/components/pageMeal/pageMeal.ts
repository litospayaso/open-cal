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
      .add-to-diary-container .input-group {
        width: 100%;
      }
      .add-to-diary-container {
        display: flex;
        flex-direction: row;
        gap: 1rem;
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
        padding-right: 10px;
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
      button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .error-message {
        color: red;
        margin-top: 0.5rem;
        text-align: center;
      }
      .summary-cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin-top: 1rem;
        border-top: 1px solid var(--card-border);
        padding-top: 1rem;
      }
      .summary-card {
        background: var(--card-background);
        border: 1px solid var(--card-border);
        border-radius: 8px;
        padding: 5px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .summary-card.calories {
        border-color: var(--calories-color);
        border-width: var(--counter-border-width);
      }
      .summary-card.carbs {
        border-color: var(--carbs-color);
        border-width: var(--counter-border-width);
      }
      .summary-card.fat {
        border-color: var(--fat-color);
        border-width: var(--counter-border-width);
      }
      .summary-card.protein {
        border-color: var(--protein-color);
        border-width: var(--counter-border-width);
      }
      .summary-card .value {
        font-size: 1.1rem;
        font-weight: bold;
        color: var(--card-text);
      }
      .summary-card .label {
        font-size: 0.7rem;
        color: var(--input-placeholder);
      }
      @media (max-width: 600px) {
        .summary-cards {
          grid-template-columns: 1fr 1fr;
        }
        .add-to-diary-container {
          flex-direction: column;
        }
      }
      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative; 
        border-bottom: 2px solid var(--palette-green, #4fb9ad);
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
      }
      .header-container h1 {
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: 0;
      }
      .menu-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0 10px;
      }
      .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--card-background, #fff);
        border: 1px solid var(--card-border, #ccc);
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 10;
        min-width: 150px;
        display: flex;
        flex-direction: column;
      }
      .dropdown-item {
        padding: 10px;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        color: var(--card-text);
        font-size: 1rem;
      }
      .dropdown-item:hover {
        background-color: var(--input-background);
      }
      .dropdown-item.delete {
        color: var(--palette-red, #f44336);
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
  @state() selectedCategory: 'breakfast' | 'snack1' | 'lunch' | 'snack2' | 'dinner' | 'snack3' = 'lunch';
  @state() selectedDate: string = new Date().toISOString().split('T')[0];
  @state() showMenu: boolean = false;
  @state() showDeleteModal: boolean = false;

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('click', this._handleOutsideClick);
  }

  private _handleOutsideClick = () => {
    this.showMenu = false;
    window.removeEventListener('click', this._handleOutsideClick);
  }

  private _handleDateChange(e: Event) {
    this.selectedDate = (e.target as HTMLInputElement).value;
  }

  async onPageInit(): Promise<void> {
    await this.db.init();
    const params = this.getQueryParamsURL();
    const id = params.get('mealId');

    if (id) {
      if (id === 'new') {
        const newId = this._generateId();
        await this._createNewMeal(newId);
      } else {
        const meal = await this.db.getMeal(id);
        if (meal) {
          this.meal = meal;
          this.isNew = false;
        } else {
          await this._createNewMeal(id);
        }
      }
    } else {
      const newId = this._generateId();
      await this._createNewMeal(newId);
    }
  }

  private async _addToDiary() {
    const date = this.selectedDate;

    // Calculate totals
    const totals = this.meal.foods.reduce((acc, f) => {
      const ratio = f.quantity / 100;
      return {
        calories: acc.calories + (f.product.nutriments?.['energy-kcal'] || 0) * ratio,
        carbs: acc.carbs + (f.product.nutriments?.carbohydrates || 0) * ratio,
        fat: acc.fat + (f.product.nutriments?.fat || 0) * ratio,
        protein: acc.protein + (f.product.nutriments?.proteins || 0) * ratio
      };
    }, { calories: 0, carbs: 0, fat: 0, protein: 0 });

    const mealItem = {
      product: {
        code: this.meal.id,
        product_name: this.meal.name,
        nutriments: {
          'energy-kcal': totals.calories,
          carbohydrates: totals.carbs,
          fat: totals.fat,
          proteins: totals.protein
        } as any,
        nutrition_data: 'per_serving',
        nutrition_data_per: 'serving',
        nutrition_data_prepared_per: 'serving'
      },
      quantity: 1, // 1 serv of the meal
      unit: 'meal'
    };

    try {
      await this.db.addFoodItem(date, this.selectedCategory, mealItem);
      this.triggerPageNavigation({ page: 'home' });
    } catch (e) {
      console.error("Error adding meal to diary", e);
      this.error = "Failed to add to diary";
    }
  }

  private async _removeFood(index: number) {
    const newFoods = [...this.meal.foods];
    newFoods.splice(index, 1);
    this.meal = { ...this.meal, foods: newFoods };
    await this.db.saveMeal(this.meal); // Auto-save removal
  }

  private _generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async _createNewMeal(id: string) {
    this.meal = {
      id: id,
      name: this.translations.newMeal || 'New Meal', // default name
      description: '',
      foods: []
    };
    this.isNew = true;
    try {
      await this.db.saveMeal(this.meal);
    } catch (e) {
      console.error("Error creating new meal", e);
      this.error = "Failed to create new meal";
    }
  }

  // private _initNewDraft() ... _loadDraft ... _saveDraft REMOVED

  private async _handleNameChange(e: Event) {
    this.meal = { ...this.meal, name: (e.target as HTMLInputElement).value };
    await this.db.saveMeal(this.meal);
  }

  private async _handleDescriptionChange(e: Event) {
    this.meal = { ...this.meal, description: (e.target as HTMLInputElement).value };
    await this.db.saveMeal(this.meal);
  }

  private async _handleAddFood() {
    this.meal.id = this.meal.id || this._generateId();
    await this.db.saveMeal(this.meal);
    this.triggerPageNavigation({ page: 'search', mealId: this.meal.id });
  }

  private _toggleMenu(e: Event) {
    e.stopPropagation();
    this.showMenu = !this.showMenu;
    if (this.showMenu) {
      window.addEventListener('click', this._handleOutsideClick);
    } else {
      window.removeEventListener('click', this._handleOutsideClick);
    }
  }

  private async _handleDuplicate() {
    this.showMenu = false;
    const newId = this._generateId();
    const newMeal: Meal = {
      ...this.meal,
      id: newId,
      name: `${this.meal.name} - duplicated`,
    };

    try {
      await this.db.saveMeal(newMeal);
      this.triggerPageNavigation({ page: 'meal', mealId: newId });
      this.onPageInit()
    } catch (e) {
      console.error("Error duplicating meal", e);
      this.error = "Failed to duplicate meal";
    }
  }

  private _handleDelete() {
    this.showMenu = false;
    this.showDeleteModal = true;
  }

  private async _confirmDelete() {
    try {
      if (this.meal.id) {
        await this.db.deleteMeal(this.meal.id);
        await this.db.deleteMealReference(this.meal.id);
        this.triggerPageNavigation({ page: 'home' });
      }
    } catch (e) {
      console.error("Error deleting meal", e);
      this.error = "Failed to delete meal";
    } finally {
      this.showDeleteModal = false;
    }
  }

  render() {
    return html`
      <div class="page-container">
        <div class="header-container">
            <h1>${this.isNew ? this.translations.createNewMeal : this.translations.editProduct}</h1>
            ${!this.isNew ? html`
            <div style="position: relative;">
                <button class="menu-btn" @click="${this._toggleMenu}">&#8942;</button>
                ${this.showMenu ? html`
                <div class="dropdown-menu">
                    <button class="dropdown-item" @click="${this._handleDuplicate}">${this.translations.duplicateMeal}</button>
                    <button class="dropdown-item delete" @click="${this._handleDelete}">${this.translations.deleteMeal}</button>
                </div>
                ` : ''}
            </div>
            ` : ''}
        </div>
        
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

                <div class="summary-cards">
             ${(() => {
        const totals = this.meal.foods.reduce((acc, f) => {
          const ratio = f.quantity / 100;
          return {
            calories: acc.calories + (f.product.nutriments?.['energy-kcal'] || 0) * ratio,
            carbs: acc.carbs + (f.product.nutriments?.carbohydrates || 0) * ratio,
            fat: acc.fat + (f.product.nutriments?.fat || 0) * ratio,
            protein: acc.protein + (f.product.nutriments?.proteins || 0) * ratio
          };
        }, { calories: 0, carbs: 0, fat: 0, protein: 0 });

        return html`
                    <div class="summary-card calories">
                        <span class="value">${totals.calories.toFixed(0)}</span>
                        <span class="label">${this.translations.calories}</span>
                    </div>
                    <div class="summary-card carbs">
                        <span class="value">${totals.carbs.toFixed(0)}g</span>
                        <span class="label">${this.translations.carbs}</span>
                    </div>
                    <div class="summary-card fat">
                        <span class="value">${totals.fat.toFixed(0)}g</span>
                        <span class="label">${this.translations.fat}</span>
                    </div>
                    <div class="summary-card protein">
                        <span class="value">${totals.protein.toFixed(0)}g</span>
                        <span class="label">${this.translations.protein}</span>
                    </div>
                `;
      })()}
        </div>


        <h3>${this.translations.foods}</h3>
        
        <div class="foods-list">
          ${this.meal.foods.length === 0 ? html`
            <div class="empty-foods">${this.translations.noFoodsAdded}</div> 
          ` : this.meal.foods.map((food, index) => {
        const ratio = food.quantity / 100;
        const calories = (food.product.nutriments?.['energy-kcal'] || 0) * ratio;
        return html`
            <div class="food-item-container">
                <div class="food-item-content">
                    <component-search-result 
                    name="${food.product.product_name}" 
                    code="${food.product.code}" 
                    brands="${food.product.brands || ''}"
                    calories="${calories.toFixed(1)}" 
                    quantity="${food.quantity}g"
                    removable="true"
                    @remove-click="${() => this._removeFood(index)}"
                    >
                  </component-search-result>
                </div>
            </div>
          `})}
        </div>

        <div class="buttons-container">
          <button class="btn" @click="${this._handleAddFood}">
            + ${this.translations.addFood}
          </button>
          

          <div class="add-to-diary-container">

              <div class="input-group">
                 <label for="category">${this.translations.category}:</label>
                 <select 
                   id="category" 
                   .value="${this.selectedCategory}" 
                   @change="${(e: Event) => this.selectedCategory = (e.target as HTMLInputElement).value as any}"
                   style="padding: 8px; background: var(--input-background); color: var(--input-text); border: 1px solid var(--input-border, #ccc); border-radius: 4px; width: 100%; box-sizing: border-box;"
                 >
                   <option value="breakfast">${this.translations.breakfast}</option>
                   <option value="snack1">${this.translations.snack1}</option>
                   <option value="lunch">${this.translations.lunch}</option>
                   <option value="snack2">${this.translations.snack2}</option>
                   <option value="dinner">${this.translations.dinner}</option>
                   <option value="snack3">${this.translations.snack3}</option>
                 </select>
              </div>

            <div class="input-group">
                 <label for="date">${this.translations.date}:</label>
                 <input 
                   type="date" 
                   id="date" 
                   .value="${this.selectedDate}" 
                   @change="${this._handleDateChange}"
                 >
            </div>

          </div>


             <button class="btn" @click="${this._addToDiary}">
                 ${this.translations.addToDiary}
             </button>

          ${this.error ? html`<div class="error-message">${this.error}</div>` : ''}
        </div>

        ${this.showDeleteModal ? html`
        <div class="modal-overlay">
          <div class="modal">
            <h3>${this.translations.confirmClearData}</h3>
            <p>${this.translations.deleteMealMessage}</p>
            <div class="modal-buttons">
              <button class="btn" @click="${() => this.showDeleteModal = false}">${this.translations.cancel}</button>
              <button class="btn-danger" @click="${this._confirmDelete}">${this.translations.delete}</button>
            </div>
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'page-meal': PageMeal;
  }
}
