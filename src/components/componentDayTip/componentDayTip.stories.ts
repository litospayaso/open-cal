import { html } from 'lit';
import './index';

export default {
  title: 'Components/ComponentDayTip',
  component: 'component-day-tip',
  argTypes: {
    language: {
      control: 'select',
      options: ['es', 'en', 'it', 'fr', 'de']
    },
  },
};

const Template = (args: any) => html`
  <component-day-tip 
    .language="${args.language}"
  ></component-day-tip>
`;

export const Default = Template.bind({});
(Default as any).args = {
  language: 'en',
};

