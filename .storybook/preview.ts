import type { Preview } from '@storybook/web-components-vite'
import variablesCss from '../src/shared/variables.css?raw';

const injectVariablesCss = () => {
  const style = document.createElement('style');
  style.textContent = variablesCss;
  document.head.appendChild(style);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectVariablesCss);
} else {
  injectVariablesCss();
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;