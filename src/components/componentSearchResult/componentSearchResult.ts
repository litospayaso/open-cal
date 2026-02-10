import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export interface SearchResultComponentInterface {
  name?: string;
  code?: string;
  isFavorite?: boolean;
  calories?: string;
  'favorite-click'?: (event: CustomEvent<{ code: string, value: string }>) => void;
  'element-click'?: (event: CustomEvent<{ code: string }>) => void;
}

export class ComponentSearchResult extends LitElement {
  @property({ type: String }) name = '';
  @property({ type: String }) code = '';
  @property({ type: String }) calories = '';
  @property({ type: String }) set isFavorite(favorite: string) {
    this.favoriteState = favorite === 'true';
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
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 8px;
    }

    .icon-section {
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
      color: #333;
      cursor: pointer;
    }

    .calories-section {
      font-size: .87rem;
      font-weight: 500;
      color: #666;
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
      fill: #ffd700;
      stroke: #ffd700;
    }
  `;

  render() {
    return html`
      <div class="result-card">
        <div class="icon-section" @click="${this._handleElementClick}">
          🍎
        </div>
        <div class="name-section" @click="${this._handleElementClick}">
          ${this.name}
        </div>
        ${this.calories && Number(this.calories) > 0 ? html`
          <div class="calories-section">
            ${Math.trunc(Number(this.calories))} Kcal
          </div>
        ` : ''}
        <div class="favorite-section" @click="${this._handleFavoriteClick}">
          ${this._renderFavoriteIcon()}
        </div>
      </div>
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
      detail: { code: this.code, value: this.isFavorite === 'true' ? 'false' : 'true' },
      bubbles: true,
      composed: true
    }));
  }
}
