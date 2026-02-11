import { html } from 'lit';
import './index';
import type { Meta } from '@storybook/web-components-vite';
import type { ComponentEmojiProps } from './componentEmoji';

export default {
  title: 'Components/ComponentEmoji',
  component: 'component-emoji',
  argTypes: {
    text: { control: 'text' },
    size: {
      control: 'select',
      options: ['xs', 's', 'm', 'l', 'xl'],
    },
  },
  args: {
    text: 'apple',
    size: 'm',
  },
} satisfies Meta<ComponentEmojiProps>;

export const Default = (props: ComponentEmojiProps) => html`
  <component-emoji text="${props.text}" size="${props.size}"></component-emoji>
`;
