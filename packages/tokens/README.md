# @ds/tokens

The design token package. **A bare shell**: a `package.json` and this file.

Nothing about the token system is decided here, and nothing was carried over from the template this
repository was scaffolded from. The open questions, roughly in the order they force each other:

- **Authoring format** — DTCG JSON, another format, or code
- **Tiers** — how many layers (primitive, semantic, component) and what each may reference
- **Naming** — segment order, casing, scale vocabulary per dimension
- **Modes and themes** — which axes exist, and how they compose
- **Build tooling and outputs** — what consumers import (CSS custom properties, typed constants)
- **Figma correspondence** — how a variable maps to a token; recorded in
  [`.figma/README.md`](../../.figma/README.md) once measured

## Fixed points

Two things are already settled outside this package, and the token system has to respect them:

- **The custom-property prefix comes from `/ds.config.json`** (`tokenPrefix`). Never hard-code it.
- **Decisions are recorded as ADRs** — see [`docs/ADR/README.md`](../../docs/ADR/README.md). The
  design records in [`docs/design/`](../../docs/design/README.md) list the token groups they are
  waiting on under their open questions.

## When this package gets a build

Add a `build` script to `package.json`; the root `pnpm build` picks it up automatically. Generated
output goes in `build/` or `dist/`, both of which are already ignored by git and Prettier. Then
import the stylesheet in `apps/storybook/.storybook/preview.ts`.
