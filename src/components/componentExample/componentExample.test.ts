import ExampleComponent from './componentExample';
import { accessibilityCheck, createComponent, defer } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';

describe('example-component Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  describe('Default example-component Component', () => {
    beforeEach(async () => {
      const component = await createComponent({
        class: ExampleComponent,
        name: 'component-example',
        properties: {
          count: '1',
        },
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

    it('The default value of the counter should be 0', () => {
      const counterValue = shadow.querySelector('button')?.textContent?.trim().split(' ').pop();
      console.log('%c counterValue', 'background: #df03fc; color: #f8fc03', counterValue);
      expect(
        Number(counterValue)
      ).to.be.equal(1);
    });

    it('On button click counter should be updated', (done) => {
      const button = shadow.querySelector('button') as HTMLButtonElement;
      button.click();
      defer(() => {
        const counterValue = button.textContent?.trim().split(' ').pop();
        expect(
          Number(counterValue)
        ).to.be.equal(2);
        done();
      });
    });

    afterEach(() => {
      document.body.removeChild(element);
    });
  });
});
