import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('component-pie-chart')
export default class ComponentPieChart extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100px;
      height: 100px;
    }

    .pie-chart {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: conic-gradient(
        var(--protein-color) var(--protein-deg),
        var(--carbs-color) var(--protein-deg) var(--carbs-deg),
        var(--fat-color) var(--carbs-deg) var(--fat-deg),
        transparent var(--fat-deg)
      );
      position: relative;
    }

    .center-hole {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;
        height: 60%;
        background-color: var(--card-background, #fff);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
  `;

  @property({ type: Number }) protein = 0;
  @property({ type: Number }) carbs = 0;
  @property({ type: Number }) fat = 0;

  render() {
    const total = this.protein + this.carbs + this.fat;

    let proteinDeg = 0;
    let carbsDeg = 0;
    let fatDeg = 0;

    if (total > 0) {
      proteinDeg = (this.protein / total) * 360;
      carbsDeg = proteinDeg + (this.carbs / total) * 360;
      fatDeg = carbsDeg + (this.fat / total) * 360; // Should be around 360
    }

    const style = `
      --protein-deg: ${proteinDeg}deg;
      --carbs-deg: ${carbsDeg}deg;
      --fat-deg: ${fatDeg}deg;
    `;

    return html`
      <div class="pie-chart" style="${style}">
        <div class="center-hole">
           <slot></slot>
        </div>
      </div>
    `;
  }
}
