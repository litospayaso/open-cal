import PageUser from './pageUser';
import { createComponent } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';

describe('PageUser Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: PageUser,
      name: 'page-user',
    });

    shadow = component.shadow;
    element = component.element;
  });

  afterEach(() => {
    document.body.removeChild(element);
    localStorage.clear();
  });

  it('should contain shadow root', () => {
    expect(shadow).to.not.be.undefined;
  });

  it('should render height and weight inputs', () => {
    const heightInput = shadow.querySelector('input[placeholder*="175"]');
    const weightInput = shadow.querySelector('input[placeholder*="70"]');
    expect(heightInput).to.exist;
    expect(weightInput).to.exist;
  });

  it('should save height to localStorage', () => {
    const heightInput = shadow.querySelector('input[placeholder*="175"]') as HTMLInputElement;
    heightInput.value = '180';
    heightInput.dispatchEvent(new Event('input'));
    expect(localStorage.getItem('userHs')).to.equal('180');
  });

  it('should toggle theme', () => {
    const darkButton = shadow.querySelectorAll('.theme-toggles button')[1] as HTMLButtonElement;
    darkButton.click();
    expect(localStorage.getItem('theme')).to.equal('dark');
  });
});
