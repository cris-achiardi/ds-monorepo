# ADR 0009 — Tokens build to one stylesheet of custom properties, and the theme is an attribute on the root element

- **Status:** Draft
- **Date:** 2026-11-14
- **Deciders:** cris
- **Tags:** tokens, components, packaging
- **Related:** [ADR 0004 — Component styles are written as CSS Modules](./0004-component-styles-are-written-as-css-modules.md), [ADR 0007 — Tokens are authored as DTCG 2025.10 JSON, one file per collection](./0007-tokens-are-authored-as-dtcg-json-one-file-per-collection.md), [ADR 0008 — Two token tiers: semantic colour references primitives](./0008-two-token-tiers-semantic-colour-references-primitives.md)

## Context

On 2026-11-14 the owner asked for four components (Button, Switch, Input, Combobox) to be styled
with the tokens that exist. Three records had left the path between a token and a stylesheet open:

- [ADR 0004](./0004-component-styles-are-written-as-css-modules.md), rule 3: "How a stylesheet reads
  tokens is not decided here."
- [ADR 0007](./0007-tokens-are-authored-as-dtcg-json-one-file-per-collection.md): "There is no
  build", and whether output uses `px` or `rem` "is left to the build decision".
- `packages/tokens/README.md` listed build tooling and outputs as undecided.

What is true today:

- The source is 12 DTCG files and one resolver document declaring one set (`primitives`) and one
  modifier (`theme`, contexts `light` and `dark`, default `light`): 141 primitive tokens and 42
  semantic colours per theme.
- `/ds.config.json` already fixes the custom-property prefix (`tokenPrefix`) and the data-attribute
  prefix (`dataPrefix`).
- Base UI portals a popup to `<body>`. Measured in the preview app: with the theme attribute on a
  wrapper around the story, the Combobox popup rendered in the default theme while the field
  rendered in the dark one.

The constraint: components cannot be styled with tokens until something turns the JSON into
something a stylesheet can read, and the request did not ask for a token pipeline to be designed.
This record states what was built to satisfy the request, so that changing it is a visible edit.

## Decision

1. `@ds/tokens` builds one file, `build/tokens.css`, exported under the subpath `tokens.css` of the package. It
   contains CSS custom properties and nothing else.
2. A token path becomes `--<tokenPrefix>-<path joined with ->`: `color.bg.page` is
   `--ds-color-bg-page`, `spacing.16` is `--ds-spacing-16`.
3. A reference is emitted as a reference. `{color.blue.800}` becomes `var(--ds-color-blue-800)`;
   the build never resolves a semantic token to a literal.
4. Values are emitted as authored: dimensions in `px`, durations in `ms`, numbers bare, colours as
   hex, and a colour with alpha as `rgb(r g b / a)`.
5. Every token of the resolver's sets is declared on `:root`. Each context of a modifier is declared
   on `[data-<dataPrefix>-<modifier>='<context>']`, and the default context also on `:root`. The
   theme is therefore `data-ds-theme='light' | 'dark'`.
6. The theme attribute belongs on the root element. An attribute on a subtree does not reach
   portaled parts.
7. A component stylesheet reads tokens through `var(--<tokenPrefix>-…)` and holds no other colour,
   size, radius, font size, weight or duration. Keywords, `0`, `100%`, and Base UI's own layout
   variables (`--anchor-width`, `--available-height`) are not token values.
8. The build fails, with a non-zero exit, on a reference to an undeclared token, on two contexts of
   one modifier that declare different paths, on a value shape it cannot print, and on two paths
   that would print the same property name.

## Contract

| Concern                              | Where                                                       |
| ------------------------------------ | ----------------------------------------------------------- |
| The build                            | `packages/tokens/scripts/build.mjs`                         |
| The output and its export            | `packages/tokens/package.json` → `exports`, `scripts.build` |
| Where the stylesheet is loaded       | `apps/storybook/.storybook/preview.ts`                      |
| The first stylesheets that follow it | `packages/react/src/button/Button.module.css` and siblings  |
| Enforcement of rule 8                | `pnpm build` (inside `pnpm verify`, CI)                     |
| Enforcement of rule 7                | None.                                                       |

## Consequences

**Positive**

- Components can be styled with tokens, and a theme switch is one attribute.
- Rule 8 closes two of the quiet failures ADR 0007 names: a broken reference and a mode file missing
  a path now fail `pnpm verify`.
- The stylesheet keeps the two tiers visible, so a browser's inspector shows which primitive a role
  points at.

**Negative / trade-offs**

- All 74 primitive colours are published to every consumer of the stylesheet. Nothing stops a
  stylesheet from reading `--ds-color-blue-800` directly and bypassing the theme.
- `px` output does not follow a user's font-size preference. Moving to `rem` is a change to rule 4.
- The theme does not follow `prefers-color-scheme`. A consumer sets the attribute.
- The build is a hand-written script, not a published tool. It prints only the value shapes present
  today; a `shadow`, `cubicBezier` or `typography` token makes it throw until it is taught the shape.
- The package scope and prefixes are typed literally in component stylesheets (`--ds-…`). The
  branding codemod (`pnpm init-ds`) rewrites `.css` files; a stylesheet format it does not traverse
  would be left behind.
- **Quiet failure:** nothing enforces rule 7. A literal hex or pixel value in a CSS Module passes
  every gate. So does `var()` of a property the build does not emit: the declaration is dropped by
  the browser and the part renders with the inherited or initial value.

## Alternatives considered

**Style Dictionary or another published build tool** — the usual choice. Not taken here because
choosing a tool is a larger decision than the request called for, and the resolver document has
never been read by one. This script is small enough to delete when that decision is made.

**Resolving semantic tokens to literals per theme** — smaller output. Rejected because it erases the
reference structure ADR 0008 defines, and makes a role indistinguishable from a raw value.

**A class on the root (`.dark`) instead of a data attribute** — equivalent. The attribute was chosen
because `dataPrefix` already namespaces attributes the system adds.
