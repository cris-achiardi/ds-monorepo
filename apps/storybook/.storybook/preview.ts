import type { Preview } from '@storybook/react-vite';

// The token stylesheet is imported here once `packages/tokens` produces one.

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
  },
};

export default preview;
