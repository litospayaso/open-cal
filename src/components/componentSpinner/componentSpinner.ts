import { LitElement, html, css } from 'lit';

export class ComponentSpinner extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .spinner {
      border: 4px solid var(--spinner-track-color, rgba(0, 0, 0, 0.1));
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: var(--spinner-active-color, #09f);
      animation: spin 1s ease infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  render() {
    return html`<div class="spinner"></div>`;
  }
}
