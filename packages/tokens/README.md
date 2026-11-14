# @ds/tokens

The design token package. It holds the **token source files** and a build that turns them into one
stylesheet of CSS custom properties, `build/tokens.css`, exported under the subpath `tokens.css` of the package.

## What is decided

| Fact                                                          | Where it is recorded                                                                        |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Tokens are DTCG 2025.10 JSON, one file per collection         | [ADR 0007](../../docs/ADR/0007-tokens-are-authored-as-dtcg-json-one-file-per-collection.md) |
| Two tiers; semantic colour references primitives; path naming | [ADR 0008](../../docs/ADR/0008-two-token-tiers-semantic-colour-references-primitives.md)    |
| These files are canonical for values; Figma is downstream     | [`.figma/README.md`](../../.figma/README.md)                                                |
| The custom-property prefix comes from `/ds.config.json`       | `tokenPrefix` — never hard-code it                                                          |

Both records are **Draft**. The values and the names were proposed during one working session and
have not been reviewed as a set.

## What is here

Everything is in `tokens/`.

| File                               | Tokens | Type         | Notes                                                         |
| ---------------------------------- | ------ | ------------ | ------------------------------------------------------------- |
| `color-primitives.tokens.json`     | 74     | `color`      | Six 12-step ramps, plus white and black                       |
| `color-semantic.light.tokens.json` | 42     | `color`      | Roles, as references to primitives                            |
| `color-semantic.dark.tokens.json`  | 42     | `color`      | The same 42 paths, pointed at other steps                     |
| `spacing.tokens.json`              | 15     | `dimension`  |                                                               |
| `size.tokens.json`                 | 9      | `dimension`  |                                                               |
| `border-width.tokens.json`         | 3      | `dimension`  |                                                               |
| `radius.tokens.json`               | 9      | `dimension`  | `full` is 9999px                                              |
| `opacity.tokens.json`              | 8      | `number`     | 0–1. The Figma variable holds the same value as 0–100         |
| `font-size.tokens.json`            | 8      | `dimension`  |                                                               |
| `line-height.tokens.json`          | 7      | `dimension`  | Absolute, in px                                               |
| `font-weight.tokens.json`          | 3      | `fontWeight` |                                                               |
| `duration.tokens.json`             | 5      | `duration`   |                                                               |
| `tokens.resolver.json`             | —      | resolver     | Combines the files; `theme` (light, dark) is the one modifier |

A reference is written `{color.blue.800}`. The correspondence to Figma variables is in
[`.figma/maps/tokens.json`](../../.figma/maps/tokens.json).

## Editing

- Edit the JSON directly. It is the source, not generated output.
- A new semantic colour goes in **both** mode files, at the same path.
- A theme changes which primitive a role points at. Do not change a primitive to fix one theme.
- Adding, renaming or removing a token is the owner's decision. Do not add one to fill a gap in a
  component.

## What is not decided

- **Outputs beyond the stylesheet** — typed constants, other platforms, and whether a published
  build tool replaces the script
- **Validation of shape** — the build fails on a broken reference and on mode files that declare
  different paths; nothing validates the files against the DTCG schema
- **Typeface** — there is no font family token
- **Shadow and easing** — four shadows and three easing curves were explored on the Figma canvas and
  are not in these files. Figma variables cannot hold them, so they had no collection to come from
- **Component tier** — none exists
- **Whether a numeric token keeps its value as its name**

## The build

```bash
pnpm build      # from the repo root: runs this package's build with every other
```

[`scripts/build.mjs`](./scripts/build.mjs) reads `tokens/tokens.resolver.json` and writes
`build/tokens.css`, which is ignored by git and Prettier. What it emits, and why, is
[ADR 0009](../../docs/ADR/0009-tokens-build-to-one-stylesheet-of-custom-properties-and-the-theme-is-a-root-attribute.md):

- `color.bg.page` becomes `--ds-color-bg-page`; the prefix comes from `/ds.config.json`.
- A reference stays a reference: `{color.blue.800}` is emitted as `var(--ds-color-blue-800)`.
- Primitives are on `:root`. Each theme is on `[data-ds-theme='<theme>']`, and the default theme is
  also on `:root`. Set the attribute on the root element, or portaled popups keep the default.

The build throws on a value shape it has not been taught. Adding a `shadow`, `cubicBezier` or
`typography` token means teaching the script to print it first.

The stylesheet is imported once, in `apps/storybook/.storybook/preview.ts`. The Storybook `dev` and
`build` scripts run this build first.
