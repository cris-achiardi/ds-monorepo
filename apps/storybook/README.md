# storybook

The preview app for `@ds/react`. Workspace package name: `storybook-web`.

It is in the install graph and ships with **zero stories**, because the library has zero components.
`.storybook/` holds the whole configuration; this app contains no stories of its own.

## Running it

```bash
pnpm dev:storybook                                        # http://localhost:6006
STORYBOOK_PORT=4400 pnpm --filter=storybook-web dev       # a different port
pnpm build:storybook                                      # static build into storybook-static/
```

`dev.mjs` is the launcher behind the `dev` script. It exists only to read `STORYBOOK_PORT` in a way
that also works on Windows.

## What lives where

Stories sit **next to the component they document**, not in this app:

```
packages/react/src/**/<Name>.stories.tsx
```

`.storybook/main.ts` globs them from there. `@ds/react` resolves to the package's source through the
workspace link, so a story hot-reloads against the component being edited, with no build step in
between.

`.storybook/preview.ts` is where the token stylesheet gets imported once `packages/tokens` produces
one. Until then components render with no system styles.

## What a story is for

Usage examples and the visible matrix of a component. A story that starts restating prop defaults or
token values has become a second copy that nothing keeps in step with the component.
