import './index';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import {overrideApi} from '../../shared/test-helper';
import type { PageExampleInterface } from './pageExample';

const api = {
  getData: (): any => new Promise(resolve => resolve({ data: 'data example!' })),
};

const render = (_args: any) => {
  const element = document.createElement('page-example');
  overrideApi(element, api);
  return element;
}

const meta = {
  title: 'Pages/page-component',
  tags: ['autodocs'],
  render,
} satisfies Meta<PageExampleInterface>;

export default meta;
type Story = StoryObj<PageExampleInterface>;

export const pageExample: Story = {
  args: {
    bottomText: 'bottom text example',
    count: 0,
  },
  render
};
