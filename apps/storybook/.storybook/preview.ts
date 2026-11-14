import { createElement } from 'react';
import type { Preview } from '@storybook/react-vite';

// The token stylesheet: every custom property the components read. Built by `@ds/tokens`.
import '@ds/tokens/tokens.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    layout: 'fullscreen',
  },
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    // PREVIEW SCAFFOLDING, not part of the system. It sets the theme and paints a page behind the
    // story.
    //
    // The theme attribute goes on the root element, not on a wrapper: a popup is portaled to
    // `<body>`, outside any wrapper, and would keep the default theme (ADR 0009).
    //
    // The font family is a stand-in: there is no font-family token, and the browser default is a
    // serif.
    (Story, context) => {
      document.documentElement.setAttribute('data-ds-theme', String(context.globals.theme));
      Object.assign(document.body.style, {
        margin: '0',
        background: 'var(--ds-color-bg-page)',
        color: 'var(--ds-color-text-primary)',
        fontFamily: 'system-ui, sans-serif',
      });
      return createElement(
        'div',
        { style: { padding: 'var(--ds-spacing-24)' } },
        createElement(Story),
      );
    },
  ],
};

export default preview;
