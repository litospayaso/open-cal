import './index';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { mockQueryParams } from '../../shared/test-helper';

const render = (_args: any) => {
  const element = document.createElement('page-food');
  mockQueryParams(element, { page: 'food', code: '8480000221940' });
  return element;
}

const meta = {
  title: 'Pages/PageFood',
  tags: ['autodocs'],
  render,
  parameters: {
    // Mocking URL parameters for Storybook? 
    // Usually requires an addon or specific setup. 
    // For now, simple render.
  }
} satisfies Meta<any>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render
};
