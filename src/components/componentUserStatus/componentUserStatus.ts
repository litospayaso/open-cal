import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import Page from '../../shared/page';

export default class ComponentUserStatus extends LitElement {
  @property({ type: Number }) exerciseCalories = 0;
  @property({ type: Number }) basalCalories = 0;
  @property({ type: Number }) steps = 0;
  @property({ type: Number }) sleepHours = 0;
  @property({ type: Number }) energyLevel = 0;
  @property({ type: Number }) hungerLevel = 0;

  @state() private showModal = false;
  @state() private _exerciseCalories = 0;
  @state() private _basalCalories = 0;
  @state() private _steps = 0;
  @state() private _sleepHours = 0;
  @state() private _energyLevel = 0;
  @state() private _hungerLevel = 0;

  static styles = [
    Page.styles,
    css`
    :host {
      display: block;
      width: 100%;
      margin: 16px 0;
    }

    .status-card {
      background: var(--card-background, #fff);
      border: 1px solid var(--card-border, #4fb9ad);
      border-radius: 8px;
      padding: 0 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      height: 35px;
      box-sizing: border-box;
      overflow: hidden;
      cursor: pointer;
    }

    .status-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 4px;
    }

    .emoji {
      font-size: 1rem;
    }

    .value {
      font-weight: bold;
      font-size: 0.75rem;
      color: var(--text-color, #191c25);
    }

    .label {
      display: none;
    }

    .modal-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      text-align: left;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-group label {
      font-size: 0.85rem;
      font-weight: bold;
      color: var(--text-color);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .slider-container {
      margin-top: 8px;
    }
  `];

  private openModal() {
    this._exerciseCalories = this.exerciseCalories;
    this._basalCalories = this.basalCalories;
    this._steps = this.steps;
    this._sleepHours = this.sleepHours;
    this._energyLevel = this.energyLevel;
    this._hungerLevel = this.hungerLevel;
    this.showModal = true;
  }

  private closeModal() {
    this.showModal = false;
  }

  private saveChanges() {
    this.exerciseCalories = this._exerciseCalories;
    this.basalCalories = this._basalCalories;
    this.steps = this._steps;
    this.sleepHours = this._sleepHours;
    this.energyLevel = this._energyLevel;
    this.hungerLevel = this._hungerLevel;

    this.dispatchEvent(new CustomEvent('status-changed', {
      detail: {
        exerciseCalories: this.exerciseCalories,
        basalCalories: this.basalCalories,
        steps: this.steps,
        sleepHours: this.sleepHours,
        energyLevel: this.energyLevel,
        hungerLevel: this.hungerLevel
      },
      bubbles: true,
      composed: true
    }));

    this.closeModal();
  }

  private handleInputChange(e: Event, key: string) {
    const target = e.target as HTMLInputElement;
    (this as any)[`_${key}`] = Number(target.value);
  }

  private formatTime(val: number): string {
    const hours = Math.floor(val);
    const minutes = Math.round((val - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  render() {
    return html`
      <div class="status-card" @click="${this.openModal}">
        <div class="status-item" title="Basal Calories">
          <span class="emoji">🔥</span>
          ${this.basalCalories > 0 ? html`<span class="value">${this.basalCalories} kcal</span>` : ''}
        </div>
        <div class="status-item" title="Exercise Calories">
          <span class="emoji">💪</span>
          ${this.exerciseCalories > 0 ? html`<span class="value">${this.exerciseCalories} kcal</span>` : ''}
        </div>
        <div class="status-item" title="Steps">
          <span class="emoji">👣</span>
          ${this.steps > 0 ? html`<span class="value">${this.steps} steps</span>` : ''}
        </div>
        <div class="status-item" title="Sleep">
          <span class="emoji">😴</span>
          ${this.sleepHours > 0 ? html`<span class="value">${this.formatTime(this.sleepHours)} h</span>` : ''}
        </div>
        <div class="status-item" title="Energy Level">
          <span class="emoji">⚡</span>
          ${this.energyLevel > 0 ? html`<span class="value">${this.energyLevel}/5</span>` : ''}
        </div>
        <div class="status-item" title="Hunger Level">
          <span class="emoji">🍕</span>
          ${this.hungerLevel > 0 ? html`<span class="value">${this.hungerLevel}/5</span>` : ''}
        </div>
      </div>

      ${this.showModal ? html`
        <div class="modal-overlay" @click="${this.closeModal}">
          <div class="modal" @click="${(e: Event) => e.stopPropagation()}">
            <div class="modal-header">
              <h3>Daily Status</h3>
              <button class="close-btn" @click="${this.closeModal}">&times;</button>
            </div>
            
            <div class="modal-content">
              <div class="form-row">
                <div class="form-group">
                  <label>🔥 Basal kcal (${this._basalCalories})</label>
                  <input type="number" .value="${String(this._basalCalories)}" @input="${(e: Event) => this.handleInputChange(e, 'basalCalories')}" />
                </div>
                <div class="form-group">
                  <label>💪 Exercise kcal (${this._exerciseCalories})</label>
                  <input type="number" .value="${String(this._exerciseCalories)}" @input="${(e: Event) => this.handleInputChange(e, 'exerciseCalories')}" />
                </div>
              </div>

              <div class="form-group">
                <label>👣 Steps taken (${this._steps})</label>
                <input type="number" .value="${String(this._steps)}" @input="${(e: Event) => this.handleInputChange(e, 'steps')}" />
              </div>

              <div class="form-group">
                <label>😴 Sleep hours (${this.formatTime(this._sleepHours)})</label>
                <div class="slider-container">
                  <component-slider
                    data-theme="${document.documentElement.getAttribute('data-theme') || 'light'}"
                    format="time"
                    .min="${0}"
                    .max="${12}"
                    .steps="${0.25}"
                    .value="${this._sleepHours}"
                    @value-changed="${(e: CustomEvent) => this._sleepHours = e.detail.value}"
                    minTag="0h"
                    maxTag="12h"
                  ></component-slider>
                </div>
              </div>

              <div class="form-group">
                <label>⚡ Energy level (${this._energyLevel}/5)</label>
                <div class="slider-container">
                  <component-slider
                    data-theme="${document.documentElement.getAttribute('data-theme') || 'light'}"
                    .min="${0}"
                    .max="${5}"
                    .steps="${1}"
                    .value="${this._energyLevel}"
                    @value-changed="${(e: CustomEvent) => this._energyLevel = e.detail.value}"
                    minTag="🪫"
                    maxTag="⚡"
                  ></component-slider>
                </div>
              </div>

              <div class="form-group">
                <label>🍕 Hunger level (${this._hungerLevel}/5)</label>
                <div class="slider-container">
                  <component-slider
                    data-theme="${document.documentElement.getAttribute('data-theme') || 'light'}"
                    .min="${0}"
                    .max="${5}"
                    .steps="${1}"
                    .value="${this._hungerLevel}"
                    @value-changed="${(e: CustomEvent) => this._hungerLevel = e.detail.value}"
                    minTag="😫"
                    maxTag="🤤"
                  ></component-slider>
                </div>
              </div>

              <div class="modal-buttons">
                <button class="btn" @click="${this.saveChanges}">Save</button>
              </div>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}
