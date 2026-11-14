import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Stories live next to the component they document, not in this app.
  stories: ['../../../packages/react/src/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: { name: '@storybook/react-vite', options: {} },
};

export default config;
