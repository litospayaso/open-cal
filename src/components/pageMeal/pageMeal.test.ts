// @ts-nocheck
import { expect } from '@esm-bundle/chai';
import { createComponent } from '../../shared/test-helper';

import './index';
import PageMeal from './pageMeal';

const sampleFood = {
  product: {
    code: '123',
    product_name: 'Test Product',
    brands: 'Test Brand',
    nutriments: { 'energy-kcal': 200, carbohydrates: 20, fat: 10, proteins: 5 },
    nutrition_data: 'per_serving',
    nutrition_data_per: 'serving',
    nutrition_data_prepared_per: 'serving'
  },
  quantity: 100,
  unit: 'g'
};

const sampleMeal = {
  id: 'meal1',
  name: 'Test Meal',
  description: 'Test description',
  foods: [sampleFood]
};

const createMockDb = (): any => ({
  init: () => Promise.resolve(),
  getMeal: () => Promise.resolve(sampleMeal),
  saveMeal: () => Promise.resolve(),
  deleteMeal: () => Promise.resolve(),
  deleteMealReference: () => Promise.resolve(),
  addFoodItem: () => Promise.resolve()
});

describe('PageMeal Spec:', () => {
  let element: HTMLElement;
  let component: PageMeal;

  beforeEach(async () => {
    const comp = await createComponent({
      class: PageMeal,
      name: 'page-meal',
      db: createMockDb()
    });
    element = comp.element;
    component = element as PageMeal;
  });

  afterEach(() => {
    if (element && element.parentNode) {
      document.body.removeChild(element);
    }
  });

  it('should contain shadow root', () => {
    expect(element.shadowRoot).to.exist;
  });

  it('should render page container', async () => {
    await component.updateComplete;
    const container = element.shadowRoot?.querySelector('.page-container');
    expect(container).to.exist;
  });

  it('should render header with h1', async () => {
    await component.updateComplete;
    const h1 = element.shadowRoot?.querySelector('.header-container h1');
    expect(h1).to.exist;
  });

  it('should render meal name input', async () => {
    await component.updateComplete;
    const nameInput = element.shadowRoot?.querySelector('input[type="text"]');
    expect(nameInput).to.exist;
  });

  it('should render meal description textarea', async () => {
    await component.updateComplete;
    const textarea = element.shadowRoot?.querySelector('textarea');
    expect(textarea).to.exist;
  });

  it('should render summary cards', async () => {
    await component.updateComplete;
    const summaryCards = element.shadowRoot?.querySelectorAll('.summary-card');
    expect(summaryCards?.length).to.equal(4);
  });

  it('should render calories card with correct class', async () => {
    await component.updateComplete;
    const caloriesCard = element.shadowRoot?.querySelector('.summary-card.calories');
    expect(caloriesCard).to.exist;
  });

  it('should render carbs card with correct class', async () => {
    await component.updateComplete;
    const carbsCard = element.shadowRoot?.querySelector('.summary-card.carbs');
    expect(carbsCard).to.exist;
  });

  it('should render fat card with correct class', async () => {
    await component.updateComplete;
    const fatCard = element.shadowRoot?.querySelector('.summary-card.fat');
    expect(fatCard).to.exist;
  });

  it('should render protein card with correct class', async () => {
    await component.updateComplete;
    const proteinCard = element.shadowRoot?.querySelector('.summary-card.protein');
    expect(proteinCard).to.exist;
  });

  it('should render foods section header', async () => {
    await component.updateComplete;
    const h3 = element.shadowRoot?.querySelector('h3');
    expect(h3).to.exist;
  });

  it('should render foods list container', async () => {
    await component.updateComplete;
    const foodsList = element.shadowRoot?.querySelector('.foods-list');
    expect(foodsList).to.exist;
  });

  it('should render add food button', async () => {
    await component.updateComplete;
    const addButton = element.shadowRoot?.querySelectorAll('.btn');
    expect(addButton?.length).to.be.greaterThan(0);
  });

  it('should render add to diary container', async () => {
    await component.updateComplete;
    const container = element.shadowRoot?.querySelector('.add-to-diary-container');
    expect(container).to.exist;
  });

  it('should render category select', async () => {
    await component.updateComplete;
    const select = element.shadowRoot?.querySelector('select#category');
    expect(select).to.exist;
  });

  it('should render date input', async () => {
    await component.updateComplete;
    const dateInput = element.shadowRoot?.querySelector('input[type="date"]');
    expect(dateInput).to.exist;
  });

  it('should have default state values', () => {
    expect(component.isNew).to.be.true;
    expect(component.error).to.equal('');
  });

  it('should calculate totals from foods', async () => {
    component.meal = sampleMeal;
    await component.updateComplete;
    const caloriesCard = element.shadowRoot?.querySelector('.summary-card.calories .value');
    expect(caloriesCard?.textContent).to.equal('200');
  });

  it('should render food items when foods exist', async () => {
    component.meal = sampleMeal;
    await component.updateComplete;
    const foodItems = element.shadowRoot?.querySelectorAll('component-search-result');
    expect(foodItems?.length).to.equal(1);
  });

  it('should render empty foods message when no foods', async () => {
    component.meal = { ...component.meal, foods: [] };
    await component.updateComplete;
    const emptyMsg = element.shadowRoot?.querySelector('.empty-foods');
    expect(emptyMsg).to.exist;
  });
});
