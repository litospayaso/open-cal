import './index';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import type { ComponentExampleInterface } from './componentExample';

// import MyElement from './myElement';

const meta = {
  title: 'Components/component-example',
  tags: ['autodocs'],
  render: (_args: any) => html`
    <component-example></component-example>
  `,
} satisfies Meta<ComponentExampleInterface>;

export default meta;
type Story = StoryObj<ComponentExampleInterface>;

export const myElement: Story = {
  args: {
    bottomText: 'bottom text example',
    count: '0',
  },
  render: (args) => html`<component-example count="${args.count}" bottomText="${args.bottomText}"></component-example>`
};
