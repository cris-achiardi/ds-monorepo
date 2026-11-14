# ADR 0008 — Two token tiers: semantic colour references primitives, and paths mirror the Figma names

- **Status:** Draft
- **Date:** 2026-11-14
- **Deciders:** cris
- **Tags:** tokens, figma
- **Related:** [ADR 0007 — Tokens are authored as DTCG 2025.10 JSON, one file per collection](./0007-tokens-are-authored-as-dtcg-json-one-file-per-collection.md)

## Context

`packages/tokens/README.md` listed tiers and naming as open. Both were settled in practice on
2026-11-14, when the token set was explored on the Figma canvas, turned into variables, and then
written to `packages/tokens/tokens/`:

- Six colour ramps of 12 steps, `100` (lightest) to `1200` (darkest), plus white and black. Two
  ramps are anchored on the brand colours at their exact value: `#0A66A3` is `blue.800` and
  `#E4405F` is `rose.600`. The other steps, and the green, yellow, red and neutral ramps, were
  computed in OKLCH and chosen by the agent doing the work, not measured from an existing design.
- 42 colour roles in two themes, each a reference to one ramp step.
- Nine numeric scales (spacing, size, border width, radius, opacity, font size, line height, font
  weight, duration), whose values were likewise proposed, not measured.

Measured contrast (WCAG 2) for the decisions that depend on it: white on `rose.600` is 4.04:1,
below the 4.5:1 text minimum; `blue.800` against `neutral.1200` is 2.96:1.

The naming of these tokens was labelled provisional at every step. This record states what the
files currently do, so that changing it is a visible edit rather than drift.

## Decision

1. There are two tiers. **Primitives** hold raw values. **Semantic** tokens hold a reference to a
   primitive and name a role.
2. Only colour has a semantic tier. Every other scale is primitive only, and its token name is its
   value (`spacing.16`, `duration.200`), with `radius.full` the one exception.
3. A semantic token's value is a reference to a primitive in every theme. The exception is a colour
   that needs alpha, which is a raw value because a reference cannot carry alpha
   (`color.bg.backdrop`).
4. A token path is the collection's root group followed by the Figma variable name, lower-cased, with
   `/` as the path separator. Both colour collections share the root group `color`; every other
   collection's root group is its own name in kebab-case.
5. Themes change which primitive a role points at. They never change a primitive.
6. There is no component tier.

## Contract

| Concern                      | Where                                                     |
| ---------------------------- | --------------------------------------------------------- |
| Primitive colour             | `packages/tokens/tokens/color-primitives.tokens.json`     |
| Colour roles, per theme      | `packages/tokens/tokens/color-semantic.light.tokens.json` |
|                              | `packages/tokens/tokens/color-semantic.dark.tokens.json`  |
| The naming rule, as measured | `.figma/manifest.json`                                    |
| Enforcement                  | None.                                                     |

## Consequences

**Positive**

- A theme is a remap of 42 references, with no value duplicated between light and dark.
- A token path can be derived from a Figma variable name mechanically, and the reverse.

**Negative / trade-offs**

- Primitive and semantic colour share the `color` namespace, so a ramp and a role group can never
  have the same name, and a path alone does not say which tier a token is in.
- Numeric tokens are named by value. Changing `spacing.16` to 18 would make the name false, so a
  value change is a rename, and nothing semantic (`spacing.control-gap`) exists to absorb it.
- Role names assume blue is the primary brand colour and rose the second (`accent`, `accent2`). That
  was assumed, not stated by the owner.
- In the light theme `color.accent2.on` (white) on `color.accent2.default` (`rose.600`) is 4.04:1
  and fails the text minimum. In the dark theme neither brand colour is used at its exact value,
  because `blue.800` on the dark page is 2.96:1.
- The dark theme assumes dark text on filled accent, success and danger surfaces while the light
  theme assumes white. Only the accent groups have an `on` token; success, warning and danger do
  not, so that assumption is written in descriptions and not in a token.
- **Quiet failure:** nothing checks rule 3 or rule 5. A semantic token given a raw hex, or a
  primitive edited to fix one theme, is valid DTCG and passes every gate.
