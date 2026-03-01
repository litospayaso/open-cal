import './index';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { mockQueryParams } from '../../shared/test-helper';

const render = (args: any) => {
  const element = document.createElement('page-meal');
  mockQueryParams(element, { page: 'meal', id: args.id });
  return element;
}

const meta = {
  title: 'Pages/PageMeal',
  tags: ['autodocs'],
  render,
  args: {
    id: 'new',
  },
  argTypes: {
    id: { control: 'text' }
  }
} satisfies Meta<any>;

export default meta;
type Story = StoryObj;

export const NewMeal: Story = {
  render,
  args: {
    id: 'new'
  }
};

export const EditMeal: Story = {
  render,
  args: {
    id: 'existing-id'
  }
};
