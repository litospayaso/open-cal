import { html, css, LitElement, type PropertyValues } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';

@customElement('component-line-chart')
export default class ComponentLineChart extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 200px;
      font-family: sans-serif;
    }

    .chart-container {
      width: 100%;
      height: 100%;
      position: relative;
    }

    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .line {
      fill: none;
      stroke: var(--chart-line-color, var(--palette-green, #4caf50));
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: stroke-dashoffset 1s ease-in-out;
    }

    .axis {
      stroke: var(--chart-axis-color, var(--palette-grey, #ccc));
      stroke-width: 1;
    }

    .tooltip {
      position: absolute;
      background: var(--card-background, #fff);
      border: 1px solid var(--card-border, #ccc);
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      color: var(--card-text, #333);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transform: translate(-50%, -100%);
      margin-top: -10px;
    }

    .point {
      fill: var(--card-background, #fff);
      stroke: var(--chart-line-color, var(--palette-green, #4caf50));
      stroke-width: 2;
      cursor: pointer;
      transition: r 0.2s;
    }

    .point:hover {
      r: 6;
    }
  `;

  @property({ type: Array }) data: number[] = [];
  @property({ type: String }) color: string = '';
  @property({ type: Number }) padding: number = 20;

  @state() private _hoveredValue: number | null = null;
  @state() private _hoveredX: number = 0;
  @state() private _hoveredY: number = 0;
  @state() private _width: number = 0;
  @state() private _height: number = 0;

  private _resizeObserver: ResizeObserver | null = null;

  connectedCallback() {
    super.connectedCallback();
    this._resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this._width = entry.contentRect.width;
        this._height = entry.contentRect.height;
        this.requestUpdate();
      }
    });
    this._resizeObserver.observe(this);
    // Force an initial update to check dimensions immediately
    this.requestUpdate();
  }

  firstUpdated() {
    this._updateDimensions();
  }

  private _updateDimensions() {
    const rect = this.getBoundingClientRect();
    this._width = rect.width || this.offsetWidth;
    this._height = rect.height || this.offsetHeight;
    this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  @query('.chart-container') private _chartContainer!: HTMLElement;

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('color') && this.color) {
      this.style.setProperty('--chart-line-color', this.color);
    }

    if (changedProperties.has('data') || changedProperties.has('_width') || changedProperties.has('_height')) {
      this._generateChartSvg();
    }
  }

  private _handleMouseEnter(val: number, x: number, y: number) {
    this._hoveredValue = val;
    this._hoveredX = x;
    this._hoveredY = y;
  }

  private _handleMouseLeave() {
    this._hoveredValue = null;
  }

  private _generateChartSvg() {
    if (!this._chartContainer) return;

    // Clear previous
    this._chartContainer.innerHTML = '';

    const width = this._width || this.offsetWidth || 300;
    const height = this._height || this.offsetHeight || 200;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.overflow = 'visible';

    this._chartContainer.appendChild(svg);

    if (!this.data || this.data.length === 0) return;

    const safeData = this.data.map(n => Number(n));
    const maxVal = Math.max(...safeData, 1);

    const availableWidth = width - (this.padding * 2);
    const availableHeight = height - (this.padding * 2);
    const stepX = availableWidth / (Math.max(safeData.length - 1, 1));

    // Polyline
    const points = safeData.map((val, index) => {
      const x = this.padding + (index * stepX);
      const y = height - this.padding - ((val / maxVal) * availableHeight);
      return `${x},${y}`;
    }).join(' ');

    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('class', 'line');
    // Styles are handled by CSS, but direct style setting is also possible if needed
    // polyline.style.fill = 'none';
    // polyline.style.stroke = 'var(--chart-line-color, var(--palette-green, #4caf50))';
    // polyline.style.strokeWidth = '3';
    // polyline.style.strokeLinecap = 'round';
    // polyline.style.strokeLinejoin = 'round';

    svg.appendChild(polyline);

    // Circles
    safeData.forEach((val, index) => {
      const x = this.padding + (index * stepX);
      const y = height - this.padding - ((val / maxVal) * availableHeight);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '4');
      circle.setAttribute('class', 'point');
      // Styles are handled by CSS, but direct style setting is also possible if needed
      // circle.style.fill = 'var(--card-background, #fff)';
      // circle.style.stroke = 'var(--chart-line-color, var(--palette-green, #4caf50))';
      // circle.style.strokeWidth = '2';
      // circle.style.cursor = 'pointer';

      // Event listeners for tooltip
      circle.addEventListener('mouseenter', () => this._handleMouseEnter(val, x, y));
      circle.addEventListener('mouseleave', () => this._handleMouseLeave());

      svg.appendChild(circle);
    });

    // Tooltip is handled by lit-html render, but we need to make sure we don't wipe it if it's inside chart-container?
    // Actually, I can render the tooltip OUTSIDE the container or inside via lit, but if I wipe innerHTML I lose it if it's there.
    // I can split the render: chart container (for svg) and tooltip container.
  }

  render() {
    return html`
        <div style="position: relative; width: 100%; height: 100%;">
            <div class="chart-container"></div>
            ${this._hoveredValue !== null ? html`
                <div class="tooltip" style="left: ${this._hoveredX}px; top: ${this._hoveredY}px; opacity: 1;">
                    ${this._hoveredValue}
                </div>
            ` : ''}
        </div>
      `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'component-line-chart': ComponentLineChart;
  }
}
