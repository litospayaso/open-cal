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
  data: [
    { tag: 'Mon', value: 60 },
    { tag: 'Tue', value: 61 },
    { tag: 'Wed', value: 65 },
    { tag: 'Thu', value: 63 },
    { tag: 'Fri', value: 62.5 },
    { tag: 'Sat', value: 62 },
    { tag: 'Sun', value: 61.5 }
  ],
};
