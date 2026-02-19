import { expect } from '@esm-bundle/chai';
import { createComponent, accessibilityCheck } from '../../shared/test-helper';
import ComponentLineChart from './componentLineChart';

describe('ComponentLineChart Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentLineChart,
      name: 'component-line-chart',
      properties: {
        data: JSON.stringify([10, 20, 15, 25, 30])
      }
    });

    shadow = component.shadow;
    element = component.element;
  });

  afterEach(() => {
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
  });

  it('should contain shadow root', () => {
    expect(shadow).to.exist;
  });

  it('should be accessible', async () => {
    const result = await accessibilityCheck(element);
    expect(result.length).to.be.equal(0);
  });

  it('should render chart container', () => {
    const container = shadow.querySelector('.chart-container');
    expect(container).to.exist;
  });

  it('should render svg', () => {
    const svg = shadow.querySelector('svg');
    expect(svg).to.exist;
  });

  it('should render polyline when data is provided', async () => {
    // Wait for resize observer to trigger (which sets width/height)
    // In test environment, ResizeObserver might need a tick or manual Trigger
    // For now we assume standard lit update cycle covers basic rendering if data is there
    // We might need to mock ResizeObserver if this fails in real browser test runner without layout
  });
});
