import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import './index'; // Import the component

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
    // Mock navigator.mediaDevices.getUserMedia to fail
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = () => Promise.reject(new Error('Permission denied'));

    // Restore after render (this is tricky in stories, might affect others if not careful)
    // Ideally use a decorator or just let it fail naturally if the user blocks it.

    return html`
      <div style="width: 100%; height: 600px; position: relative;">
        <page-code-scanner></page-code-scanner>
      </div>
    `;
  },
};

export const NotSupported: Story = {
  render: () => {
    // Mock BarcodeDetector missing
    const originalBarcodeDetector = (window as any).BarcodeDetector;
    (window as any).BarcodeDetector = undefined;

    return html`
      <div style="width: 100%; height: 600px; position: relative;">
        <page-code-scanner></page-code-scanner>
      </div>
    `;
  }
};
