import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index';
import type { SearchInputComponentInterface } from './componentSearchInput';

const meta: Meta = {
  title: 'Components/ComponentSearchInput',
  component: 'component-search-input',
  argTypes: {
    'search-init': { action: 'search-init' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<SearchInputComponentInterface>;

export default meta;

type Story = StoryObj<SearchInputComponentInterface>;

export const Default: Story = {
  args: {
    placeholder: 'Search',
  },
  render: (args) => html`<component-search-input placeholder="${args.placeholder}"></component-search-input>`,
};
