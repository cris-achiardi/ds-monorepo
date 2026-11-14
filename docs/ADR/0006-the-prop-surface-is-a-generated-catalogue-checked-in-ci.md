# ADR 0006 — The prop surface of `@ds/react` is a generated catalogue, committed and checked in CI

- **Status:** Draft
- **Date:** 2026-11-14
- **Deciders:** cris
- **Tags:** components, governance
- **Related:** [ADR 0003 — `@ds/react` depends on `@base-ui/react` and re-exports each component entry point unchanged](./0003-the-library-re-exports-base-ui-entry-points-unchanged.md), [ADR 0005 — One folder per component, named after its Base UI entry point](./0005-one-folder-per-component-named-after-its-base-ui-entry-point.md)

## Context

Every module of `@ds/react` re-exports a Base UI entry point unchanged
([ADR 0003](./0003-the-library-re-exports-base-ui-entry-points-unchanged.md)), so the props a
consumer can pass are decided by a dependency. Measured on 2026-11-14 against `@base-ui/react`
1.9.0: 42 modules export 275 components and parts, which take 1596 props under 151 distinct names.

Nothing recorded that surface. A dependency upgrade that adds, removes or retypes a prop, or moves a
default, typechecks and builds. So will a module that starts narrowing or extending what it
re-exports, which `packages/react/README.md` lists as an open question. In both cases the public API
changes with no diff that names the change.

`AGENTS.md` records that the template's prop glossary was deliberately not carried over, and that
bringing any of the contract engine back is a decision. This record is that decision for one piece
of it, and it is narrower than the template's: the catalogue describes what exists and classifies
nothing. It names no axes, no canonical values and no drift.

## Decision

1. The prop surface is read from the types of what the barrel exports, by a script, and written to
   files that are committed. No part of it is typed by hand.
2. The detail lives beside each module, one file per module; a single index at the package root says
   which components take each prop. A reader loads one module's file, not the whole surface.
3. A prop is in the catalogue when the library or its behaviour layer declares it. Attributes a part
   accepts only because it renders an HTML element are not.
4. The catalogue records what the source states. A default that is not documented is `null`.
5. A catalogue that does not match the types fails `pnpm verify` and CI. A change to the prop surface
   lands together with the regenerated catalogue.

## Contract

| Concern             | Where                                                                    |
| ------------------- | ------------------------------------------------------------------------ |
| The generator       | `scripts/prop-catalogue.mjs` (`pnpm prop-catalogue`)                     |
| Per-module detail   | `packages/react/src/<entry>/<Name>.props.json`                           |
| The index           | `packages/react/prop-catalogue.json`                                     |
| Enforcement         | `pnpm prop-catalogue:check`, in `pnpm verify` and gated in CI            |
| Where the gate runs | `.github/workflows/verify.yml`, after `typecheck` (it needs sound types) |

## Consequences

**Positive**

- A change to the public API becomes a reviewable diff that names the component, the prop and the
  field that moved.
- The question "which components take `disabled`, and with what default" is answered from a file
  instead of from 37 pages of upstream documentation.
- The catalogue is read from our exports, so it keeps describing the library after a module stops
  being a pass-through.

**Negative / trade-offs**

- Every upgrade of `@base-ui/react` or of `typescript` that changes a printed type needs a
  regenerate-and-commit step, including when nothing a consumer would notice changed. The index
  records both versions so such a diff explains itself.
- 41 generated files sit in the source tree, 40 of them beside components.
- Types are stored as TypeScript prints them. Aliases are expanded, so an entry can be long and can
  differ in wording from the upstream documentation for the same prop.
- **Quiet failure:** the gate proves the catalogue matches the types, not that anyone read the diff.
  Regenerating without looking accepts whatever changed.
- **Quiet failure:** a component is recognised as a PascalCase export that can be called. A
  PascalCase function that is not a component would be listed as one, and a component exported under
  another casing would be missed, with no error in either case.
- **Quiet failure:** a default is whatever the `@default` tag says. A tag that is wrong upstream is
  copied faithfully.

## Alternatives considered

**Parse the documentation bundled with `@base-ui/react`** — it is how the first prop map was drawn in
Figma, and its numbers agree with the types to within a handful of props. It describes Base UI
rather than this library, so it stops being true for a module the day that module is styled or
narrowed.

**One catalogue file** — simpler to check, but at this size (1596 rows) it is too large to load in
order to answer a question about one component.
