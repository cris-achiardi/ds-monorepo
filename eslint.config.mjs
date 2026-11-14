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
    // Global: generated output is never linted. An `ignores` beside `files` only narrows that one
    // config object, and ESLint still lints a matching `.js` file with its defaults — which is how
    // a local `pnpm build:storybook` made `pnpm lint` fail on the bundle's own disable comments.
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/storybook-static/**'],
  },
  {
    files: ['**/*.mjs', '**/*.js'],
    ignores: [
      // A skill's asset is a paste-in prelude, not a module: `diagram-kit.js` is a library of
      // helpers copied into a `figma_execute` call one at a time, so every function in it being
      // unused within the file is the point of the file. Carried over from the template with the
      // skill.
      '.claude/skills/**/assets/**',
    ],
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
