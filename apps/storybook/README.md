# storybook

The preview app for `@ds/react`. Workspace package name: `storybook-web`.

`.storybook/` holds the whole configuration; this app contains no stories of its own. The library
has at least one story per component, each showing the component assembled with placeholder content.
Four components are styled; the rest render with no styles.

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

`.storybook/preview.ts` imports the token stylesheet from the `tokens.css` subpath of the tokens package. That file is build
output, so the `dev` and `build` scripts of this app run the token build first.

The same file adds a **Theme** switch to the toolbar (light, dark) and a decorator that sets the
theme attribute on the root element and paints a page behind the story. The decorator is preview
scaffolding: its font family is a stand-in, because the system has no font-family token.

## What a story is for

Usage examples and the visible matrix of a component. A story that starts restating prop defaults or
token values has become a second copy that nothing keeps in step with the component.
