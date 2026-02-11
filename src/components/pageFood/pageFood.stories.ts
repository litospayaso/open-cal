import './index';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { mockQueryParams } from '../../shared/test-helper';

const render = (args: any) => {
  const element = document.createElement('page-food');
  mockQueryParams(element, { page: 'food', code: args.code });
  return element;
}

const meta = {
  title: 'Pages/PageFood',
  tags: ['autodocs'],
  render,
  args: {
    code: '8480000221940',
  },
} satisfies Meta<any>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render
};
