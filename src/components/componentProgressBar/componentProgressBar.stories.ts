import { html } from 'lit';
import './index';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { ComponentProgressBarProps } from './componentProgressBar';
import { translations } from '../../shared/translations';

const meta: Meta<ComponentProgressBarProps> = {
  title: 'Components/ComponentProgressBar',
  component: 'component-progress-bar',
  argTypes: {
    dailyCaloriesGoal: { control: 'number' },
    caloriesEaten: { control: 'number' },
    fatEaten: { control: 'number' },
    carbsEaten: { control: 'number' },
    proteinEaten: { control: 'number' },
    fatGoalPercent: { control: 'number' },
    carbsGoalPercent: { control: 'number' },
    proteinGoalPercent: { control: 'number' },
  },
  args: {
    dailyCaloriesGoal: 2000,
    caloriesEaten: 0,
    fatEaten: 0,
    carbsEaten: 0,
    proteinEaten: 0,
    fatGoalPercent: 30,
    carbsGoalPercent: 50,
    proteinGoalPercent: 20,
  },
  render: (args) => {
    const language = window.localStorage.getItem('language') || 'en';
    return html`
      <component-progress-bar
        .dailyCaloriesGoal=${args.dailyCaloriesGoal}
        .caloriesEaten=${args.caloriesEaten}
        .fatEaten=${args.fatEaten}
        .carbsEaten=${args.carbsEaten}
        .proteinEaten=${args.proteinEaten}
        .fatGoalPercent=${args.fatGoalPercent}
        .carbsGoalPercent=${args.carbsGoalPercent}
        .proteinGoalPercent=${args.proteinGoalPercent}
        .translations=${JSON.stringify(translations[language as keyof typeof translations])}
      ></component-progress-bar>
    `;
  },
};
export default meta;

type Story = StoryObj<ComponentProgressBarProps>;

export const Empty: Story = {
  args: {
    caloriesEaten: 0,
    fatEaten: 0,
    carbsEaten: 0,
    proteinEaten: 0,
  },
};

export const Partial: Story = {
  args: {
    caloriesEaten: 1000,
    fatEaten: 40,
    carbsEaten: 100,
    proteinEaten: 60,
  },
};

export const Full: Story = {
  args: {
    caloriesEaten: 2000,
    fatEaten: 70,
    carbsEaten: 250,
    proteinEaten: 100,
  },
};

export const OverLimit: Story = {
  args: {
    caloriesEaten: 2500,
    fatEaten: 100,
    carbsEaten: 250,
    proteinEaten: 150,
  },
};
