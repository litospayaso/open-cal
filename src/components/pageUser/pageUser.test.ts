import PageUser from './pageUser';
import { createComponent } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';

describe('PageUser Component Spec:', () => {
  let element: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(async () => {
    localStorage.clear();
    const component = await createComponent({
      class: PageUser,
      name: 'page-user'
    });
    shadow = component.shadow;
    element = component.element;
  });

  afterEach(() => {
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
    localStorage.clear();
  });

  it('should contain shadow root', () => {
    localStorage.clear();
    expect(shadow).to.not.be.undefined;
  });

  it('should initialize with default values if no storage', () => {
    const pageUser = element as PageUser;
    expect(pageUser.height).to.equal(0);
    expect(pageUser.weight).to.equal(0);
    expect(pageUser.gender).to.equal('male');
    expect(pageUser.dailyCalories).to.equal(2000);
  });

  it('should migrate legacy storage', async () => {
    localStorage.clear();
    localStorage.setItem('userHs', '180');
    localStorage.setItem('userWs', '80');

    const component = await createComponent({
      class: PageUser,
      name: 'page-user-migration-' + Math.random().toString(36).substring(7)
    });
    const pageUser = component.element as PageUser;

    expect(pageUser.height).to.equal(180);
    expect(pageUser.weight).to.equal(80);

    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    expect(profile.height).to.equal(180);
    expect(profile.weight).to.equal(80);
  });

  it('should save profile on input change', async () => {
    const inputs = shadow.querySelectorAll('input');
    const heightInput = Array.from(inputs).find(i => i.placeholder === 'e.g. 175') as HTMLInputElement;

    if (heightInput) {
      heightInput.value = '175';
      heightInput.dispatchEvent(new Event('input'));

      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      expect(profile.height).to.equal(175);
    } else {
      throw new Error('Height input not found');
    }
  });

  it('should save gender change', async () => {
    const genderSelect = shadow.querySelector('select') as HTMLSelectElement;
    if (genderSelect) {
      genderSelect.value = 'female';
      genderSelect.dispatchEvent(new Event('change'));

      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      expect(profile.gender).to.equal('female');
    } else {
      throw new Error('Gender select not found');
    }
  });

  it('should save nutritional goals', async () => {
    const inputs = shadow.querySelectorAll('input');
    const caloriesInput = Array.from(inputs).find(i => i.placeholder === 'e.g. 2000') as HTMLInputElement;

    if (caloriesInput) {
      caloriesInput.value = '2500';
      caloriesInput.dispatchEvent(new Event('input'));

      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      expect(profile.goals.calories).to.equal(2500);
    } else {
      throw new Error('Calories input not found');
    }
  });
});
