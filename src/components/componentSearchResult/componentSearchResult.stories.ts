import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './index';

import type { SearchResultComponentInterface } from './componentSearchResult';

type Story = StoryObj<SearchResultComponentInterface>;

export default {
  title: 'Components/ComponentSearchResult',
  component: 'component-search-result',
  argTypes: {
    name: { control: 'text' },
    calories: { control: 'text' },
    favorite: { control: 'boolean' },
  },
  render: (args) => html`<component-search-result name="${args.name}" calories="${args.calories}" favorite="${args.favorite}"></component-search-result>`
} satisfies Meta<SearchResultComponentInterface>;

export const Default: Story = {
  args: {
    name: 'Apple',
    calories: '64',
    favorite: false,
  },
  render: (args) => html`<component-search-result name="${args.name}" calories="${args.calories}" favorite="${args.favorite}"></component-search-result>`
};

