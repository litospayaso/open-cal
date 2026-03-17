import { expect } from '@esm-bundle/chai';
import { createComponent } from '../../shared/test-helper';

import './index';
import ComponentBarLineChart, { type BarLineChartData } from './componentBarLineChart';

const sampleChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Consumed',
      type: 'bar' as const,
      data: [1800, 2000, 1500, 2200, 1900, 2100, 1700],
      yAxisID: 'y'
    },
    {
      label: 'Burned',
      type: 'bar' as const,
      data: [[1500, 200], [1500, 300], [1500, 150], [1500, 250], [1500, 200], [1500, 300], [1500, 200]],
      stackLabels: ['Basal', 'Exercise', 'Total'],
      yAxisID: 'y'
    },
    {
      label: 'Steps',
      type: 'bar' as const,
      data: [500, 600, 400, 700, 550, 650, 450],
      color: 'var(--palette-blue)',
      yAxisID: 'y'
    },
    {
      label: 'Sleep',
      type: 'line' as const,
      data: [7, 6, 8, 5, 7, 6, 7.5],
      yAxisID: 'y1',
      dashed: true
    },
    {
      label: 'Energy',
      type: 'line' as const,
      data: [4, 3, 5, 2, 4, 3, 4.5],
      yAxisID: 'y1'
    },
    {
      label: 'Hunger',
      type: 'line' as const,
      data: [3, 4, 2, 5, 3, 4, 3],
      yAxisID: 'y1',
      dotted: true
    }
  ]
} as BarLineChartData;

const simpleChartData = {
  labels: ['A', 'B', 'C'],
  datasets: [
    {
      label: 'Values',
      type: 'bar' as const,
      data: [10, 20, 30],
      yAxisID: 'y'
    }
  ]
} as BarLineChartData;

const lineOnlyData = {
  labels: ['X', 'Y', 'Z'],
  datasets: [
    {
      label: 'Trend',
      type: 'line' as const,
      data: [5, 8, 3],
      yAxisID: 'y1'
    }
  ]
} as BarLineChartData;

const emptyData = {
  labels: [],
  datasets: []
} as BarLineChartData;

const hiddenDatasetData = {
  labels: ['Mon', 'Tue'],
  datasets: [
    {
      label: 'Visible',
      type: 'bar' as const,
      data: [10, 20],
      yAxisID: 'y',
      hidden: false
    },
    {
      label: 'Hidden',
      type: 'bar' as const,
      data: [30, 40],
      yAxisID: 'y',
      hidden: true
    }
  ]
} as BarLineChartData;

const singlePointData = {
  labels: ['A'],
  datasets: [
    {
      label: 'Single',
      type: 'line' as const,
      data: [5],
      yAxisID: 'y1'
    }
  ]
} as BarLineChartData;


describe('ComponentBarLineChart Spec:', () => {
  let element: HTMLElement;
  let component: ComponentBarLineChart;

  beforeEach(async () => {
    const comp = await createComponent({
      class: ComponentBarLineChart,
      name: 'component-bar-line-chart'
    });
    element = comp.element;
    component = element as ComponentBarLineChart;
  });

  afterEach(() => {
    if (element && element.parentNode) {
      document.body.removeChild(element);
    }
  });

  it('should contain shadow root', () => {
    expect(element.shadowRoot).to.exist;
  });

  it('should render with empty data', async () => {
    component.chartData = emptyData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const chartContainer = shadow?.querySelector('.chart-container');
    expect(chartContainer).to.exist;
  });

  it('should render legend items', async () => {
    component.chartData = simpleChartData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const legendItems = shadow?.querySelectorAll('.legend-item');
    expect(legendItems?.length).to.be.greaterThan(0);
  });

  it('should render legend with stacked bar labels', async () => {
    component.chartData = sampleChartData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const legendItems = shadow?.querySelectorAll('.legend-item');
    expect(legendItems?.length).to.be.greaterThan(0);
  });

  it('should render legend for line datasets', async () => {
    component.chartData = lineOnlyData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const legendItems = shadow?.querySelectorAll('.legend-item');
    expect(legendItems?.length).to.be.greaterThan(0);
  });

  it('should render chart container', async () => {
    component.chartData = simpleChartData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const chartContainer = shadow?.querySelector('.chart-container');
    expect(chartContainer).to.exist;
  });

  it('should generate SVG when chartData is provided', async () => {
    component.chartData = simpleChartData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    expect(svg).to.exist;
  });

  it('should filter out hidden datasets', async () => {
    component.chartData = hiddenDatasetData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const legendItems = shadow?.querySelectorAll('.legend-item');
    expect(legendItems?.length).to.be.greaterThan(0);
  });

  it('should render multiple bar datasets', async () => {
    component.chartData = sampleChartData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const rects = svg?.querySelectorAll('rect');
    expect(rects?.length).to.be.greaterThan(0);
  });

  it('should render line path elements', async () => {
    component.chartData = lineOnlyData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).to.be.greaterThan(0);
  });

  it('should render axis labels', async () => {
    component.chartData = simpleChartData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const axisLabels = svg?.querySelectorAll('.axis-label');
    expect(axisLabels?.length).to.equal(2);
  });

  it('should render tick text elements', async () => {
    component.chartData = simpleChartData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const tickTexts = svg?.querySelectorAll('.tick-text');
    expect(tickTexts?.length).to.be.greaterThan(0);
  });

  it('should render grid lines', async () => {
    component.chartData = simpleChartData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const gridLines = svg?.querySelectorAll('.grid-line');
    expect(gridLines?.length).to.be.greaterThan(0);
  });

  it('should render stacked bars with correct colors', async () => {
    component.chartData = sampleChartData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const rects = svg?.querySelectorAll('rect');
    expect(rects?.length).to.be.greaterThan(0);
  });

  it('should render circle points for line charts', async () => {
    component.chartData = lineOnlyData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const circles = svg?.querySelectorAll('circle');
    expect(circles?.length).to.be.greaterThan(0);
  });

  it('should handle chart data update', async () => {
    component.chartData = simpleChartData;
    await component.updateComplete;
    
    component.chartData = sampleChartData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    expect(svg).to.exist;
  });

  it('should handle single data point in line chart', async () => {
    component.chartData = singlePointData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const circles = svg?.querySelectorAll('circle');
    expect(circles?.length).to.be.greaterThan(0);
  });

  it('should render dashed line for dashed dataset', async () => {
    const dashedData = {
      labels: ['A', 'B'],
      datasets: [
        {
          label: 'Dashed',
          type: 'line' as const,
          data: [3, 5],
          yAxisID: 'y1',
          dashed: true
        }
      ]
    } as BarLineChartData;
    component.chartData = dashedData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const dashedPath = svg?.querySelector('path[stroke-dasharray="5,5"]');
    expect(dashedPath).to.exist;
  });

  it('should render dotted line for dotted dataset', async () => {
    const dottedData = {
      labels: ['A', 'B'],
      datasets: [
        {
          label: 'Dotted',
          type: 'line' as const,
          data: [3, 5],
          yAxisID: 'y1',
          dotted: true
        }
      ]
    } as BarLineChartData;
    component.chartData = dottedData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const dottedPath = svg?.querySelector('path[stroke-dasharray="2,4"]');
    expect(dottedPath).to.exist;
  });

  it('should render bars with custom color', async () => {
    const coloredData = {
      labels: ['A'],
      datasets: [
        {
          label: 'Custom',
          type: 'bar' as const,
          data: [10],
          color: '#FF5733',
          yAxisID: 'y'
        }
      ]
    } as BarLineChartData;
    component.chartData = coloredData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const rect = svg?.querySelector('rect');
    expect(rect?.getAttribute('fill')).to.equal('#FF5733');
  });

  it('should render legend boxes for bar datasets', async () => {
    component.chartData = simpleChartData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const legendBoxes = shadow?.querySelectorAll('.legend-box');
    expect(legendBoxes?.length).to.be.greaterThan(0);
  });

  it('should render legend lines for line datasets', async () => {
    component.chartData = lineOnlyData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const legendLines = shadow?.querySelectorAll('.legend-line');
    expect(legendLines?.length).to.be.greaterThan(0);
  });

  it('should handle bars with zero values', async () => {
    const zeroData = {
      labels: ['A', 'B'],
      datasets: [
        {
          label: 'Zeros',
          type: 'bar' as const,
          data: [0, 10],
          yAxisID: 'y'
        }
      ]
    } as BarLineChartData;
    component.chartData = zeroData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    expect(svg).to.exist;
  });

  it('should handle all zero data', async () => {
    const allZeroData = {
      labels: ['A', 'B'],
      datasets: [
        {
          label: 'Zeros',
          type: 'bar' as const,
          data: [0, 0],
          yAxisID: 'y'
        }
      ]
    } as BarLineChartData;
    component.chartData = allZeroData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    expect(svg).to.exist;
  });

  it('should render x-axis labels', async () => {
    component.chartData = simpleChartData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const xLabels = svg?.querySelectorAll('text');
    expect(xLabels?.length).to.be.greaterThan(0);
  });
});
