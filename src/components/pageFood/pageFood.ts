import { css, html } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import { getProduct } from '../../shared/httpEndpoints';
import { api } from '../../shared/api.decorator';

import type { ProductInterface } from '../../shared/http.interfaces';
import type { MealCategory } from '../../shared/db';

@api({ getProduct })
export default class PageFood extends Page<{ getProduct: typeof getProduct }> {
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
      .loading-container {
        display: flex;
        justify-content: center;
        padding: 2rem;
      }
      .emoji-container {
        border: 1px solid var(--card-border);
        background: var(--card-background, #fff);
        padding: 20px 10px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .product-header {
        text-align: center;
        margin-bottom: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      .product-name {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 20px;
      }
      .favorite-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .favorite-icon {
        width: 32px;
        height: 32px;
        fill: none;
        stroke: var(--palette-grey, #666);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: fill 0.3s ease, stroke 0.3s ease;
      }
      .favorite-icon.is-favorite {
        fill: #ffd700;
        stroke: #ffd700;
      }
      .calculator {
        background: var(--section-background);
        padding: 1.5rem;
        border-radius: 8px;
        margin-top: 1rem;
        margin-top: 1rem;
        position: relative;
      }
      .input-group {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      input {
        padding: 8px;
        background: var(--input-background);
        color: var(--input-text);
        border: 1px solid var(--input-border, #ccc);
        border-radius: 4px;
        width: 100px;
      }
      .nutrients-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .nutrient-item {
        background: var(--card-background);
        padding: 1rem;
        border-radius: 4px;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        border: 1px solid var(--card-border);
      }
      .nutrient-item.calories {
        border-color: var(--calories-color);
        border-width: var(--counter-border-width);
      }
      .nutrient-item.carbs {
        border-color: var(--carbs-color);
        border-width: var(--counter-border-width);
      }
      .nutrient-item.fat {
        border-color: var(--fat-color);
        border-width: var(--counter-border-width);
      }
      .nutrient-item.protein {
        border-color: var(--protein-color);
        border-width: var(--counter-border-width);
      }
      .nutrient-value {
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--card-text, #333);
      }
      .nutrient-label {
        color: var(--input-placeholder, #666);
        font-size: 0.875rem;
      }
      .error-message {
        color: red;
        text-align: center;
      }
      .add-to-diary-button {
        margin-top: 20px;
        width: 100%;
        padding: 12px;
        border: none;
        background-color: var(--group-button-active-bg, var(--palette-green));
        color: var(--group-button-active-text, #fff);
        padding: 10px 20px;
        border-radius: 20px;
        font-weight: bold;
        cursor: pointer;
        font-size: 1rem;
      }
      .save-edit-button {
        background-color: var(--palette-purple, #a285bb);
      }
      .edit-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        padding: 0 10px;
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10;
      }
      .calculator-top {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 20px;
      }

      .chart-section {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .inputs-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 1;
        margin-top: 30px;
      }

      @media (min-width: 600px) {
        .calculator-top {
          flex-direction: row;
          align-items: center;
        }
        .chart-section {
          order: 2;
          flex: 1;
        }
        .inputs-section {
          order: 1;
          margin-top: 0;
        }
      }
    `,
  ];

  @state() product: ProductInterface | null = null;
  @state() editedProduct: ProductInterface | null = null;
  @state() isEditing: boolean = false;
  @state() loading: boolean = false;
  @state() error: string = '';
  @state() grams: number = 100;
  @state() isFavoriteState: boolean = false;
  @state() selectedDate: string = new Date().toISOString().split('T')[0];
  @state() selectedCategory: MealCategory = 'breakfast';
  @state() mealId: string | null = null;

  async onPageInit(): Promise<void> {
    const params = this.getQueryParamsURL();
    const code = params.get('code');
    this.mealId = params.get('mealId');

    if (code) {
      this.loading = true;
      try {
        await this.db.init();
        this.isFavoriteState = await this.db.isFavorite(code);

        const cached = await this.db.getCachedProduct(code);
        if (cached) {
          this.product = cached;
          this.loading = false;
        } else {
          const response = await this.api.getProduct(code);
          if (response && response.product) {
            this.product = response;
            await this.db.cacheProduct(response);
          } else {
            this.error = 'Product not found';
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        this.error = 'Failed to load product data';
      } finally {
        this.loading = false;
      }
    } else {
      this.error = 'No product code provided';
    }
  }

  private async _toggleFavorite() {
    if (!this.product) return;
    const code = this.product.code;
    if (this.isFavoriteState) {
      await this.db.removeFavorite(code);
      this.isFavoriteState = false;
    } else {
      await this.db.addFavorite(code);
      this.isFavoriteState = true;
    }
  }

  private _handleGramsChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const val = Number(input.value);
    if (val >= 0) {
      this.grams = val;
    }
  }

  private _calculateNutrient(value100g: number | undefined): string {
    if (value100g === undefined || value100g === null) return '-';
    return ((value100g * this.grams) / 100).toFixed(1);
  }

  private _toggleEditMode() {
    if (this.isEditing) {
      this.isEditing = false;
      this.editedProduct = null;
    } else {
      if (this.product) {
        this.editedProduct = JSON.parse(JSON.stringify(this.product));
        this.isEditing = true;
      }
    }
  }

  private _handleNutrientChange(e: Event, key: string) {
    if (!this.editedProduct || !this.editedProduct.product) return;
    const input = e.target as HTMLInputElement;
    const val = Number(input.value);

    if (!this.editedProduct.product.nutriments) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.editedProduct.product.nutriments = {} as any;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.editedProduct.product.nutriments as any)[key] = val;
    this.requestUpdate();
  }

  private async _saveEdit() {
    if (this.editedProduct) {
      this.product = this.editedProduct;
      await this.db.cacheProduct(this.product);
      this.isEditing = false;
      this.editedProduct = null;
    }
  }

  private async _addToDiary() {
    if (!this.product) return;

    try {
      const foodItem = {
        product: {
          code: this.product.code,
          nutriments: {
            "energy-kcal": this.product.product?.nutriments?.["energy-kcal_100g"] || 0,
            carbohydrates: this.product.product?.nutriments?.carbohydrates_100g || 0,
            fat: this.product.product?.nutriments?.fat_100g || 0,
            proteins: this.product.product?.nutriments?.proteins_100g || 0,
            // Add other required fields if necessary, or cast.
            // For now mapping what we use in PageHome/ComponentSearchResult
          } as any,
          product_name: (this.product.product as any).product_name,
          nutrition_data: 'per_100g', // assumption
          nutrition_data_per: '100g',
          nutrition_data_prepared_per: '100g'
        },
        quantity: this.grams,
        unit: 'g'
      };

      await this.db.addFoodItem(this.selectedDate, this.selectedCategory, foodItem);

      this.triggerPageNavigation({ page: 'home' });

    } catch (e) {
      console.error("Error adding to diary", e);
      this.error = "Failed to add to diary";
    }
  }

  private async _addToMeal() {
    if (!this.product || !this.mealId) return;

    try {
      const draft = localStorage.getItem('current_draft_meal');
      if (draft) {
        const meal = JSON.parse(draft);
        // Verify ID matches? 
        if (meal.id !== this.mealId) {
          console.warn("Meal ID mismatch", meal.id, this.mealId);
          // Fallback: Use the storage one if it looks like what we expect, or just error?
          // Ideally we trust the user flow. If they navigated here from a meal, localstorage should match.
        }

        const foodItem = {
          product: {
            code: this.product.code,
            nutriments: {
              "energy-kcal": this.product.product?.nutriments?.["energy-kcal_100g"] || 0,
              carbohydrates: this.product.product?.nutriments?.carbohydrates_100g || 0,
              fat: this.product.product?.nutriments?.fat_100g || 0,
              proteins: this.product.product?.nutriments?.proteins_100g || 0,
            } as any,
            product_name: (this.product.product as any).product_name,
          },
          quantity: this.grams,
          unit: 'g'
        };

        meal.foods.push(foodItem);
        localStorage.setItem('current_draft_meal', JSON.stringify(meal));
        this.triggerPageNavigation({ page: 'meal', id: this.mealId });
      } else {
        this.error = "Draft meal not found";
      }
    } catch (e) {
      console.error("Error adding to meal", e);
      this.error = "Failed to add to meal";
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="page-container">
          <div class="loading-container">
            <component-spinner></component-spinner>
          </div>
        </div>
      `;
    }

    if (this.error) {
      return html`
            <div class="page-container">
                <div class="error-message">${this.error}</div>
            </div>
        `;
    }

    if (!this.product) {
      return html``;
    }

    return html`
      <div class="page-container">
        <div class="product-header">
          <div class="emoji-container">
            <component-emoji text="${(this.product.product as any).product_name || 'Unknown Product'}" size="l"></component-emoji>
          </div>
          <div class="product-name">
            <h1>${(this.product.product as any).product_name || 'Unknown Product'}</h1>
            <button 
              @click="${this._toggleFavorite}" 
              class="favorite-btn"
              aria-label="${this.isFavoriteState ? 'Remove from favorites' : 'Add to favorites'}"
            >
              <svg
                class="favorite-icon ${this.isFavoriteState ? 'is-favorite' : ''}"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="calculator">
          <button class="edit-btn" @click="${this._toggleEditMode}">
            ${this.isEditing ? '❌' : '✏️'}
          </button>
            <div class="calculator-top">
              <div class="inputs-section">
                <div class="input-group">
                    <label for="grams">Quantity (grams):</label>
                    <input 
                        id="grams" 
                        type="number" 
                        .value="${this.grams.toString()}" 
                        @input="${this._handleGramsChange}"
                        min="0"
                    />
                </div>
                
                <div class="input-group">
                  <label for="date">Date:</label>
                  <input 
                    id="date" 
                    type="date" 
                    .value="${this.selectedDate}" 
                    @change="${(e: Event) => this.selectedDate = (e.target as HTMLInputElement).value}"
                  />
                </div>

                <div class="input-group">
                  <label for="category">Category:</label>
                  <select 
                    id="category" 
                    .value="${this.selectedCategory}" 
                    @change="${(e: Event) => this.selectedCategory = (e.target as HTMLInputElement).value as MealCategory}"
                    style="padding: 8px; background: var(--input-background); color: var(--input-text); border: 1px solid var(--input-border, #ccc); border-radius: 4px; width: 100%; box-sizing: border-box;"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="snack1">Snack (Morning)</option>
                    <option value="lunch">Lunch</option>
                    <option value="snack2">Snack (Afternoon)</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack3">Snack (Evening)</option>
                  </select>
                </div>
              </div>

              <div class="chart-section">
                <component-pie-chart
                  .protein="${(this.isEditing ? this.editedProduct : this.product)?.product?.nutriments?.proteins_100g || 0}"
                  .carbs="${(this.isEditing ? this.editedProduct : this.product)?.product?.nutriments?.carbohydrates_100g || 0}"
                  .fat="${(this.isEditing ? this.editedProduct : this.product)?.product?.nutriments?.fat_100g || 0}"
                >
                  <div style="display: flex; flex-direction: column; align-items: center;">
                      <span style="font-weight: bold; font-size: 1.2rem;">
                          ${Math.round((this.isEditing ? this.editedProduct : this.product)?.product?.nutriments?.['energy-kcal_100g'] || 0)}
                      </span>
                      <span style="font-size: 0.8rem; color: var(--input-placeholder, #666);">kcal</span>
                  </div>
                </component-pie-chart>
              </div>
            </div>

            <div class="nutrients-grid">
                <div class="nutrient-item calories">
                    <div class="nutrient-value">
                      ${this.isEditing
        ? html`<input type="number" .value="${(this.editedProduct?.product?.nutriments?.['energy-kcal_100g'] || 0).toString()}" @input="${(e: Event) => this._handleNutrientChange(e, 'energy-kcal_100g')}">`
        : this._calculateNutrient(this.product.product?.nutriments?.['energy-kcal_100g'])}
                    </div>
                    <div class="nutrient-label">Calories (kcal)</div>
                </div>
                <div class="nutrient-item carbs">
                    <div class="nutrient-value">
                      ${this.isEditing
        ? html`<input type="number" .value="${(this.editedProduct?.product?.nutriments?.carbohydrates_100g || 0).toString()}" @input="${(e: Event) => this._handleNutrientChange(e, 'carbohydrates_100g')}">`
        : this._calculateNutrient(this.product.product?.nutriments?.carbohydrates_100g)}
                    </div>
                    <div class="nutrient-label">Carbs (g)</div>
                </div>
                <div class="nutrient-item protein">
                    <div class="nutrient-value">
                      ${this.isEditing
        ? html`<input type="number" .value="${(this.editedProduct?.product?.nutriments?.proteins_100g || 0).toString()}" @input="${(e: Event) => this._handleNutrientChange(e, 'proteins_100g')}">`
        : this._calculateNutrient(this.product.product?.nutriments?.proteins_100g)}
                    </div>
                    <div class="nutrient-label">Protein (g)</div>
                </div>
                <div class="nutrient-item fat">
                    <div class="nutrient-value">
                      ${this.isEditing
        ? html`<input type="number" .value="${(this.editedProduct?.product?.nutriments?.fat_100g || 0).toString()}" @input="${(e: Event) => this._handleNutrientChange(e, 'fat_100g')}">`
        : this._calculateNutrient(this.product.product?.nutriments?.fat_100g)}
                    </div>
                    <div class="nutrient-label">Fat (g)</div>
                </div>
            </div>

             ${this.isEditing ? html`
              <button 
                @click="${this._saveEdit}"
                class="add-to-diary-button save-edit-button"
              >
                ${this.translations.saveEdit}
              </button>
             ` : (this.mealId ? html`
              <button 
                @click="${this._addToMeal}"
                class="add-to-diary-button"
              >
                ${this.translations.addToMeal}
              </button>
             ` : html`
              <button 
                @click="${this._addToDiary}"
                class="add-to-diary-button"
              >
                Add to Diary
              </button>
             `)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-food': PageFood
  }
}
