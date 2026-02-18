import { ComponentProgressBar } from './componentProgressBar';
import { expect } from '@esm-bundle/chai';
import { createComponent } from '../../shared/test-helper';
import { translations } from '../../shared/translations';

describe('ComponentProgressBar Spec:', () => {
  let element: HTMLElement;
  let componentInstance: ComponentProgressBar;

  beforeEach(async () => {
    const component = await createComponent({
      class: ComponentProgressBar,
      name: 'component-progress-bar'
    });

    element = component.element;
    componentInstance = element as ComponentProgressBar;
    componentInstance.translations = JSON.stringify(translations.en);
    await componentInstance.updateComplete;
  });

  afterEach(() => {
    if (element && element.parentNode) {
      document.body.removeChild(element);
    }
  });

  it('should render with default values', async () => {
    await componentInstance.updateComplete;
    const shadow = element.shadowRoot;
    const label = shadow?.querySelector('div.label');
    expect(label?.textContent).to.contain('0 / 0 kcal eated'); // default 0 goal
  });

  it('should display correct calorie counts', async () => {
    componentInstance.dailyCaloriesGoal = 2000;
    componentInstance.caloriesEaten = 1500;
    await componentInstance.updateComplete;

    const shadow = element.shadowRoot;
    const label = shadow?.querySelector('div.label');
    expect(label?.textContent).to.contain('1500 / 2000 kcal eated');
  });

  it('should calculate segment widths correctly', async () => {
    componentInstance.dailyCaloriesGoal = 1000;
    componentInstance.caloriesEaten = 500;
    componentInstance.fatEaten = 20;
    componentInstance.carbsEaten = 50;
    componentInstance.proteinEaten = 30;

    await componentInstance.updateComplete;
    const shadow = element.shadowRoot;

    const fatSegment = shadow?.querySelector('.segment.fat') as HTMLElement;
    const carbsSegment = shadow?.querySelector('.segment.carbs') as HTMLElement;
    const proteinSegment = shadow?.querySelector('.segment.protein') as HTMLElement;

    const fatWidth = parseFloat(fatSegment.style.width);
    const carbsWidth = parseFloat(carbsSegment.style.width);
    const proteinWidth = parseFloat(proteinSegment.style.width);

    expect(fatWidth).to.be.closeTo(18, 0.1);
    expect(carbsWidth).to.be.closeTo(20, 0.1);
    expect(proteinWidth).to.be.closeTo(12, 0.1);
    expect(fatWidth + carbsWidth + proteinWidth).to.be.closeTo(50, 0.1);
  });

  it('should update when properties change', async () => {
    componentInstance.dailyCaloriesGoal = 2000;
    await componentInstance.updateComplete;

    componentInstance.caloriesEaten = 200;
    await componentInstance.updateComplete;

    const shadow = element.shadowRoot;
    const label = shadow?.querySelector('div.label');
    expect(label?.textContent).to.contain('200 / 2000');
  });
});
