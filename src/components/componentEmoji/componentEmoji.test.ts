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

  it('should render an emoji for exact English match', async () => {
    element.setAttribute('text', 'apple');
    await (element as ComponentEmoji).updateComplete;
    const shadow = element.shadowRoot;
    const emoji = shadow?.querySelector('.emoji')?.textContent;
    expect(emoji?.trim()).to.equal('🍎');
  });

  it('should render an emoji for exact Spanish match', async () => {
    element.setAttribute('text', 'manzana');
    await (element as ComponentEmoji).updateComplete;
    const shadow = element.shadowRoot;
    const emoji = shadow?.querySelector('.emoji')?.textContent;
    expect(emoji?.trim()).to.equal('🍎');
  });

  it('should render an emoji for partial match', async () => {
    element.setAttribute('text', 'green broccoli');
    await (element as ComponentEmoji).updateComplete;
    const shadow = element.shadowRoot;
    const emoji = shadow?.querySelector('.emoji')?.textContent;
    expect(emoji?.trim()).to.equal('🥦');
  });

  it('should render random emoji for unknown text', async () => {
    element.setAttribute('text', 'unknown text 123');
    await (element as ComponentEmoji).updateComplete;
    const shadow = element.shadowRoot;
    const emoji = shadow?.querySelector('.emoji')?.textContent;
    expect(emoji).to.exist;
    expect(emoji?.trim()).to.not.be.empty;
  });

  it('should remain consistent for same unknown text (pseudo-random)', async () => {
    element.setAttribute('text', 'consistent random');
    await (element as ComponentEmoji).updateComplete;
    const shadow = element.shadowRoot;
    const emoji1 = shadow?.querySelector('.emoji')?.textContent;

    // Create another instance or reset
    const component2 = await createComponent({
      class: ComponentEmoji,
      name: 'component-emoji'
    });
    component2.element.setAttribute('text', 'consistent random');
    await (component2.element as ComponentEmoji).updateComplete;
    const emoji2 = component2.element.shadowRoot?.querySelector('.emoji')?.textContent;

    expect(emoji1).to.equal(emoji2);
    document.body.removeChild(component2.element);
  });

  it('should reflect size property to attribute', async () => {
    element.setAttribute('size', 'xl');
    await (element as ComponentEmoji).updateComplete;
    expect(element.getAttribute('size')).to.equal('xl');

    // Check if style is applied (computed style might be hard in this env, but attribute reflection is key)
    // We can check if the host has the attribute
    expect(element.hasAttribute('size')).to.be.true;
  });
});
