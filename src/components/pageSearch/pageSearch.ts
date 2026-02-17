import { css, html } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import { searchProduct, getProduct } from '../../shared/httpEndpoints';
import { api } from '../../shared/api.decorator';

import type { SearchProductItemInterface } from '../../shared/http.interfaces';

@api({ searchProduct, getProduct })
export default class PageSearch extends Page<{ searchProduct: typeof searchProduct, getProduct: typeof getProduct }> {
  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        padding: 20px;
        font-family: sans-serif;
        color: var(--text-color);
      }
      .page-container {
        max-width: 600px;
        margin: 0 auto;
      }
      .search-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
        margin-bottom: 20px;
      }
      .group-button-wrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
      }
      .search-container component-search-input{
        flex: 1;
      }
      button.scan-btn {
        padding: 0;
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        padding:8px;
        cursor: pointer;
        background-color: var(--group-button-active-bg, var(--palette-green));
        color: var(--group-button-active-text, #fff);
        border: none;
        border-radius: 50%;
        transition: transform 0.2s ease, background-color 0.3s ease;
        margin-left: 10px;
      }
      button.scan-btn:hover {
        transform: scale(1.05);
        opacity: 0.9;
      }
      button.scan-btn:active {
        transform: scale(0.95);
        opacity: 0.9;
      }
      .loading-spinner {
        display: flex;
        justify-content: center;
        padding: 2rem;
      }
      h1 {
        text-align: center;
      }
    `,
  ];

  @state() searchResult: (SearchProductItemInterface & { isFavorite?: boolean })[] = [];
  @state() loading: boolean = false;
  @state() mealId: string | null = null;

  @state() query: string = '';
  @state() viewMode: 'cached' | 'favorites' | 'search' | 'meals' = 'cached';
  @state() groupButtonOptions = [
    { text: this.translations.cached, id: 'cached', active: true },
    { text: this.translations.favorites, id: 'favorites', active: false },
    { text: this.translations.search, id: 'search', active: false },
    { text: this.translations.meals, id: 'meals', active: false }
  ];

  async onPageInit(): Promise<void> {
    await this.db.init();
    const params = this.getQueryParamsURL();
    const viewMode = params.get('viewMode');
    this.mealId = params.get('mealId');

    if (this.mealId) {
      this.groupButtonOptions = [
        { text: this.translations.cached, id: 'cached', active: true },
        { text: this.translations.favorites, id: 'favorites', active: false },
        { text: this.translations.search, id: 'search', active: false }
      ]
    } else {
      this.groupButtonOptions = [
        { text: this.translations.cached, id: 'cached', active: true },
        { text: this.translations.favorites, id: 'favorites', active: false },
        { text: this.translations.search, id: 'search', active: false },
        { text: this.translations.meals, id: 'meals', active: false }
      ]
    }

    if (viewMode && ['cached', 'favorites', 'search', 'meals'].includes(viewMode)) {
      this._switchMode(viewMode as any);
    } else {
      this._loadData();
    }
  }

  private async _loadData() {
    this.loading = true;
    try {
      let products: any[] = [];

      if (this.viewMode === 'cached') {
        products = await this.db.getAllCachedProducts();
        if (products && products.length > 0 && this.query) {
          products = products.filter(p => {
            const name = p.product_name || p.product?.product_name || '';
            return name.toLowerCase().includes(this.query.toLowerCase());
          });
        }
      } else if (this.viewMode === 'favorites') {
        const favorites = await this.db.getFavorites();
        const promises = favorites.map(async (fav) => {
          return await this.db.getCachedProduct(fav.code);
        });
        const results = await Promise.all(promises);
        products = results.filter(p => !!p);

        if (products && products.length > 0 && this.query) {
          products = products.filter(p => {
            const name = p.product_name || p.product?.product_name || '';
            return name.toLowerCase().includes(this.query.toLowerCase());
          });
        }
      } else if (this.viewMode === 'search') {
        if (this.query) {
          const searchResponse = await this.api.searchProduct(this.query);
          const rawProducts = searchResponse.products || [];

          // Check if any of these are cached/edited
          products = await Promise.all(rawProducts.map(async (p: any) => {
            const cached = await this.db.getCachedProduct(p.code);
            return cached || p;
          }));

        } else {
          products = [];
        }
      } else if (this.viewMode === 'meals') {
        const meals = await this.db.getAllMeals();

        const mealItems = meals.map(m => ({
          code: m.id,
          url: '',
          product_name: m.name,
          nutriments: {
            'energy-kcal': m.foods.reduce((acc, f) => acc + (f.product.nutriments?.['energy-kcal'] || 0) * (f.quantity / 100), 0)
          } as any,
          // ... other props
        } as any));

        // Prepend create new
        products = [
          {
            code: this._generateId(),
            product_name: this.translations.createNewMeal,
            nutriments: {} as any,
          },
          ...mealItems
        ];
      }

      this.searchResult = await Promise.all(products.map(async product => {
        if (this.viewMode === 'meals') return product; // Skip product lookups for meals

        const isFavorite = await this.db.isFavorite(product.code);
        // Normalize structure if it comes from cache (nested product object)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalized: any = { ...product, isFavorite };
        if (product.product) {
          normalized.product_name = product.product.product_name || normalized.product_name;
          normalized.nutriments = product.product.nutriments || normalized.nutriments;
          normalized.brands = product.product.brands || normalized.brands;
        }
        return normalized;
      }));

    } catch (e) {
      console.error('Error loading data', e);
      this.searchResult = [];
    } finally {
      this.loading = false;
    }
  }

  private _generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private async _handleSearchInit(e: CustomEvent) {
    const { query, isButtonClick } = e.detail;
    this.query = query;

    if (isButtonClick) {
      this._switchMode('search');
    } else {
      // Enter key or similar
      this._loadData();
    }
  }

  private _handleSearchBlur(e: CustomEvent) {
    this.query = e.detail.query;
    // "If the user is in search food it will be the same behavior it will fetch to the api"
    // "after the blur it will filter the selected list... by the input text"
    this._loadData();
  }

  private _handleModeSwitch(e: CustomEvent) {
    this._switchMode(e.detail.id);
  }

  private _switchMode(mode: 'cached' | 'favorites' | 'search' | 'meals') {
    this.viewMode = mode;
    this.groupButtonOptions = this.groupButtonOptions.map(opt => ({
      ...opt,
      active: opt.id === mode
    }));
    this._loadData();
  }

  private async _handleFavoriteClick(e: CustomEvent) {
    if (e.detail?.code) {
      const product = this.searchResult.find(product => product.code === e.detail.code);
      if (product) {
        product.isFavorite = e.detail.value === 'true';
        this.requestUpdate(); // specific update to show UI change immediately

        if (product.isFavorite) {
          try {
            // Fetch full product to cache it correctly
            const fullProduct = await this.api.getProduct(e.detail.code);
            if (fullProduct) {
              await this.db.cacheProduct(fullProduct);
              await this.db.addFavorite(e.detail.code);
            }
          } catch (err) {
            console.error('Error adding favorite', err);
            // Revert UI if failed? For now keep it simple
          }
        } else {
          await this.db.removeFavorite(e.detail.code);
        }
      }
    }
  }

  private _handleElementClick(e: CustomEvent) {
    if (e.detail?.code) {
      if (this.viewMode === 'meals') {
        this.triggerPageNavigation({ page: 'meal', mealId: e.detail.code });
      } else {
        // If we are in search (non-meal) but we have a mealId param, pass it
        const params = this.getQueryParamsURL();
        const mealId = params.get('mealId');
        const navParams: any = { page: 'food', code: e.detail.code };
        if (mealId) {
          navParams.mealId = mealId;
        }
        this.triggerPageNavigation(navParams);
      }
    }
  }

  render() {
    return html`
      <div class="page-container">
        <h1>${this.mealId ? this.translations.addFood : this.translations.searchProduct}</h1>
        <div class="search-container">
          <component-search-input 
            placeholder="${this.translations.searchProduct}" 
            search-button-text="${this.translations.search}" 
            @search-init="${this._handleSearchInit}"
            @search-blur="${this._handleSearchBlur}"
          ></component-search-input>
          <button class="scan-btn" @click="${() => this.triggerPageNavigation({ page: 'scanner' })}">
            <svg width="800px" height="35px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <title>ionicons-v5-d</title>
              <polyline points="400 400.33 448 400 448 112 400 112.33" style="fill:none;stroke:#000000;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
              <polyline points="112 112 64 112.33 64 400.33 112 400" style="fill:none;stroke:#000000;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
              <line x1="384" y1="192" x2="384" y2="320" style="fill:none;stroke:#000000;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
              <line x1="320" y1="160" x2="320" y2="352" style="fill:none;stroke:#000000;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
              <line x1="256" y1="176" x2="256" y2="336" style="fill:none;stroke:#000000;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
              <line x1="192" y1="160" x2="192" y2="352" style="fill:none;stroke:#000000;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
              <line x1="128" y1="192" x2="128" y2="320" style="fill:none;stroke:#000000;stroke-linecap:square;stroke-linejoin:round;stroke-width:32px"/>
            </svg>
          </button>
        </div>
        
        <div class="group-button-wrapper">
             <component-group-button
                .options="${this.groupButtonOptions}"
                @group-button-click="${this._handleModeSwitch}"
             ></component-group-button>
        </div>

        ${this.loading ? html`
          <component-spinner class="loading-spinner"></component-spinner>
        ` : html`
          ${this.searchResult.length > 0 ? html`
            <div>
              ${this.searchResult.map(product => html`
                <component-search-result 
                  name="${product.product_name}" 
                  code="${product.code}" 
                  brands="${product.brands || ''}"
                  calories="${product.nutriments && product.nutriments['energy-kcal'] ? product.nutriments['energy-kcal'] : -1}" 
                  favorite="${product.isFavorite}"
                  @favorite-click="${this._handleFavoriteClick}"
                  @element-click="${this._handleElementClick}"
                ></component-search-result>
              `)}
            </div>
          ` : ''}
          ${this.searchResult.length === 0 && this.query.length > 0 ? html`
            <p>${this.translations.noResultsFound}</p>
          ` : ''}
        `}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'page-search': PageSearch;
  }
}
