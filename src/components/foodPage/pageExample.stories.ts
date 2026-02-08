import './index';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

// import {overrideApi} from '../../shared/test-helper';
import type { FoodPageInterface } from './foodPage';

// const api = {
//   getData: (): any => new Promise(resolve => resolve({ data: 'data example!' })),
// };

const render = (_args: any) => {
  const element = document.createElement('food-page');
  // overrideApi(element, api);
  return element;
}

const meta = {
  title: 'Pages/food-page',
  tags: ['autodocs'],
  render,
} satisfies Meta<FoodPageInterface>;

export default meta;
type Story = StoryObj<FoodPageInterface>;

export const pageExample: Story = {
  args: {
    bottomText: 'bottom text example',
    count: 0,
  },
  render
};
