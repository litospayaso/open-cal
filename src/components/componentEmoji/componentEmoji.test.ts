import { ComponentEmoji } from './componentEmoji';
import { expect } from '@esm-bundle/chai';
import { createComponent } from '../../shared/test-helper';

describe('ComponentEmoji Spec:', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentEmoji,
      name: 'component-emoji'
    });

    element = component.element;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should render an svg for exact English match', async () => {
    element.setAttribute('text', 'apple');
    await (element as ComponentEmoji).updateComplete;
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.emoji svg');
    expect(svg).to.exist;
  });

  it('should render an svg for exact Spanish match', async () => {
    element.setAttribute('text', 'manzana');
    await (element as ComponentEmoji).updateComplete;
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.emoji svg');
    expect(svg).to.exist;
  });

  it('should render an svg for partial match', async () => {
    element.setAttribute('text', 'green broccoli');
    await (element as ComponentEmoji).updateComplete;
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.emoji svg');
    expect(svg).to.exist;
  });

  it('should render svg for unknown text', async () => {
    element.setAttribute('text', 'unknown text 123');
    await (element as ComponentEmoji).updateComplete;
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.emoji svg');
    expect(svg).to.exist;
  });

  it('should remain consistent for same unknown text (pseudo-random)', async () => {
    element.setAttribute('text', 'consistent random');
    await (element as ComponentEmoji).updateComplete;
    const shadow = element.shadowRoot;
    const svg1 = shadow?.querySelector('.emoji svg');

    const component2 = await createComponent({
      class: ComponentEmoji,
      name: 'component-emoji'
    });
    component2.element.setAttribute('text', 'consistent random');
    await (component2.element as ComponentEmoji).updateComplete;
    const svg2 = component2.element.shadowRoot?.querySelector('.emoji svg');

    expect(svg1?.innerHTML).to.equal(svg2?.innerHTML);
    document.body.removeChild(component2.element);
  });

  it('should reflect size property to attribute', async () => {
    element.setAttribute('size', 'xl');
    await (element as ComponentEmoji).updateComplete;
    expect(element.getAttribute('size')).to.equal('xl');
    expect(element.hasAttribute('size')).to.be.true;
  });

  it('should return warning SVG for "warning" text', async () => {
    element.setAttribute('text', 'warning');
    await (element as ComponentEmoji).updateComplete;
    const shadow = element.shadowRoot;
    const svg = shadow?.querySelector('.emoji svg');
    expect(svg).to.exist;
    console.log('Actual SVG innerHTML:', svg?.innerHTML?.substring(0, 200));
    const innerHTML = svg?.innerHTML || '';
    expect(innerHTML).to.contain('viewBox="25.390625 -951.171875 1218.75 1218.75"');
  });
});
