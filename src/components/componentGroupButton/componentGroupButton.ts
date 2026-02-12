import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export interface GroupButtonOption {
  text: string;
  id: string;
  active: boolean;
}

export class ComponentGroupButton extends LitElement {
  @property({ type: Array }) set options(value: GroupButtonOption[] | string) {
    this.optionsState = typeof value === 'string' ? JSON.parse(value) : value;
  }

  @state() optionsState: GroupButtonOption[] = [];

  static styles = css`
    :host {
      display: block;
      font-family: inherit;
    }

    .group-button-container {
      display: flex;
      flex-direction: row;
      border: 1px solid var(--input-border, var(--palette-grey));
      border-radius: 20px;
      overflow: hidden;
      width: fit-content;
      background-color: var(--card-background, #fff);
    }

    .group-button {
      background: transparent;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s ease, color 0.3s ease;
      color: var(--input-text, #000);
      flex: 1;
      border-right: 1px solid var(--input-border, var(--palette-grey));
    }

    .group-button:last-child {
      border-right: none;
    }

    .group-button:hover {
      background-color: var(--group-button-hover-bg, rgba(0, 0, 0, 0.05));
    }

    .group-button.active {
      background-color: var(--group-button-active-bg, var(--palette-green));
      color: var(--group-button-active-text, #fff);
    }
  `;

  render() {
    return html`
      <div class="group-button-container" role="group">
        ${this.optionsState.map(option => html`
          <button
            class="group-button ${option.active ? 'active' : ''}"
            @click="${() => this._handleClick(option.id)}"
            type="button"
          >
            ${option.text}
          </button>
        `)}
      </div>
    `;
  }

  private _handleClick(id: string) {
    this.dispatchEvent(new CustomEvent('group-button-click', {
      detail: { id },
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'component-group-button': ComponentGroupButton;
  }
}
