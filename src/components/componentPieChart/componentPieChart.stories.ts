import { html } from 'lit';
import './index';

export default {
  title: 'Components/PieChart',
  component: 'component-pie-chart',
  argTypes: {
    padding: { control: 'number' },
    protein: { control: 'number' },
    carbs: { control: 'number' },
    fat: { control: 'number' },
    calories: { control: 'number' },
  },
};

const Template = ({
  protein = 0,
  carbs = 0,
  fat = 0,
  calories = 0,
}) => html`
  <component-pie-chart
    .protein=${protein}
    .carbs=${carbs}
    .fat=${fat}
  >
    <div style="display: flex; flex-direction: column; align-items: center;">
      <span style="font-weight: bold; font-size: 1.2rem;">${calories}</span>
      <span style="font-size: 0.8rem; color: #666;">kcal</span>
    </div>
  </component-pie-chart>
`;

export const Default = Template.bind({});

export const Filled = Template.bind({});
// @ts-ignore
Filled.args = {
  protein: 30,
  carbs: 40,
  fat: 30,
  calories: 500,
};
