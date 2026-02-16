import './index';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { mockQueryParams } from '../../shared/test-helper';

const render = (args: any) => {
  const element = document.createElement('page-meal');
  // Mocking query params. 
  // 'new' for creating a new meal
  // or a uuid for editing (which would require mocking DB or localStorage state ideally, 
  // but for storybook pure view 'new' is safest default unless we mock DB)
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
    id: 'existing-id' // Takes 'new' logic if not found in DB/Validation
  }
};
