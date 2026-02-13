import { css, html } from 'lit';
import { state } from 'lit/decorators.js';
import Page from '../../shared/page';
import { searchProduct } from '../../shared/httpEndpoints';
import { api } from '../../shared/api.decorator';

import type { SearchProductItemInterface } from '../../shared/http.interfaces';

@api({ searchProduct })
export default class PageSearch extends Page<{ searchProduct: typeof searchProduct }> {
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
        background-color: var(--group-button-hover-bg, rgba(0, 0, 0, 0.05));
      }
      button.scan-btn:active {
        transform: scale(0.95);
        background-color: var(--group-button-active-bg, var(--palette-green));
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

  @state() query: string = '';

  private async _handleSearchInit(e: CustomEvent) {
    const query = e.detail.query;
    this.query = '';
    this.loading = true;

    try {
      const searchResponse = await this.api.searchProduct(query);
      if (searchResponse.products && searchResponse.products.length > 0) {
        this.searchResult = await Promise.all(searchResponse.products.map(async product => {
          return {
            ...product,
            isFavorite: await this.db.isFavorite(product.code)
          };
        }));
        this.query = query;
        this.loading = false;
      } else {
        this.searchResult = [];
        this.query = query;
        this.loading = false;
      }
    } catch (error) {
      console.error('Error during search:', error);
      this.searchResult = [];
      this.query = query;
      this.loading = false;
    }
  }

  private _handleFavoriteClick(e: CustomEvent) {
    if (e.detail?.code) {
      const product = this.searchResult.find(product => product.code === e.detail.code);
      if (product) {
        product.isFavorite = e.detail.value === 'true';
        if (product.isFavorite) {
          this.db.addFavorite(e.detail.code);
        } else {
          this.db.removeFavorite(e.detail.code);
        }
        this.requestUpdate();
      }
    }
  }

  private _handleElementClick(e: CustomEvent) {
    if (e.detail?.code) {
      this.triggerPageNavigation({ page: 'food', code: e.detail.code });
    }
  }

  render() {
    return html`
      <div class="page-container">
        <h1>${this.translations.searchProduct}</h1>
        <div class="search-container">
          <component-search-input 
            placeholder="${this.translations.searchProduct}" 
            search-button-text="${this.translations.search}" 
            @search-init="${this._handleSearchInit}"
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
        ${this.loading ? html`
          <component-spinner class="loading-spinner"></component-spinner>
        ` : html`
          ${this.searchResult.length > 0 ? html`
            <div>
              ${this.searchResult.map(product => html`
                <component-search-result 
                  name="${product.product_name}" 
                  code="${product.code}" 
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
