import { html } from 'lit';
import './index';

export default {
  title: 'Components/BarLineChart',
  component: 'component-bar-line-chart',
  argTypes: {
    chartData: { control: 'object' },
  },
};

const Template = (args: any) => html`
  <component-bar-line-chart
    .chartData=${args.chartData}
  ></component-bar-line-chart>
`;

export const Default = Template.bind({});
// @ts-ignore
Default.args = {
  chartData: {
    labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
    datasets: [
      {
        label: 'Consumidas',
        type: 'bar',
        data: [2700, 2650, 2450, 2680, 2580, 2700, 2100],
        yAxisID: 'y'
        // Default color will be --calories-color
      },
      {
        label: 'Quemadas total',
        type: 'bar',
        data: [
          [2100, 400],
          [2000, 380],
          [2000, 600],
          [2000, 440],
          [2000, 340],
          [2000, 520],
          [1700, 100]
        ],
        stackLabels: ['Basal', 'Deporte'],
        yAxisID: 'y'
        // Default colors will be --palette-grey and --palette-blue
      },
      {
        label: 'Nivel de Energía',
        type: 'line',
        data: [3.5, 3.2, 4.1, 3.6, 4.3, 2.8, 3.4],
        yAxisID: 'y1'
        // Default color will be --palette-green
      },
      {
        label: 'Nivel de Saciedad',
        type: 'line',
        data: [3.1, 2.9, 2.5, 2.8, 3.2, 3.8, 3.3],
        yAxisID: 'y1',
        dotted: true
      }
    ]
  },
};
