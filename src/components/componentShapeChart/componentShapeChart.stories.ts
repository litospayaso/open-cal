import './index';
import { html } from 'lit';

export default {
  title: 'Components/ShapeChart',
  component: 'component-shape-chart',
};

const Template = (args: any) => html`
  <div style="width: 400px; height: 400px; background: var(--background-color); padding: 20px; border-radius: 8px;">
    <component-shape-chart .chartData="${args.chartData}"></component-shape-chart>
  </div>
`;

export const Default = Template.bind({});
(Default as any).args = {
  chartData: {
    labels: ['Sueño', 'Movimiento', 'Energía', 'Saciedad', 'Nutrición'],
    datasets: [
      {
        data: [4, 3, 5, 2, 4],
      }
    ]
  }
};

export const SixAxes = Template.bind({});
(SixAxes as any).args = {
  chartData: {
    labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6'],
    datasets: [
      {
        label: 'Data Set',
        data: [1, 2, 3, 4, 5, 4],
      }
    ]
  }
};
