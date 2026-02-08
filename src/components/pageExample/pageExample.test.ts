import PageExample from './pageExample';
import { accessibilityCheck, createComponent } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';

const api = {
  getData: (): any => new Promise(resolve => resolve({ data: 'data example!' })),
};

describe('example-component Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  describe('Default example-component Component', () => {
    beforeEach(async () => {
      const component = await createComponent({
        class: PageExample,
        name: 'page-example',
        api
      });

      shadow = component.shadow;
      element = component.element;
    });

    it('should contain shadow root', () => {
      expect(shadow).to.not.be.undefined;
    });

    it('should be accessible', async () => {
      const result = await accessibilityCheck(element);
      expect(result.length).to.be.equal(0);
    });

    it('The page should display the api response', () => {
      const apiData = shadow.querySelector('span')?.textContent?.trim();
      expect(
        apiData
      ).to.be.equal('data example!');
    });

    afterEach(() => {
      document.body.removeChild(element);
    });
  });
});
