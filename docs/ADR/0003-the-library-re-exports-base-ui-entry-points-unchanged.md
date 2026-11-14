# ADR 0003 — `@ds/react` depends on `@base-ui/react` and re-exports each component entry point unchanged

- **Status:** Draft
- **Date:** 2026-11-14
- **Deciders:** cris
- **Tags:** components, packaging
- **Related:** [ADR 0004 — Component styles are written as CSS Modules](./0004-component-styles-are-written-as-css-modules.md), [ADR 0005 — One folder per component, named after its Base UI entry point](./0005-one-folder-per-component-named-after-its-base-ui-entry-point.md)

## Context

`packages/react/README.md` recorded Base UI as the intended behaviour layer and left three things
open for the moment the first component landed: which package, which version range, and how much of
its API the library re-exports.

Measured on 2026-11-14 against the npm registry and the installed package:

- The library is published as `@base-ui/react`, latest `1.9.0`. The earlier name
  `@base-ui-components/react` stopped at `1.0.0-rc.0` and is marked deprecated with "Package was
  renamed to @base-ui/react".
- `@base-ui/react@1.9.0` declares 38 component entry points in `package.json` → `exports`
  (`./accordion` … `./tooltip`), 4 documented utilities (`./csp-provider`, `./direction-provider`,
  `./merge-props`, `./use-render`), and three further public subpaths: `./types`,
  `./unstable-use-media-query` and 34 `./internals/*` paths.
- Its peers are `react` and `react-dom` `^17 || ^18 || ^19`. `date-fns`, `@date-fns/tz` and
  `@types/react` are peers marked optional.
- Each component entry point exports a namespace of parts (`Dialog.Root`, `Dialog.Trigger`, …), the
  prop and state types of those parts, and namespaces of the data attributes and CSS variables the
  parts set.

The tension: the request was to bring every component in at once, before a token system or any
visual decision exists. Wrapping each part in a component of our own would mean authoring roughly
38 prop surfaces with nothing to put in them, and every one would look deliberate.

## Decision

1. `@ds/react` depends on `@base-ui/react` at `^1.9.0`, as a `dependency`, not a peer. A consumer
   installs `@ds/react` and never names Base UI.
2. Each of the 38 component entry points and the 4 documented utilities has one module in
   `packages/react/src/` that re-exports that entry point whole (`export *`). The package barrel
   re-exports every module.
3. `./types`, `./unstable-use-media-query` and `./internals/*` are not re-exported.
4. Application code and stories import from `@ds/react` or from the module, never from
   `@base-ui/react` directly. The module is the seam where a component stops being a pass-through.
5. A module stops being a pass-through one component at a time, when that component gets styles or a
   narrowed API. That change is made in the module and does not need a new record unless it changes
   rule 1 to 4.

## Contract

| Concern                         | Where                                        |
| ------------------------------- | -------------------------------------------- |
| The dependency and its range    | `packages/react/package.json`                |
| One seam module per entry point | `packages/react/src/`                        |
| The public surface              | `packages/react/src/index.ts`                |
| Enforcement                     | `pnpm typecheck` (inside `pnpm verify`, CI). |

Nothing enforces rule 4, and nothing checks that the set of modules matches the set of Base UI
entry points.

## Consequences

**Positive**

- All 38 components are importable from `@ds/react` and previewable today, with Base UI's behaviour
  and accessibility unmodified.
- No prop, part or state was authored here, so nothing in the public surface is a guess.
- Each component has a file to change when it gains styles, so adopting a look does not move any
  import path.

**Negative / trade-offs**

- The public API of `@ds/react` is currently Base UI's API. A breaking change upstream is a breaking
  change here, and the part names (`Root`, `Popup`, `Positioner`) are theirs, not chosen.
- Components ship with no styles. Parts whose size comes entirely from CSS (the slider track and
  thumb, the switch thumb, the progress and meter indicators, the separator, the scroll-area
  scrollbar) render with no visible area until styles exist.
- `export *` forwards whatever an entry point exports. A name Base UI adds to an entry point in a
  minor release becomes public API of `@ds/react` without a change in this repository.
- **Quiet failure:** a component Base UI adds in a later release gets no module, and no gate reports
  the gap. A direct import from `@base-ui/react` in application code resolves and typechecks, so
  bypassing the seam is also silent.
- Narrowing the surface later (rule 5) is a breaking change for anything already using the part or
  prop that is removed.

## Alternatives considered

**Re-export the Base UI root from the barrel in one line** — no per-component module. Rejected
because there would be no file to attach a component's styles to, and adding one later moves the
import for every consumer of the deep path.

**Author a wrapper component per part now** — rejected for this pass: with no tokens and no visual
decisions there is nothing for a wrapper to add, and 38 hand-written prop surfaces would read as
decided when none were.
