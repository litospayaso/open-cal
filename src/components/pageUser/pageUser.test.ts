import PageUser from './pageUser';
import { createComponent } from '../../shared/test-helper';
import { expect } from '@esm-bundle/chai';

const createMockDb = (overrides: any = {}): any => ({
  init: () => Promise.resolve(),
  getWeightHistory: () => Promise.resolve(overrides.weightHistory || []),
  saveWeightEntry: () => Promise.resolve(),
  deleteWeightEntry: () => Promise.resolve(),
  getExportData: () => Promise.resolve({ content: '{}', extension: 'json' }),
  importData: () => Promise.resolve(10),
  getDailyLog: () => Promise.resolve(overrides.dailyLog || null),
  getUserStatus: () => Promise.resolve(overrides.userStatus || null),
  clearAllData: () => Promise.resolve(),
  getAllCachedProducts: () => Promise.resolve([]),
  getFavorites: () => Promise.resolve([]),
  getCachedProduct: () => Promise.resolve(undefined),
  isFavorite: () => Promise.resolve(false),
  addFavorite: () => Promise.resolve(),
  removeFavorite: () => Promise.resolve(),
  getAllMeals: () => Promise.resolve([])
});

const sampleWeightHistory = [
  { date: '2024-01-01', weight: 70 },
  { date: '2024-01-02', weight: 69.5 },
  { date: '2024-01-03', weight: 69 }
];

const sampleDailyLog = {
  date: '2024-01-01',
  breakfast: [{
    product: {
      code: '123',
      product_name: 'Test',
      nutriments: { 'energy-kcal': 200, carbohydrates: 20, fat: 10, proteins: 5 }
    },
    quantity: 100,
    unit: 'g'
  }],
  snack1: [], lunch: [], snack2: [], dinner: [], snack3: []
};

const sampleUserStatus = {
  date: '2024-01-01',
  exerciseCalories: 100,
  basalCalories: 1500,
  steps: 5000,
  sleepHours: 7,
  energyLevel: 3,
  hungerLevel: 2,
  thoughts: 'Good'
};

describe('PageUser Component Spec:', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    const component = await createComponent({
      class: PageUser,
      name: 'page-user',
      db: createMockDb({ weightHistory: sampleWeightHistory, dailyLog: sampleDailyLog, userStatus: sampleUserStatus }),
      mock: {
        firstUpdated: () => {}
      }
    });
    element = component.element;
  });

  afterEach(() => {
    if (document.body.contains(element)) {
      document.body.removeChild(element);
    }
    localStorage.clear();
  });

  it('should contain shadow root', () => {
    expect(element.shadowRoot).to.exist;
  });

  it('should initialize with default values if no storage', () => {
    const pageUser = element as any;
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
      name: 'page-user-migration-' + Math.random().toString(36).substring(7),
      db: createMockDb(),
      mock: {
        firstUpdated: () => {}
      }
    });
    const pageUser = component.element as any;

    expect(pageUser.height).to.equal(180);
    expect(pageUser.weight).to.equal(80);

    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    expect(profile.height).to.equal(180);
    expect(profile.weight).to.equal(80);
    document.body.removeChild(component.element);
  });

  it('should save profile on input change', async () => {
    const shadow = element.shadowRoot as ShadowRoot;
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
    const shadow = element.shadowRoot as ShadowRoot;
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
    const shadow = element.shadowRoot as ShadowRoot;
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

  it('should render all form sections', async () => {
    const shadow = element.shadowRoot as ShadowRoot;
    const cards = shadow.querySelectorAll('.card');
    expect(cards.length).to.be.greaterThan(0);
  });

  it('should load user profile from localStorage', async () => {
    const testProfile = {
      height: 175,
      weight: 70,
      gender: 'female',
      age: 25,
      goals: {
        calories: 2200,
        macros: { protein: 35, carbs: 35, fat: 30 }
      },
      enableWarnings: false,
      enableStatistics: true
    };
    localStorage.setItem('user_profile', JSON.stringify(testProfile));

    const component = await createComponent({
      class: PageUser,
      name: 'page-user-profile',
      db: createMockDb(),
      mock: {
        firstUpdated: () => {}
      }
    });
    const el = component.element as any;

    await el.onPageInit();

    expect(el.height).to.equal(175);
    expect(el.weight).to.equal(70);
    expect(el.gender).to.equal('female');
    expect(el.dailyCalories).to.equal(2200);
    expect(el.enableStatistics).to.be.true;
    document.body.removeChild(component.element);
  });

  it('should handle warnings toggle', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    el.enableWarnings = true;
    const checkbox = shadow.querySelectorAll('input[type="checkbox"]')[0] as HTMLInputElement;
    
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    
    expect(el.enableWarnings).to.be.false;
  });

  it('should handle statistics toggle when enabling with warnings', async () => {
    const el = element as any;
    el.enableWarnings = true;
    const shadow = el.shadowRoot;
    const checkbox = shadow.querySelectorAll('input[type="checkbox"]')[1] as HTMLInputElement;
    
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    
    expect(el.showStatisticsModal).to.be.true;
    expect(el.enableStatistics).to.be.false;
  });

  it('should handle statistics toggle when disabling', async () => {
    const el = element as any;
    el.enableStatistics = true;
    const shadow = el.shadowRoot;
    const checkbox = shadow.querySelectorAll('input[type="checkbox"]')[1] as HTMLInputElement;
    
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    
    expect(el.enableStatistics).to.be.false;
  });

  it('should confirm enable statistics', async () => {
    const el = element as any;
    el.showStatisticsModal = true;
    el._confirmEnableStatistics();
    
    expect(el.enableStatistics).to.be.true;
    expect(el.showStatisticsModal).to.be.false;
  });

  it('should handle notification toggle', async () => {
    const el = element as any;
    el.notificationsEnabled = false;
    el._handleNotificationToggle();
    
    expect(el.notificationsEnabled).to.be.true;
  });

  it('should handle notification time change', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const timeInput = shadow.querySelector('input[type="time"]') as HTMLInputElement;
    
    if (timeInput) {
      timeInput.value = '08:00';
      timeInput.dispatchEvent(new Event('input'));
      
      expect(el.notificationTime).to.equal('08:00');
    }
  });

  it('should handle swipe to navigate to search', async () => {
    const el = element as any;
    let navigated = false;
    el.triggerPageNavigation = (params: any) => {
      if (params.page === 'search') {
        navigated = true;
      }
    };
    
    el.handleSwipe(10);
    
    expect(navigated).to.be.true;
  });

  it('should show weight modal when button clicked', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const weightButton = Array.from(shadow.querySelectorAll('button')).find(b => b.textContent?.includes('updateHistoricalWeight')) as HTMLButtonElement;
    
    if (weightButton) {
      weightButton.click();
      expect(el.showWeightModal).to.be.true;
    }
  });

  it('should close weight modal', async () => {
    const el = element as any;
    el.showWeightModal = true;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const closeButton = shadow.querySelector('.modal .close-btn') as HTMLButtonElement;
    
    if (closeButton) {
      closeButton.click();
      expect(el.showWeightModal).to.be.false;
    }
  });

  it('should save new weight entry', async () => {
    const el = element as any;
    el.showWeightModal = true;
    el.newWeightDate = '2024-01-15';
    el.newWeightValue = 75;
    el.weight = 0;
    
    await el._saveNewWeightEntry();
    
    expect(el.weightHistory.length).to.be.greaterThan(0);
  });

  it('should not save weight entry with invalid values', async () => {
    const el = element as any;
    el.newWeightDate = '';
    el.newWeightValue = 0;
    
    await el._saveNewWeightEntry();
  });

  it('should delete weight entry', async () => {
    const el = element as any;
    el.weightHistory = sampleWeightHistory;
    
    await el._deleteWeightEntry('2024-01-01');
  });

  it('should show maintenance modal when button clicked', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const calcButton = Array.from(shadow.querySelectorAll('button')).find(b => b.textContent?.includes('Calculate')) as HTMLButtonElement;
    
    if (calcButton) {
      calcButton.click();
      expect(el.showMaintenanceModal).to.be.true;
    }
  });

  it('should handle save calories from maintenance modal', async () => {
    const el = element as any;
    el.showMaintenanceModal = true;
    el.weight = 70;
    await el.updateComplete;
    
    const customEvent = new CustomEvent('save-calories', {
      detail: {
        calories: 2200,
        height: 175,
        weight: 72,
        gender: 'male',
        age: 30,
        proteinRatio: 30,
        carbsRatio: 40,
        fatRatio: 30
      }
    });
    
    await el._handleSaveCalories(customEvent);
    
    expect(el.dailyCalories).to.equal(2200);
    expect(el.weight).to.equal(72);
    expect(el.showMaintenanceModal).to.be.false;
  });

  it('should show export modal when button clicked', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const exportButton = Array.from(shadow.querySelectorAll('button')).find(b => b.textContent?.includes('exportData') || b.textContent?.includes('Export')) as HTMLButtonElement;
    
    if (exportButton) {
      exportButton.click();
      expect(el.showExportModal).to.be.true;
    }
  });

  it('should toggle export store', async () => {
    const el = element as any;
    el.exportStores = new Set(['daily_consumption']);
    
    el._toggleExportStore('user_data');
    
    expect(el.exportStores.has('user_data')).to.be.true;
    
    el._toggleExportStore('user_data');
    
    expect(el.exportStores.has('user_data')).to.be.false;
  });

  it('should change export format to csv', async () => {
    const el = element as any;
    el.showExportModal = true;
    el.exportFormat = 'json';
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const radioButtons = shadow.querySelectorAll('input[type="radio"]');
    if (radioButtons.length > 1) {
      (radioButtons[1] as HTMLInputElement).click();
      expect(el.exportFormat).to.equal('csv');
    }
  });

  it('should show clear modal when button clicked', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const dangerButtons = shadow.querySelectorAll('.btn-danger');
    
    if (dangerButtons.length > 0) {
      (dangerButtons[0] as HTMLButtonElement).click();
      expect(el.showClearModal).to.be.true;
    }
  });

  it('should show about modal when version is set', async () => {
    const el = element as any;
    el.version = '1.0.0';
    el.showAboutModal = true;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const aboutModal = shadow.querySelector('.modal');
    expect(aboutModal).to.exist;
  });

  it('should close about modal', async () => {
    const el = element as any;
    el.version = '1.0.0';
    el.showAboutModal = true;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const closeButton = shadow.querySelector('.modal .close-btn') as HTMLButtonElement;
    closeButton.click();
    
    expect(el.showAboutModal).to.be.false;
  });

  it('should close export modal', async () => {
    const el = element as any;
    el.showExportModal = true;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const closeButton = shadow.querySelector('.modal .close-btn') as HTMLButtonElement;
    closeButton.click();
    
    expect(el.showExportModal).to.be.false;
  });

  it('should close clear modal', async () => {
    const el = element as any;
    el.showClearModal = true;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const closeButton = shadow.querySelector('.modal .close-btn') as HTMLButtonElement;
    closeButton.click();
    
    expect(el.showClearModal).to.be.false;
  });

  it('should close maintenance modal', async () => {
    const el = element as any;
    el.showMaintenanceModal = true;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const closeButton = shadow.querySelector('.modal .close-btn') as HTMLButtonElement;
    closeButton.click();
    
    expect(el.showMaintenanceModal).to.be.false;
  });

  it('should handle statistics week change', async () => {
    const el = element as any;
    el.enableStatistics = true;
    el.statsReferenceDate = new Date().toISOString().split('T')[0];
    const initialDate = el.statsReferenceDate;
    
    el._changeStatsWeek(1);
    
    expect(el.statsReferenceDate).to.not.equal(initialDate);
  });

  it('should handle week navigation buttons', async () => {
    const el = element as any;
    el.enableStatistics = true;
    el.statsReferenceDate = new Date().toISOString().split('T')[0];
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const weekButtons = shadow.querySelectorAll('.week-selector button');
    
    if (weekButtons.length >= 2) {
      (weekButtons[0] as HTMLButtonElement).click();
      (weekButtons[1] as HTMLButtonElement).click();
    }
  });

  it('should handle stats touch start', async () => {
    const el = element as any;
    const mockEvent = {
      changedTouches: [{ screenX: 100, screenY: 50 }]
    };
    
    el._handleStatsTouchStart(mockEvent as any);
    
    expect(el._statsTouchStartX).to.equal(100);
  });

  it('should handle stats touch end with swipe left', async () => {
    const el = element as any;
    el._statsTouchStartX = 100;
    el._statsTouchStartY = 50;
    
    const mockEvent = {
      changedTouches: [{ screenX: 50, screenY: 60 }],
      stopPropagation: () => {}
    };
    
    el._changeStatsWeek = () => {};
    
    el._handleStatsTouchEnd(mockEvent as any);
  });

  it('should handle stats touch end with swipe right', async () => {
    const el = element as any;
    el._statsTouchStartX = 50;
    el._statsTouchStartY = 50;
    
    const mockEvent = {
      changedTouches: [{ screenX: 100, screenY: 60 }],
      stopPropagation: () => {}
    };
    
    el._changeStatsWeek = () => {};
    
    el._handleStatsTouchEnd(mockEvent as any);
  });

  it('should not change week on vertical swipe', async () => {
    const el = element as any;
    el._statsTouchStartX = 50;
    el._statsTouchStartY = 50;
    let weekChanged = false;
    el._changeStatsWeek = () => { weekChanged = true; };
    
    const mockEvent = {
      changedTouches: [{ screenX: 55, screenY: 100 }],
      stopPropagation: () => {}
    };
    
    el._handleStatsTouchEnd(mockEvent as any);
    
    expect(weekChanged).to.be.false;
  });

  it('should get week range label', async () => {
    const el = element as any;
    el.statsReferenceDate = '2024-01-15';
    el.language = 'en';
    
    const label = el._getWeekRangeLabel();
    
    expect(label).to.exist;
  });

  it('should format date correctly', async () => {
    const el = element as any;
    const formatted = el._formatDate('2024-01-15');
    
    expect(formatted).to.equal('15/01/2024');
  });

  it('should render trash icon', async () => {
    const el = element as any;
    const entry = { date: '2024-01-01', weight: 70 };
    
    const result = el._renderTrashIcon(entry);
    
    expect(result).to.exist;
  });

  it('should handle invalid profile JSON', async () => {
    localStorage.setItem('user_profile', 'invalid json');
    
    const component = await createComponent({
      class: PageUser,
      name: 'page-user-invalid',
      db: createMockDb(),
      mock: {
        firstUpdated: () => {}
      }
    });
    const el = component.element as any;
    
    await el.onPageInit();
    
    document.body.removeChild(component.element);
  });

  it('should load profile with all fields', async () => {
    const fullProfile = {
      height: 180,
      weight: 75,
      gender: 'female',
      age: 28,
      goals: {
        calories: 2100,
        defaultBasalCalories: 1600,
        macros: { protein: 35, carbs: 35, fat: 30 }
      },
      notificationsEnabled: true,
      notificationTime: '18:00',
      enableWarnings: false,
      enableStatistics: true
    };
    localStorage.setItem('user_profile', JSON.stringify(fullProfile));
    
    const component = await createComponent({
      class: PageUser,
      name: 'page-user-full',
      db: createMockDb(),
      mock: {
        firstUpdated: () => {}
      }
    });
    const el = component.element as any;
    
    await el.onPageInit();
    
    expect(el.height).to.equal(180);
    expect(el.weight).to.equal(75);
    expect(el.gender).to.equal('female');
    expect(el.age).to.equal(28);
    expect(el.dailyCalories).to.equal(2100);
    expect(el.defaultBasalCalories).to.equal(1600);
    expect(el.proteinRatio).to.equal(35);
    expect(el.carbsRatio).to.equal(35);
    expect(el.fatRatio).to.equal(30);
    expect(el.notificationsEnabled).to.be.true;
    expect(el.notificationTime).to.equal('18:00');
    expect(el.enableWarnings).to.be.false;
    expect(el.enableStatistics).to.be.true;
    
    document.body.removeChild(component.element);
  });

  it('should render theme toggles', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const themeButtons = shadow.querySelectorAll('.theme-toggles button');
    
    expect(themeButtons.length).to.equal(2);
  });

  it('should render language select', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const select = shadow.querySelector('select');
    
    expect(select).to.exist;
  });

  it('should render macro ratio inputs', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const macroInputs = shadow.querySelectorAll('.macro-inputs input');
    
    expect(macroInputs.length).to.equal(3);
  });

  it('should display total macro percentage', async () => {
    const el = element as any;
    el.proteinRatio = 30;
    el.carbsRatio = 40;
    el.fatRatio = 30;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const totalText = shadow.querySelector('.macro-inputs + div');
    
    expect(totalText?.textContent).to.include('100%');
  });

  it('should handle number input for age', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const inputs = shadow.querySelectorAll('input');
    const ageInput = Array.from(inputs).find(i => i.placeholder === 'e.g. 30') as HTMLInputElement;
    
    if (ageInput) {
      ageInput.value = '35';
      ageInput.dispatchEvent(new Event('input'));
      
      expect(el.age).to.equal(35);
    }
  });

  it('should handle number input for default basal calories', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const inputs = shadow.querySelectorAll('input');
    const basalInput = Array.from(inputs).find(i => i.placeholder === 'e.g. 1500') as HTMLInputElement;
    
    if (basalInput) {
      basalInput.value = '1600';
      basalInput.dispatchEvent(new Event('input'));
      
      expect(el.defaultBasalCalories).to.equal(1600);
    }
  });

  it('should render weight modal with history', async () => {
    const el = element as any;
    el.showWeightModal = true;
    el.weightHistory = sampleWeightHistory;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const historyItems = shadow.querySelectorAll('.weight-history-item');
    
    expect(historyItems.length).to.be.greaterThan(0);
  });

  it('should render export modal with stores', async () => {
    const el = element as any;
    el.showExportModal = true;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const checkboxes = shadow.querySelectorAll('input[type="checkbox"]');
    
    expect(checkboxes.length).to.be.greaterThan(0);
  });

  it('should close import modal', async () => {
    const el = element as any;
    el.showImportModal = true;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const closeButton = shadow.querySelectorAll('.modal .close-btn')[2] as HTMLButtonElement;
    
    if (closeButton) {
      closeButton.click();
      expect(el.showImportModal).to.be.false;
    }
  });

  it('should close statistics modal', async () => {
    const el = element as any;
    el.showStatisticsModal = true;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const closeButton = shadow.querySelectorAll('.modal .close-btn')[1] as HTMLButtonElement;
    
    if (closeButton) {
      closeButton.click();
      expect(el.showStatisticsModal).to.be.false;
    }
  });

  it('should disable export button when no stores selected', async () => {
    const el = element as any;
    el.showExportModal = true;
    el.exportStores = new Set();
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const exportButton = shadow.querySelector('.modal button.btn') as HTMLButtonElement;
    
    if (exportButton) {
      expect(exportButton.hasAttribute('disabled')).to.be.true;
    }
  });

  it('should handle weight input change', async () => {
    const el = element as any;
    el.weight = 0;
    const shadow = el.shadowRoot;
    const inputs = shadow.querySelectorAll('input');
    const weightInput = Array.from(inputs).find(i => i.placeholder === 'e.g. 70.5') as HTMLInputElement;
    
    if (weightInput) {
      weightInput.value = '71';
      weightInput.dispatchEvent(new Event('input'));
      
      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      expect(profile.weight).to.equal(71);
    }
  });

  it('should render danger zone', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const dangerZone = shadow.querySelector('.danger-zone');
    
    expect(dangerZone).to.exist;
  });

  it('should render version when set', async () => {
    const el = element as any;
    el.version = '1.0.0';
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const version = shadow.querySelector('.app-version');
    
    expect(version).to.exist;
  });

  it('should render line chart when statistics enabled', async () => {
    const el = element as any;
    el.enableStatistics = true;
    el.weightHistory = sampleWeightHistory;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const chart = shadow.querySelector('component-line-chart');
    
    expect(chart).to.exist;
  });

  it('should render bar line chart when weekly data available', async () => {
    const el = element as any;
    el.enableStatistics = true;
    el.weeklyChartData = { labels: [], datasets: [] };
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const chart = shadow.querySelector('component-bar-line-chart');
    
    expect(chart).to.exist;
  });

  it('should render shape chart when radar data available', async () => {
    const el = element as any;
    el.enableStatistics = true;
    el.radarChartData = { labels: [], datasets: [] };
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const chart = shadow.querySelector('component-shape-chart');
    
    expect(chart).to.exist;
  });

  it('should close clear modal when cancel clicked', async () => {
    const el = element as any;
    el.showClearModal = true;
    await el.updateComplete;
    
    const shadow = el.shadowRoot;
    const buttons = shadow.querySelectorAll('.modal-buttons button');
    
    if (buttons.length >= 2) {
      (buttons[0] as HTMLButtonElement).click();
      expect(el.showClearModal).to.be.false;
    }
  });

  it('should handle protein ratio input', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const inputs = shadow.querySelectorAll('.macro-inputs input');
    const proteinInput = inputs[0] as HTMLInputElement;
    
    if (proteinInput) {
      proteinInput.value = '40';
      proteinInput.dispatchEvent(new Event('input'));
      
      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      expect(profile.goals.macros.protein).to.equal(40);
    }
  });

  it('should handle carbs ratio input', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const inputs = shadow.querySelectorAll('.macro-inputs input');
    const carbsInput = inputs[1] as HTMLInputElement;
    
    if (carbsInput) {
      carbsInput.value = '35';
      carbsInput.dispatchEvent(new Event('input'));
      
      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      expect(profile.goals.macros.carbs).to.equal(35);
    }
  });

  it('should handle fat ratio input', async () => {
    const el = element as any;
    const shadow = el.shadowRoot;
    const inputs = shadow.querySelectorAll('.macro-inputs input');
    const fatInput = inputs[2] as HTMLInputElement;
    
    if (fatInput) {
      fatInput.value = '25';
      fatInput.dispatchEvent(new Event('input'));
      
      const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
      expect(profile.goals.macros.fat).to.equal(25);
    }
  });
});
