import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export interface SearchInputComponentInterface {
  value?: string;
  placeholder?: string;
  'search-init'?: (query: { data: { query: string } }) => void;
}

export class ComponentSearchInput extends LitElement {
  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @state() previousValue = '';

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
    .input-container {
      display: flex;
      align-items: center;
      border: 2px solid var(--input-border, var(--palette-grey));
      border-radius: 25px;
      padding: 5px 5px 5px 20px;
      background: var(--card-background, white);
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .input-container:focus-within {
      border-color: var(--palette-purple);
      box-shadow: 0 0 5px rgba(162, 133, 187, 0.3);
    }
    input {
      font-size: 1rem;
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      color: var(--input-text, var(--palette-black));
      padding: 5px 0;
    }
    input::placeholder {
      color: var(--input-placeholder, #757575);
    }
    button {
      padding: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      cursor: pointer;
      background-color: var(--palette-purple);
      color: var(--button-icon-color, white);
      border: none;
      border-radius: 50%;
      transition: transform 0.2s ease, background-color 0.3s ease;
      margin-left: 10px;
    }
    button:hover {
      transform: scale(1.05);
      background-color: var(--palette-blue);
    }
    button:active {
      transform: scale(0.95);
    }
  `;

  render() {
    return html`
      <div class="input-container">
        <input 
          type="text" 
          .value="${this.value}" 
          @input="${this._handleInput}" 
          @blur="${this._handleSearch}" 
          placeholder="${this.placeholder}"
          aria-label="Search"
        />
        <button @click="${this._handleSearch}" aria-label="Search button">🔎</button>
      </div>
    `;
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.value = target.value;
  }

  private _handleSearch() {
    if (this.previousValue !== this.value) {
      this.previousValue = this.value;
      this.dispatchEvent(new CustomEvent('search-init', {
        detail: { query: this.value },
        bubbles: true,
        composed: true
      }));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'component-search-input': ComponentSearchInput;
  }
}
