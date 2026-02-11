import PageOpenCal from './pageOpenCal';
import { createComponent } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';


describe('PageOpenCal Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: PageOpenCal,
      name: 'page-opencal',
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

  it('should display default page without root', () => {
    const page = shadow.querySelector('page-search');
    expect(page).to.exist;
  });

});

describe('PageOpenCal Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: PageOpenCal,
      name: 'page-opencal',
      route: '?page=food'
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

  it('should display food page on food route', () => {
    const page = shadow.querySelector('page-food');
    expect(page).to.exist;
  });

});

describe('PageOpenCal Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: PageOpenCal,
      name: 'page-opencal',
      route: '?page=search'
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

  it('should display search page', () => {
    const page = shadow.querySelector('page-search');
    expect(page).to.exist;
  });

});

describe('PageOpenCal Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    const component = await createComponent({
      class: PageOpenCal,
      name: 'page-opencal',
      route: '?page=search'
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

  it('should display search page on search route', () => {
    const page = shadow.querySelector('page-search');
    expect(page).to.exist;
  });

});
