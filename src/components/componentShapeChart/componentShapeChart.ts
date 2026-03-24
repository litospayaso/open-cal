import { html, css, LitElement, type PropertyValues } from 'lit';
import { property, state, query } from 'lit/decorators.js';

export interface ShapeChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

export default class ComponentShapeChart extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 250px;
      font-family: 'Inter', sans-serif;
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

    .radar-grid {
      fill: none;
      stroke: var(--palette-lightgrey, #cdcdcd);
      stroke-width: 0.5;
    }

    .radar-axis {
      stroke: var(--palette-lightgrey, #cdcdcd);
      stroke-width: 0.5;
    }

    .radar-area {
      fill: var(--chart-line-color, var(--palette-green, #4fb9ad));
      fill-opacity: 0.4;
      stroke: var(--chart-line-color, var(--palette-green, #4fb9ad));
      stroke-width: 2;
      filter: drop-shadow(2px 2px 4px var(--chart-line-color, var(--palette-green, #4fb9ad)));
    }

    .axis-label {
      font-size: 10px;
      fill: var(--card-text, #333);
      font-weight: 500;
    }

    .legend {
      display: flex;
      justify-content: center;
      gap: 15px;
      padding: 10px;
      flex-wrap: wrap;
      font-size: 12px;
      color: var(--card-text, #333);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .legend-box {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    :host([data-theme="dark"]),
    :host-context([data-theme="dark"]),
    :host-context(html[data-theme="dark"]) {
      --chart-line-color: var(--palette-purple, #a285bb);
    }
  `;

  @property({ type: Object }) chartData: ShapeChartData = {
    labels: [],
    datasets: []
  };

  @property({ type: Number }) maxValue: number = 10;

  @state() private _width: number = 0;
  @state() private _height: number = 0;
  @state() private _padding: number = 50;

  @query('.chart-container') private _chartContainer!: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', () => this._updateDimensions());
  }

  disconnectedCallback() {
    window.removeEventListener('resize', () => this._updateDimensions());
    super.disconnectedCallback();
  }

  firstUpdated() {
    this._updateDimensions();
  }

  private _updateDimensions() {
    if (!this._chartContainer) return;
    const rect = this._chartContainer.getBoundingClientRect();
    this._width = rect.width || 300;
    this._height = rect.height || 300;
    this.requestUpdate();
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('chartData') || changedProperties.has('_width') || changedProperties.has('_height')) {
      this._generateChartSvg();
    }
  }

  private _getCoordinates(angle: number, value: number, maxValue: number, size: number) {
    const radius = ((size / 2) - this._padding) * (value / maxValue);
    const x = (size / 2) + radius * Math.cos(angle - Math.PI / 2);
    const y = (size / 2) + radius * Math.sin(angle - Math.PI / 2);
    return { x, y };
  }

  private _generateChartSvg() {
    if (!this._chartContainer) return;

    this._chartContainer.innerHTML = '';
    const { labels, datasets } = this.chartData;

    if (!labels.length || !datasets.length) {
      this._chartContainer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%">No Data</div>';
      return;
    }

    const size = Math.min(this._width, this._height);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.style.width = `${size}px`;
    svg.style.height = `${size}px`;
    svg.style.margin = '0 auto';
    svg.style.display = 'block';

    const numAxes = labels.length;
    const angleStep = (Math.PI * 2) / numAxes;
    const maxValue = this.maxValue;
    const levels = Array.from({ length: 5 }, (_, i) => (maxValue / 5) * (i + 1));

    // Grid Levels
    levels.forEach(level => {
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const points = labels.map((_, i) => {
        const { x, y } = this._getCoordinates(i * angleStep, level, maxValue, size);
        return `${x},${y}`;
      }).join(' ');
      polygon.setAttribute('points', points);
      polygon.setAttribute('class', 'radar-grid');
      svg.appendChild(polygon);
    });

    // Axis Lines & Labels
    labels.forEach((label, i) => {
      const angle = i * angleStep;
      const { x: x1, y: y1 } = this._getCoordinates(angle, 0, maxValue, size);
      const { x: x2, y: y2 } = this._getCoordinates(angle, maxValue, maxValue, size);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1.toString());
      line.setAttribute('y1', y1.toString());
      line.setAttribute('x2', x2.toString());
      line.setAttribute('y2', y2.toString());
      line.setAttribute('class', 'radar-axis');
      svg.appendChild(line);

      const { x: xl, y: yl } = this._getCoordinates(angle, maxValue + 0.8, maxValue, size);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', xl.toString());
      text.setAttribute('y', yl.toString());
      text.setAttribute('class', 'axis-label');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.textContent = label;
      svg.appendChild(text);
    });

    // Data Area
    datasets.forEach(dataset => {
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const points = dataset.data.map((val, i) => {
        const { x, y } = this._getCoordinates(i * angleStep, val, maxValue, size);
        return `${x},${y}`;
      }).join(' ');
      polygon.setAttribute('points', points);
      polygon.setAttribute('class', 'radar-area');
      svg.appendChild(polygon);

      dataset.data.forEach((val, i) => {
        const { x, y } = this._getCoordinates(i * angleStep, val, maxValue, size);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', 'var(--chart-line-color)');
        svg.appendChild(circle);
      });
    });

    this._chartContainer.appendChild(svg);
  }

  render() {
    const showLegend = this.chartData.datasets.length > 1 || (this.chartData.datasets.length === 1 && this.chartData.datasets[0].label);

    return html`
      <div class="chart-container"></div>
      ${showLegend ? html`
        <div class="legend">
          ${this.chartData.datasets.map(ds => html`
            <div class="legend-item">
              <div class="legend-box" style="background: var(--chart-line-color)"></div>
              <span>${ds.label}</span>
            </div>
          `)}
        </div>
      ` : ''}
    `;
  }
}
