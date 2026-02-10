import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index';

const meta: Meta = {
  title: 'Pages/PageSearch',
  component: 'page-search',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`<page-search></page-search>`,
};
