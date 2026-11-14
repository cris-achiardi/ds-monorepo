# Design system monorepo

A design-system monorepo at its starting state. Governance, documentation layers, Figma wiring, CI
and tooling are in place; **the React library and the token system are empty and will be built from
scratch.**

Scaffolded from [`weave-ds-template`](https://github.com/cris-achiardi/weave-ds-template), without
its contract engine and multi-framework backends.

## Quick start

```bash
pnpm install
pnpm verify                # every gate
pnpm dev:storybook         # http://localhost:6006 — no stories yet
```

The repo is generic for now (`@ds/*`, `--ds-*`). Brand it once, before components exist:

```bash
pnpm init-ds <name> --dry  # see what moves
pnpm init-ds <name>        # @ds/* -> @<name>/*, --ds-* -> --<name>-*
pnpm install               # workspace links move with the scope
```

## What is in the box

|                      |                                                                               |
| -------------------- | ----------------------------------------------------------------------------- |
| `packages/react`     | `@ds/react` — empty barrel. Hand-written React on Base UI (not installed)     |
| `packages/tokens`    | `@ds/tokens` — bare shell. Format, tiers, naming and build are undecided      |
| `apps/storybook`     | `storybook-web` — configured, zero stories                                    |
| `docs/ADR`           | Decision records, with a generated index                                      |
| `docs/research`      | Pre-decision space: what is measurably true, ending in open questions         |
| `docs/design`        | Design direction: one record per concern — principles, checks, open questions |
| `docs/documentation` | Plain-language pages for designers                                            |
| `.figma`             | Which design file is read, and what has been reconciled. No file linked yet   |
| `.claude/skills`     | Agent skills. One so far: `ds-decide`                                         |
| `scripts`            | Gates, index generators and the branding codemod                              |

## Gates

```bash
pnpm verify              # the full local gate — run this before pushing
pnpm verify:docs         # every link, path and command named in the docs resolves
pnpm verify:figma        # .figma maps validate against their schemas
pnpm adr-index:check     # the ADR index matches the records
pnpm design-index:check  # the design index matches the records, and every record is complete
```

CI runs the same set — see [`.github/workflows/`](./.github/workflows/README.md).

## Working in it

- **[`AGENTS.md`](./AGENTS.md)** — the entry map for agents. ([`CLAUDE.md`](./CLAUDE.md) imports it.)
- **[`packages/react/README.md`](./packages/react/README.md)** and
  **[`packages/tokens/README.md`](./packages/tokens/README.md)** — what is decided and what is not.
- **[`docs/ADR/README.md`](./docs/ADR/README.md)** — how decisions are recorded.

Everything is documented next to the thing it governs. Each README is an index for its own
territory; follow the pointer rather than reading everything at once.

## Requirements

Node ≥ 20 (`.nvmrc` pins 24), pnpm 10.
