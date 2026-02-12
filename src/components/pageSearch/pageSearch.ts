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
            isFavorite: await this.isFavorite(product.code)
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
          this.addFavorite(e.detail.code);
        } else {
          this.removeFavorite(e.detail.code);
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
        <component-search-input 
          placeholder="${this.translations.searchProduct}" 
          search-button-text="${this.translations.search}" 
          @search-init="${this._handleSearchInit}"
        ></component-search-input>
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
