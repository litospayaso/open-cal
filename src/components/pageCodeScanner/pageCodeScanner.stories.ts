import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import './index';

const meta: Meta = {
  title: 'Pages/PageCodeScanner',
  component: 'page-code-scanner',
  argTypes: {
    'page-navigation': { action: 'page-navigation' },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="width: 100%; height: 600px; position: relative;">
      <page-code-scanner></page-code-scanner>
    </div>
  `,
};

export const WithoutPermission: Story = {
  render: () => {
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = () => Promise.reject(new Error('Permission denied'));

    return html`
      <div style="width: 100%; height: 600px; position: relative;">
        <page-code-scanner></page-code-scanner>
      </div>
    `;
  },
};

export const NotSupported: Story = {
  render: () => {
    const originalBarcodeDetector = (window as any).BarcodeDetector;
    (window as any).BarcodeDetector = undefined;

    return html`
      <div style="width: 100%; height: 600px; position: relative;">
        <page-code-scanner></page-code-scanner>
      </div>
    `;
  }
};
