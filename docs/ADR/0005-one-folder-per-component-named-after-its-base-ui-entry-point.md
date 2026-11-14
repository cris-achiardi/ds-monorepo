# ADR 0005 — One folder per component, named after its Base UI entry point

- **Status:** Draft
- **Date:** 2026-11-14
- **Deciders:** cris
- **Tags:** components
- **Related:** [ADR 0003 — `@ds/react` depends on `@base-ui/react` and re-exports each component entry point unchanged](./0003-the-library-re-exports-base-ui-entry-points-unchanged.md)

## Context

`packages/react/README.md` listed folder layout and file naming under `src/` as undecided, with the
warning not to let the first file set the convention by accident. On 2026-11-14, 42 modules landed
at once (38 components and 4 utilities, see
[ADR 0003](./0003-the-library-re-exports-base-ui-entry-points-unchanged.md)), so whatever layout
they use is the convention from that point on.

Two existing constraints bear on it. `apps/storybook/.storybook/main.ts` globs
`packages/react/src/**/*.stories.@(ts|tsx)`, and `apps/storybook/README.md` requires a story to sit
next to the component it documents.

## Decision

1. Each module lives in `packages/react/src/<entry>/`, where `<entry>` is the kebab-case name of the
   Base UI entry point it covers (`alert-dialog`, `number-field`).
2. The module file is named after the main export of that entry point, in that export's own casing:
   `AlertDialog.ts`, `OTPField.ts`, `useRender.ts`.
3. The story is `<Name>.stories.tsx` in the same folder. Utilities with nothing to render have no
   story.
4. Files that belong to one component (its stylesheet, its tests) go in that component's folder.
5. `packages/react/src/index.ts` has one `export *` line per module and nothing else.

## Contract

| Concern        | Where                                         |
| -------------- | --------------------------------------------- |
| The layout     | `packages/react/src/`                         |
| The barrel     | `packages/react/src/index.ts`                 |
| The story glob | `apps/storybook/.storybook/main.ts`           |
| Enforcement    | None. The layout is a convention, not a gate. |

## Consequences

**Positive**

- A folder name maps one-to-one to a page of the Base UI documentation and to an import subpath, so
  the upstream reference for any module is found without a lookup table.
- A component's files stay together, which is what the story glob and the Storybook README assume.

**Negative / trade-offs**

- The layout is flat: 42 folders under `src/` with no grouping by kind. Grouping later moves every
  path.
- Folder names follow upstream naming. If the system later names a component differently from Base
  UI, the folder either keeps a name that no longer matches the export or is renamed, breaking
  rule 1.
- **Quiet failure:** nothing checks the convention. A module added outside it, or one left out of
  the barrel, typechecks and builds.
