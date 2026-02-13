import PageSearch from './pageSearch';
import { accessibilityCheck, createComponent } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';

const mockApi = {
  searchProduct: () => Promise.resolve({ products: [{ code: '12345', product_name: 'Test Product' }] }),
};

describe('SearchPage Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: PageSearch,
      name: 'page-search',
      api: mockApi
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

  xit('should be accessible', async () => {
    const result = await accessibilityCheck(element);
    expect(result.length).to.be.equal(0);
  });

  it('should display the product when search is initiated', async () => {
    const searchInput = shadow.querySelector('component-search-input');
    expect(searchInput).to.exist;

    searchInput?.dispatchEvent(new CustomEvent('search-init', {
      detail: { query: 'test' },
      bubbles: true,
      composed: true
    }));

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    const resultItem = shadow.querySelector('component-search-result');
    expect(resultItem).to.exist;
    expect(resultItem?.getAttribute('name')).to.include('Test Product');
  });
});
