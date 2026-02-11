import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index';
import PageUser from './pageUser';

const meta: Meta = {
  title: 'Pages/PageUser',
  component: 'page-user',
} satisfies Meta<PageUser>;

export default meta;

type Story = StoryObj<PageUser>;

export const Default: Story = {
  render: () => {
    return html`<page-user></page-user>`;
  }
};
