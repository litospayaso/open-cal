import { html } from 'lit';
import './index';

export default {
  title: 'Components/LineChart',
  component: 'component-line-chart',
  argTypes: {
    data: { control: 'array' },
    color: { control: 'color' },
  },
};

const Template = ({
  data = [],
  color = '',
}) => html`
  <div style="width: 500px; height: 300px; border: 1px solid #ddd; padding: 20px;">
    <component-line-chart
      .data=${data}
      .color=${color}
    ></component-line-chart>
  </div>
`;

export const Default = Template.bind({});
// @ts-ignore
Default.args = {
  data: [10, 20, 15, 25, 30, 5, 40],
  color: '',
};
