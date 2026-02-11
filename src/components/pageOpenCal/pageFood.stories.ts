import './index';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { mockQueryParams } from '../../shared/test-helper';

const render = (args: any) => {
  const element = document.createElement('page-opencal');
  mockQueryParams(element, { page: args.route, code: '8480000221940' });
  return element;
}

const meta = {
  title: 'Pages/PageOpenCal',
  tags: ['autodocs'],
  render,
  argTypes: {
    route: { control: 'radio', options: ['search', 'food', 'default'] },
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render
};
