import { ComponentGroupButton, type GroupButtonOption } from './componentGroupButton';
import { accessibilityCheck, createComponent, defer } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';

describe('GroupButton Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  const defaultOptions: GroupButtonOption[] = [
    { text: 'Option 1', id: '1', active: true },
    { text: 'Option 2', id: '2', active: false },
    { text: 'Option 3', id: '3', active: false },
  ];

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentGroupButton,
      name: 'component-group-button',
      properties: { options: JSON.stringify(defaultOptions) }
    });

    shadow = component.shadow;
    element = component.element;

    await (element as ComponentGroupButton).updateComplete;
  });

  afterEach(() => {
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
  });

  it('should contain shadow root', () => {
    expect(shadow).to.not.be.undefined;
  });

  it('should render correct number of buttons', () => {
    const buttons = shadow.querySelectorAll('.group-button');
    expect(buttons.length).to.equal(3);
  });

  it('should render button text correctly', () => {
    const buttons = shadow.querySelectorAll('.group-button');
    expect(buttons[0].textContent?.trim()).to.equal('Option 1');
    expect(buttons[1].textContent?.trim()).to.equal('Option 2');
    expect(buttons[2].textContent?.trim()).to.equal('Option 3');
  });

  it('should apply active class to the correct button', () => {
    const buttons = shadow.querySelectorAll('.group-button');
    expect(buttons[0].classList.contains('active')).to.be.true;
    expect(buttons[1].classList.contains('active')).to.be.false;
    expect(buttons[2].classList.contains('active')).to.be.false;
  });

  it('should dispatch group-button-click event on click', (done) => {
    const buttons = shadow.querySelectorAll('button');
    const secondButton = buttons[1];

    element.addEventListener('group-button-click', (e: any) => {
      expect(e.detail.id).to.equal('2');
      done();
    });

    secondButton.click();
  });

  it('should be accessible', async () => {
    const result = await accessibilityCheck(element);
    expect(result.length).to.be.equal(0);
  });

  it('should update rendering when options change', (done) => {
    const newOptions = [
      { text: 'New 1', id: 'n1', active: false },
      { text: 'New 2', id: 'n2', active: true }
    ];
    element.setAttribute('options', JSON.stringify(newOptions));

    defer(() => {
      const buttons = shadow.querySelectorAll('.group-button');
      expect(buttons.length).to.equal(2);
      expect(buttons[1].classList.contains('active')).to.be.true;
      expect(buttons[1].textContent?.trim()).to.equal('New 2');
      done();
    });

  });
});
