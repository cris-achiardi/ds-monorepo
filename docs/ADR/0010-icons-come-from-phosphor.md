# ADR 0010 — Icons come from Phosphor, through `@phosphor-icons/react`

- **Status:** Draft
- **Date:** 2026-11-14
- **Deciders:** cris
- **Tags:** components, packaging, figma
- **Related:** [ADR 0003 — `@ds/react` depends on `@base-ui/react` and re-exports each component entry point unchanged](./0003-the-library-re-exports-base-ui-entry-points-unchanged.md)

## Context

On 2026-11-14 the owner asked for Phosphor icons to be installed "so that we have icons", before
styling the first four components. Until then the stories used text glyphs (`×`, `▾`, `✓`) where an
icon belongs.

`AGENTS.md` forbids adding a runtime dependency to `@ds/react` without being asked. This one was
asked for; this record is where that is written down.

What is true today:

- `@phosphor-icons/react@^2.1.10` is a `dependency` of `@ds/react`. Each icon is a React component
  that renders an inline `<svg>` with `fill="currentColor"`, in six weights.
- Five icons are used, all in stories: `PlusIcon`, `ArrowRightIcon`, `XIcon`, `CaretDownIcon`,
  `CheckIcon`, at weight `bold`.
- No component of the library imports an icon. Base UI parts that hold one (`Combobox.Clear`,
  `Combobox.Trigger`, `Combobox.ItemIndicator`) take it as children.

## Decision

1. The icon set of this system is Phosphor.
2. In code, icons are imported from `@phosphor-icons/react`, by their `…Icon` export name.
3. An icon's colour is inherited (`currentColor`). Its size is set by the stylesheet of the part
   that contains it, from a `size` token, not by the icon's `size` prop.
4. `@ds/react` does not re-export icons and does not wrap them.

## Contract

| Concern                 | Where                                                                      |
| ----------------------- | -------------------------------------------------------------------------- |
| The dependency          | `packages/react/package.json`                                              |
| Icon size inside a part | The part's CSS Module, e.g. `packages/react/src/button/Button.module.css`  |
| The same icons in Figma | Page `Icons` of the design file, recorded in `.figma/maps/components.json` |
| Enforcement             | None.                                                                      |

## Consequences

**Positive**

- One icon vocabulary in code and in the design file.
- Icons follow the text colour of the part they sit in, so they follow the theme with no token of
  their own.

**Negative / trade-offs**

- A second runtime dependency. A consumer of `@ds/react` installs Phosphor even if they render no
  icon; tree-shaking removes unused icons from a bundle, not from `node_modules`.
- The icon weight is not decided. `bold` was used beside 14px medium text in the stories because it
  matched the stroke of the text; nothing records that as a rule.
- Because rule 4 leaves icons outside the library, nothing stops an application from mixing icon
  sets.
- **Quiet failure:** an icon placed in a part whose stylesheet does not size it renders at Phosphor's
  default of `1em`, which looks deliberate.

## Alternatives considered

**Re-exporting a curated subset from `@ds/react`** — gives the system control over which icons
exist. Not chosen: it is an API of our own, which was not asked for.
