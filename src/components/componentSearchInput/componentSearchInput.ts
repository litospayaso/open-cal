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
      gap: 10px;
    }
    input {
      padding: 0.5rem;
      font-size: 1rem;
      flex: 1;
    }
    button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      cursor: pointer;
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
