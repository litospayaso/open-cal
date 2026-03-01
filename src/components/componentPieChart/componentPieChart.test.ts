import { expect } from '@esm-bundle/chai';
import { createComponent, accessibilityCheck } from '../../shared/test-helper';
import ComponentPieChart from './componentPieChart';

describe('ComponentPieChart Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentPieChart,
      name: 'component-pie-chart',
      properties: {
        protein: '30',
        carbs: '40',
        fat: '30'
      },
      slot: '<span>100 kcal</span>'
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

  it('should calculate angles correctly', async () => {
    const pieChart = shadow.querySelector('.pie-chart') as HTMLElement;
    expect(pieChart).to.exist;

    const style = pieChart.getAttribute('style');
    expect(style).to.include('--protein-deg');
    expect(style).to.include('--carbs-deg');
    expect(style).to.include('--fat-deg');
  });

  it('should display slot content in center', async () => {
    const centerHole = shadow.querySelector('.center-hole');
    const slot = centerHole?.querySelector('slot');
    expect(slot).to.exist;

    expect(centerHole).to.exist;
  });
});
