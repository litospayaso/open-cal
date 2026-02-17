import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export interface SearchResultComponentInterface {
  name?: string;
  code?: string;
  favorite?: boolean;
  calories?: string;
  'favorite-click'?: (event: CustomEvent<{ code: string, value: string }>) => void;
  'element-click'?: (event: CustomEvent<{ code: string }>) => void;
  'remove-click'?: (event: CustomEvent<{ code: string }>) => void;
}

export class ComponentSearchResult extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) code = '';
  @property({ type: String }) brands = '';
  @property({ type: String }) calories = '';
  @property({ type: String }) quantity = '';
  @property({ type: Boolean }) removable = false;
  @property({ type: String }) set favorite(favorite: string) {
    this.favoriteState = favorite === 'true';
    this.requestUpdate()
  };

  @state() favoriteState: boolean = false;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }

    .result-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid var(--card-border);
      background: var(--card-background, #fff);
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 8px;
    }

    .icon-section {
      border: 1px solid var(--card-border);
      background: var(--card-background, #fff);
      padding: 14px 10px;
      border-radius: 8px;
      flex: 0 0 auto;
      margin-right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    .name-section {
      flex: 1 1 auto;
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--card-text);
      cursor: pointer;
    }

    .brand-section {
      font-size: 0.8rem;
      color: var(--input-placeholder);
      margin-top: 2px;
    }

    .quantity-section {
      font-size: 0.8rem;
      color: var(--input-placeholder);
      margin-top: 4px;
    }

    .calories-section {
      font-size: .87rem;
      font-weight: 500;
      color: var(--input-placeholder);
    }

    .favorite-section {
      flex: 0 0 auto;
      margin-left: 16px;
      cursor: pointer;
    }

    .favorite-icon {
      width: 24px;
      height: 24px;
      fill: none;
      stroke: #666;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: fill 0.3s ease, stroke 0.3s ease;
    }

    .favorite-icon.is-favorite {
      fill: var(--favorite-color, #ffd700);
      stroke: var(--favorite-color, #ffd700);
    }
  `;

  render() {
    return html`
      <div class="result-card">
        <div class="icon-section" @click="${this._handleElementClick}">
          <component-emoji text="${this.name}" size="s"></component-emoji>
        </div>
        <div class="name-section" @click="${this._handleElementClick}">
          <div>${this.name}</div>
          ${this.brands ? html`<div class="brand-section">${this.brands}</div>` : ''}
          ${this.quantity ? html`<div class="quantity-section">${this.quantity}</div>` : ''}
        </div>
        ${this.calories && Number(this.calories) > 0 ? html`
          <div class="calories-section">
            ${Math.trunc(Number(this.calories))} Kcal
          </div>
        ` : ''}
        ${this.removable ? html`
           <div class="favorite-section" @click="${this._handleRemoveClick}">
              ${this._renderTrashIcon()}
           </div>
        ` : html`
           <div class="favorite-section" @click="${this._handleFavoriteClick}">
              ${this._renderFavoriteIcon()}
           </div>
        `}
      </div>
    `;
  }

  private _renderTrashIcon() {
    return html`
      <svg
        class="favorite-icon"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style="stroke: var(--palette-grey);"
      >
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    `;
  }

  private _renderFavoriteIcon() {
    return html`
      <svg
        class="favorite-icon ${this.favoriteState ? 'is-favorite' : ''}"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    `;
  }

  private _handleElementClick() {
    this.dispatchEvent(new CustomEvent('element-click', {
      detail: { code: this.code },
      bubbles: true,
      composed: true
    }));
  }

  private _handleFavoriteClick() {
    this.dispatchEvent(new CustomEvent('favorite-click', {
      detail: { code: this.code, value: this.favoriteState ? 'false' : 'true' },
      bubbles: true,
      composed: true
    }));
  }

  private _handleRemoveClick(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('remove-click', {
      detail: { code: this.code },
      bubbles: true,
      composed: true
    }));
  }
}
