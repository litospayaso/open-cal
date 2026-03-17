import { expect } from '@esm-bundle/chai';
import { createComponent } from '../../shared/test-helper';

import './index';
import ComponentShapeChart from './componentShapeChart';

const sampleRadarData = {
  labels: ['Sleep', 'Movement', 'Energy', 'Hunger', 'Nutrition'],
  datasets: [
    {
      label: 'Week Average',
      data: [7, 5, 6, 4, 7.5]
    }
  ]
};

const simpleRadarData = {
  labels: ['A', 'B', 'C'],
  datasets: [
    {
      label: 'Test',
      data: [5, 8, 3]
    }
  ]
};

const noLabelData = {
  labels: [],
  datasets: [
    {
      label: 'Test',
      data: [5, 8, 3]
    }
  ]
};

const noDatasetData = {
  labels: ['A', 'B', 'C'],
  datasets: []
};

const emptyData = {
  labels: [],
  datasets: []
};

const multipleDatasetsData = {
  labels: ['X', 'Y', 'Z'],
  datasets: [
    {
      label: 'Dataset 1',
      data: [5, 6, 7]
    },
    {
      label: 'Dataset 2',
      data: [3, 4, 5]
    }
  ]
};

describe('ComponentShapeChart Spec:', () => {
  let element: HTMLElement;
  let component: ComponentShapeChart;

  beforeEach(async () => {
    const comp = await createComponent({
      class: ComponentShapeChart,
      name: 'component-shape-chart'
    });
    element = comp.element;
    component = element as ComponentShapeChart;
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

  it('should show No Data message for empty labels', async () => {
    component.chartData = noLabelData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const noData = shadow?.querySelector('.chart-container');
    expect(noData?.innerHTML).to.include('No Data');
  });

  it('should show No Data message for no datasets', async () => {
    component.chartData = noDatasetData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const noData = shadow?.querySelector('.chart-container');
    expect(noData?.innerHTML).to.include('No Data');
  });

  it('should render chart container', async () => {
    component.chartData = simpleRadarData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const chartContainer = shadow?.querySelector('.chart-container');
    expect(chartContainer).to.exist;
  });

  it('should generate SVG when chartData is provided', async () => {
    component.chartData = simpleRadarData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    expect(svg).to.exist;
  });

  it('should render radar grid levels', async () => {
    component.chartData = simpleRadarData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const grids = svg?.querySelectorAll('.radar-grid');
    expect(grids?.length).to.equal(5);
  });

  it('should render radar axis lines', async () => {
    component.chartData = simpleRadarData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const axes = svg?.querySelectorAll('.radar-axis');
    expect(axes?.length).to.equal(3);
  });

  it('should render axis labels', async () => {
    component.chartData = simpleRadarData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const labels = svg?.querySelectorAll('.axis-label');
    expect(labels?.length).to.equal(3);
  });

  it('should render radar area polygon', async () => {
    component.chartData = simpleRadarData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const area = svg?.querySelector('.radar-area');
    expect(area).to.exist;
  });

  it('should render data points as circles', async () => {
    component.chartData = simpleRadarData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const circles = svg?.querySelectorAll('circle');
    expect(circles?.length).to.equal(3);
  });

  it('should render legend when datasets have labels', async () => {
    component.chartData = simpleRadarData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const legend = shadow?.querySelector('.legend');
    expect(legend).to.exist;
  });

  it('should not render legend when datasets have no labels', async () => {
    const noLabelDatasetData = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          label: '',
          data: [5, 6, 7]
        }
      ]
    };
    component.chartData = noLabelDatasetData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const legend = shadow?.querySelector('.legend');
    expect(legend).to.not.exist;
  });

  it('should render legend items', async () => {
    component.chartData = simpleRadarData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const legendItems = shadow?.querySelectorAll('.legend-item');
    expect(legendItems?.length).to.equal(1);
  });

  it('should render multiple legend items for multiple datasets', async () => {
    component.chartData = multipleDatasetsData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const legendItems = shadow?.querySelectorAll('.legend-item');
    expect(legendItems?.length).to.equal(2);
  });

  it('should handle chart data update', async () => {
    component.chartData = simpleRadarData;
    await component.updateComplete;
    
    component.chartData = sampleRadarData;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    expect(svg).to.exist;
  });

  it('should handle custom maxValue', async () => {
    component.chartData = simpleRadarData;
    component.maxValue = 20;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    expect(svg).to.exist;
  });

  it('should render with default maxValue of 10', async () => {
    component.chartData = simpleRadarData;
    await component.updateComplete;
    
    expect(component.maxValue).to.equal(10);
  });

  it('should render correct number of grid levels', async () => {
    component.chartData = simpleRadarData;
    component.maxValue = 10;
    await component.updateComplete;
    
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.chart-container svg');
    const grids = svg?.querySelectorAll('.radar-grid');
    expect(grids?.length).to.equal(5);
  });

  it('should update dimensions on resize', async () => {
    component.chartData = simpleRadarData;
    await component.updateComplete;
    
    window.dispatchEvent(new Event('resize'));
    
    expect(component._width).to.be.greaterThan(0);
  });
});
