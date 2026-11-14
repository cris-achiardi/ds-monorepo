/**
 * Deliberately narrow: this config finds DEAD CODE in plain JavaScript and nothing else.
 *
 * `.mjs` and `.js` files are not typechecked by anything, so an unused import or an orphaned
 * constant in a script is invisible to every other gate. TypeScript under `packages/` is already
 * covered by `pnpm typecheck` with `noUnusedLocals`.
 *
 * It stays this small on purpose: a gate that fails on everything on day one gets switched off,
 * and a switched-off gate protects nothing. Adding a rule is a deliberate act — do it when a
 * defect gets through that the rule would have caught, and say which one in the commit.
 */

export default [
  {
    files: ['**/*.mjs', '**/*.js'],
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/storybook-static/**'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
    },
    linterOptions: {
      // An unused disable comment is itself dead code.
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];
