import './index';
import type { Meta, StoryObj } from '@storybook/web-components-vite';


const render = () => {
  const element = document.createElement('page-opencal');
  return element;
}

const meta = {
  title: 'App/PageOpenCal',
  tags: ['autodocs'],
  render,
} satisfies Meta<any>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render
};
