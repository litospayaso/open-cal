import { css, html } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import { getProduct } from '../../shared/httpEndpoints';
import { api } from '../../shared/api.decorator';

import type { ProductInterface } from '../../shared/http.interfaces';

import '../componentSpinner/index';

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
      .product-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      .calculator {
        background: #f5f5f5;
        padding: 1.5rem;
        border-radius: 8px;
        margin-top: 1rem;
      }
      .input-group {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      input {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100px;
      }
      .nutrients-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
      .nutrient-item {
        background: white;
        padding: 1rem;
        border-radius: 4px;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      .nutrient-value {
        font-size: 1.25rem;
        font-weight: bold;
        color: #333;
      }
      .nutrient-label {
        color: #666;
        font-size: 0.875rem;
      }
      .error-message {
        color: red;
        text-align: center;
      }
    `,
  ];

  @state() product: ProductInterface | null = null;
  @state() loading: boolean = false;
  @state() error: string = '';
  @state() grams: number = 100;
  @state() isFavoriteState: boolean = false;

  async onPageInit(): Promise<void> {
    const params = this.getQueryParamsURL();
    const code = params.get('code');

    if (code) {
      this.loading = true;
      try {
        await this.initDB();
        this.isFavoriteState = await super.isFavorite(code);

        const cached = await this.getCachedProduct(code);
        if (cached) {
          this.product = cached;
          this.loading = false;
        } else {
          const response = await this.api.getProduct(code);
          if (response && response.product) {
            this.product = response;
            await this.cacheProduct(response);
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
      await this.removeFavorite(code);
      this.isFavoriteState = false;
    } else {
      await this.addFavorite(code);
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

    const nutriments = this.product.product.nutriments;

    return html`
      <div class="page-container">
        <div class="product-header">
          <h1>${(this.product.product as any).product_name || 'Unknown Product'}</h1>
          <button 
            @click="${this._toggleFavorite}" 
            style="background: none; border: none; cursor: pointer; font-size: 2rem;"
            aria-label="${this.isFavoriteState ? 'Remove from favorites' : 'Add to favorites'}"
          >
            ${this.isFavoriteState ? '★' : '☆'}
          </button>
        </div>

        <div class="calculator">
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

            <div class="nutrients-grid">
                <div class="nutrient-item">
                    <div class="nutrient-value">${this._calculateNutrient(nutriments['energy-kcal_100g'])}</div>
                    <div class="nutrient-label">Calories (kcal)</div>
                </div>
                <div class="nutrient-item">
                    <div class="nutrient-value">${this._calculateNutrient(nutriments.carbohydrates_100g)}</div>
                    <div class="nutrient-label">Carbs (g)</div>
                </div>
                <div class="nutrient-item">
                    <div class="nutrient-value">${this._calculateNutrient(nutriments.proteins_100g)}</div>
                    <div class="nutrient-label">Protein (g)</div>
                </div>
                <div class="nutrient-item">
                    <div class="nutrient-value">${this._calculateNutrient(nutriments.fat_100g)}</div>
                    <div class="nutrient-label">Fat (g)</div>
                </div>
            </div>
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
