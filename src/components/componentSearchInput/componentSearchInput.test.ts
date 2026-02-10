import { ComponentSearchInput } from './componentSearchInput';
import { accessibilityCheck, createComponent, defer } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';

describe('SearchInput Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentSearchInput,
      name: 'component-search-input'
    });

    shadow = component.shadow;
    element = component.element;
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should contain shadow root', () => {
    expect(shadow).to.not.be.undefined;
  });

  it('should initialize with default properties', () => {
    const searchInput = element as ComponentSearchInput;
    expect(searchInput.value).to.equal('');
    expect(searchInput.placeholder).to.equal('');
  });

  it('should render input and button', () => {
    const input = shadow.querySelector('input');
    const button = shadow.querySelector('button');
    expect(input).to.exist;
    expect(button).to.exist;
  });

  it('should reflect properties to attributes/DOM', async () => {
    element.setAttribute('value', 'Test Value');
    element.setAttribute('placeholder', 'Search here...');

    // waiting for lit update
    await (element as ComponentSearchInput).updateComplete;

    const input = shadow.querySelector('input');
    expect(input?.value).to.equal('Test Value');
    expect(input?.placeholder).to.equal('Search here...');
  });

  it('should be accessible', async () => {
    const result = await accessibilityCheck(element);
    expect(result.length).to.be.equal(0);
  });

  it('should update value property on input', () => {
    const input = shadow.querySelector('input')!;
    input.value = 'New Value';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect((element as ComponentSearchInput).value).to.equal('New Value');
  });

  it('should dispatch search-init event on blur if value changed', (done) => {
    const input = shadow.querySelector('input')!;

    element.addEventListener('search-init', (e: any) => {
      expect(e.detail.query).to.equal('Search Term');
      done();
    });

    // Simulate input
    input.value = 'Search Term';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    // Simulate blur
    input.dispatchEvent(new Event('blur'));
  });

  it('should dispatch search-init event on button click if value changed', (done) => {
    const input = shadow.querySelector('input')!;
    const button = shadow.querySelector('button')!;

    element.addEventListener('search-init', (e: any) => {
      expect(e.detail.query).to.equal('Button Search');
      done();
    });

    // Simulate input
    input.value = 'Button Search';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    // Simulate click
    button.click();
  });

  it('should not dispatch search-init if value has not changed', (done) => {
    let callCount = 0;
    const input = shadow.querySelector('input')!;

    element.addEventListener('search-init', () => {
      callCount++;
    });

    // First search
    input.value = 'Same Value';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    input.dispatchEvent(new Event('blur'));

    defer(() => {
      expect(callCount).to.equal(1);

      // Attempt second search with same value
      input.dispatchEvent(new Event('blur'));

      defer(() => {
        expect(callCount).to.equal(1); // Should still be 1
        done();
      });
    });
  });
});
