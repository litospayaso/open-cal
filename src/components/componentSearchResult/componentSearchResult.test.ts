import { ComponentSearchResult } from './componentSearchResult';
import { accessibilityCheck, createComponent, defer } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';

describe('SearchResult Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentSearchResult,
      name: 'component-search-result',
      properties: {
        name: 'Test Food',
        isFavorite: 'false'
      }
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

  it('should be accessible', async () => {
    const result = await accessibilityCheck(element);
    expect(result.length).to.be.equal(0);
  });

  it('should display the food name', () => {
    const nameSection = shadow.querySelector('.name-section');
    expect(nameSection).to.exist;
    expect(nameSection?.textContent).to.include('Test Food');
  });

  it('should not show favorite icon active by default', () => {
    const favoriteIcon = shadow.querySelector('.favorite-icon');
    expect(favoriteIcon?.classList.contains('is-favorite')).to.be.false;
  });

  it('should show favorite icon active when isFavorite is true', (done) => {
    element.setAttribute('isFavorite', 'true');
    defer(() => {
      const favoriteIcon = shadow.querySelector('.favorite-icon');
      expect(favoriteIcon?.classList.contains('is-favorite')).to.be.true;
      done();
    });
  });
});
