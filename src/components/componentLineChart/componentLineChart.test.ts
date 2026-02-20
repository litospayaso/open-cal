import { expect } from '@esm-bundle/chai';
import { createComponent, accessibilityCheck, defer } from '../../shared/test-helper';
import ComponentLineChart from './componentLineChart';
import './index';

describe('ComponentLineChart Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentLineChart,
      name: 'component-line-chart',
      properties: {
        data: JSON.stringify([
          { tag: 'A', value: 10 },
          { tag: 'B', value: 20 },
          { tag: 'C', value: 15 },
          { tag: 'D', value: 25 },
          { tag: 'E', value: 30 }
        ])
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

  xit('should be accessible', async () => {
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

  it('should render path when data is provided', (done) => {
    defer(() => {
      const path = shadow.querySelector('path');
      expect(path).to.exist;
      done();
    });
  });

  it('should display y and x axis with correct values', (done) => {
    defer(() => {
      const y = shadow.querySelectorAll('[text-anchor="start"]') ? (shadow.querySelectorAll('[text-anchor="start"]') as unknown as NodeList)[0] : null;
      const x = shadow.querySelectorAll('[text-anchor="start"]') ? (shadow.querySelectorAll('[text-anchor="start"]') as unknown as NodeList)[shadow.querySelectorAll('[text-anchor="start"]').length - 1] : null;
      expect(y).to.exist;
      expect(x).to.exist;
      expect(y?.textContent?.trim()).to.equal('30');
      expect(x?.textContent?.trim()).to.equal('A');
      done();
    });
  });

});
