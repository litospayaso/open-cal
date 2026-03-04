import { html } from 'lit';
import './index';

export default {
  title: 'Components/ComponentUserStatus',
  component: 'component-user-status',
  argTypes: {
    exerciseCalories: { control: 'number' },
    basalCalories: { control: 'number' },
    steps: { control: 'number' },
    sleepHours: { control: 'number' },
    energyLevel: { control: { type: 'range', min: 0, max: 5 } },
    hungerLevel: { control: { type: 'range', min: 0, max: 5 } },
    theme: {
      control: 'radio',
      options: ['light', 'dark']
    }
  },
};

const Template = (args: any) => html`
  <component-user-status 
    data-theme="${args.theme === 'dark' ? 'dark' : 'light'}"
    .exerciseCalories="${args.exerciseCalories}"
    .basalCalories="${args.basalCalories}"
    .steps="${args.steps}"
    .sleepHours="${args.sleepHours}"
    .energyLevel="${args.energyLevel}"
    .hungerLevel="${args.hungerLevel}"
  ></component-user-status>
`;

export const Default = Template.bind({});
(Default as any).args = {
  exerciseCalories: 350,
  basalCalories: 1600,
  steps: 8500,
  sleepHours: 7.5,
  energyLevel: 4,
  hungerLevel: 2,
  theme: 'light'
};

export const DarkMode = Template.bind({});
(DarkMode as any).args = {
  exerciseCalories: 500,
  basalCalories: 1800,
  steps: 12000,
  sleepHours: 6,
  energyLevel: 3,
  hungerLevel: 4,
  theme: 'dark'
};

export const Empty = Template.bind({});
(Empty as any).args = {
  exerciseCalories: 0,
  basalCalories: 0,
  steps: 0,
  sleepHours: 0,
  energyLevel: 0,
  hungerLevel: 0,
  theme: 'light'
};
