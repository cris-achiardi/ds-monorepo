# AGENTS.md

Guidance for coding agents working in this repository. This is the single source; the root
[`CLAUDE.md`](./CLAUDE.md) only imports it, so Claude Code and every other agent read the same file.

## First rule: modular context, loaded on demand

Pull the right context at the right time — not everything up front. Every piece of this system's
documentation is a **module**: each ADR, each README beside the thing it governs, each skill. Load a
module only when the task actually needs the decision or detail it holds.

In particular, **do not read all the ADRs at startup** — read the one that governs the surface you
are about to touch, when you are about to touch it.

This is deliberate **progressive disclosure**
([ADR 0001](./docs/ADR/0001-every-layer-is-self-describing.md)): the entry map stays small and you
descend into a module only when you are in its territory.

## What this is

A **design-system monorepo at an early state**: governance, documentation layers, Figma wiring, CI
and tooling are in place. The component library **re-exports every Base UI component unstyled**, and
there are **no tokens yet**.

```
packages/react/    @ds/react  — React component library. Base UI re-exported unstyled, one folder each
packages/tokens/   @ds/tokens — design tokens. Bare shell: nothing about the system is decided
apps/storybook/    storybook-web — preview app, globs one bare story per component from packages/react
docs/research/     pre-decision: what is measurably true
docs/ADR/          post-decision: what we decided and why
docs/design/       design direction: how a screen should look, one record per concern
docs/documentation/ plain-language explanations for designers
.figma/            which design file we read, and what has been reconciled
.claude/skills/    agent skills for this repo
scripts/           repo-wide gates, generators and the branding codemod
```

`@ds/tokens` is empty **on purpose** and `@ds/react` has no styles **on purpose**; their READMEs
list what is undecided: [`packages/react/README.md`](./packages/react/README.md) and
[`packages/tokens/README.md`](./packages/tokens/README.md). Two constraints bind work there:

- **Base UI is the behaviour layer for `@ds/react`, and each component is a pass-through until it is
  deliberately styled** ([ADR 0003](./docs/ADR/0003-the-library-re-exports-base-ui-entry-points-unchanged.md)).
  Do not add another runtime dependency, placeholder styles, or props of our own without being
  asked.
- **Do not invent tokens, token tiers, naming rules or a build pipeline.** The token system is
  authored from scratch by its owner; an invented one looks authoritative and nobody re-checks it.

The working arc for anything structural is:

> **explore → report → decide (ADR) → build**

Exploring the design source and writing up what is there are done by hand. `ds-decide` turns a
report's open questions into a record.

## Origin

Scaffolded on 2026-11-14 from
[`weave-ds-template`](https://github.com/cris-achiardi/weave-ds-template), keeping its governance,
documentation layers and gates. Its contract engine — agnostic component contracts, the framework
emitters, the Vue / Angular / web-component backends, the sandboxes and the prop glossary — was
**deliberately left out**. Do not reintroduce any of it by default; that would be a decision, and it
belongs in an ADR.

## Branding

The repo is generic for now (`@ds/*`, `--ds-*`, `data-ds-*`). It gets branded **once**, before
anything is styled:

```bash
pnpm init-ds <name> --dry   # inspect
pnpm init-ds <name>         # apply, then pnpm install
```

The scope, the token prefix and the data-attribute prefix are one decision in three syntaxes and
must move together. `/ds.config.json` is the single source of truth; never hard-code a prefix
anywhere else.

## Commands

```bash
pnpm dev:storybook       # Storybook; STORYBOOK_PORT overrides the default 6006
pnpm build               # runs `build` in every package that defines one (none yet)
pnpm verify              # the full local gate — run this before pushing

pnpm adr-index           # regenerate the ADR index from the records — never edit it by hand
pnpm design-index        # regenerate the design-record index — never edit it by hand
pnpm verify:docs         # every link, path and command in the docs resolves
pnpm verify:figma        # .figma/maps validate against their schemas
```

`pnpm verify` chains: `format:check → lint → typecheck → adr-index:check → design-index:check →
verify:docs → verify:figma → build → test`.

## Governance lives in the ADRs — consult the one your task touches

[`docs/ADR/README.md`](./docs/ADR/README.md) is the index that routes you there.

- **Decision vs contract.** An ADR records the _decision_ and stays agnostic; the schemas, scripts
  and generated files that realize it are its **contracts**, they live with the code they govern,
  and the ADR _links_ them in a `## Contract` table.
- **Pre-v0 status policy.** Before the first release, records are edited in place and most stay
  **Draft**. Only decisions **already mechanized in code** are Accepted. At v0 the
  supersede-don't-edit discipline switches on.

Working against an accepted ADR without updating it is a defect, not a shortcut.

## When to read what

| Read it when                                           | File                                                                                               |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Explaining any of this to a designer                   | `docs/documentation/` — plain language. Explanation, not spec: where they disagree, the spec wins. |
| Authoring or changing a component                      | `packages/react/README.md`                                                                         |
| Working on tokens                                      | `packages/tokens/README.md`                                                                        |
| Adding or changing a story, or the preview app         | `apps/storybook/README.md`                                                                         |
| Reading the design source                              | `.figma/README.md`                                                                                 |
| Designing or reviewing a screen, or a component's look | `docs/design/README.md` — start at `design-priorities`                                             |
| Writing up what you found                              | `docs/research/README.md`                                                                          |
| Recording a decision                                   | `docs/ADR/README.md`, and the `ds-decide` skill                                                    |
| Adding a gate or a CI step                             | `scripts/README.md` and `.github/workflows/README.md`                                              |

## Two rules about enforcement

- **A rule whose breach produces no build error has to be gated in CI, not only in `pnpm verify`** —
  otherwise it is enforced on whichever machine happens to run verify. Equally: a build step that
  throws must reach a non-zero exit, or CI stays green on a failed build.
- **A gate that fails on everything on day one gets switched off, and a switched-off gate protects
  nothing.** A new check starts as a report; promoting it to a gate is deliberate work, done against
  a clean baseline.

## Honesty rules for generated and authored artifacts

- **Never hand-edit a generated region.** The ADR and design indexes are regenerated by their
  scripts, and the `:check` variants fail the build when they drift.
- **Generated output must be deterministic.** Fixed code-point comparators, never `localeCompare`;
  sorted directory reads, never filesystem order; nothing machine-specific in any output.
- **A gap is a finding, not a blank to fill.** `code: null`, `key: null`, "nothing yet" — these
  record _not measured yet_, which is more useful than a confident guess, because a guess never gets
  revisited.
- **Never invent a part, a state, an accessibility claim or a token to fill a field.** An empty
  field is an honest "not decided". A plausible wrong one passes every check in this repo and
  misleads every reader after you.
