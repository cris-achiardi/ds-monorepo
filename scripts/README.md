# `scripts/`

Repo-wide scripts — the ones that operate on the whole repository rather than on one package.

Every script here is plain Node with no build step, run through a `pnpm` alias. Each one carries a
header comment saying **what it catches that nothing else would** — that is the test for whether it
earns a place in `pnpm verify`.

## What is here

| Script                                       | Command                                             | Kind      | What it is for                                                                                              |
| -------------------------------------------- | --------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| [`init-ds.mjs`](./init-ds.mjs)               | `pnpm init-ds <name> [--dry]`                       | codemod   | Brand the repo **once**: package scope, token prefix and data-attribute prefix together                     |
| [`verify-docs.mjs`](./verify-docs.mjs)       | `pnpm verify:docs`                                  | **gate**  | Every link, path and `pnpm` command named in the docs resolves, and every directory is covered by a doc     |
| [`adr-index.mjs`](./adr-index.mjs)           | `pnpm adr-index` / `pnpm adr-index:check`           | generator | The ADR index, derived from the records themselves                                                          |
| [`design-index.mjs`](./design-index.mjs)     | `pnpm design-index` / `pnpm design-index:check`     | generator | The design-record index, derived from the records; the check also fails a record missing a required section |
| [`prop-catalogue.mjs`](./prop-catalogue.mjs) | `pnpm prop-catalogue` / `pnpm prop-catalogue:check` | generator | The prop surface of the React library, read from its types; the check is a **gate** on any change to it     |
| [`verify-figma.mjs`](./verify-figma.mjs)     | `pnpm verify:figma`                                 | **gate**  | `.figma/maps/*.json` validate against their schemas, and claim no code path they lack                       |

## The rule these follow

A gate belongs here when its breach **produces no error anywhere else**. A malformed `.figma` map
breaks no build. A link pointing at a deleted file renders fine. A missing ADR row leaves every tool
green. That invisibility is the entire justification — a check for something the compiler already
catches is noise.

The corollary: **a gate must run in CI, not only in `pnpm verify`.** A rule enforced only by
`verify` is enforced on whichever machine happens to run it. See
[`.github/workflows/`](../.github/workflows/README.md).

## `init-ds` is different, and runs once

It is a codemod, not a check. It rewrites the package scope (`@ds/*`), the CSS custom-property
prefix (`--ds-*`) and the data-attribute prefix (`data-ds-*`) **together**, because they are one
decision in three syntaxes. Renaming one by hand leaves a repo that builds green and is wrong.

`/ds.config.json` is the source of truth for that identity; `init-ds` rewrites it and every
reference to it. Run `--dry` first. CI runs the whole codemod on a matrix of names and asserts the
renamed repo is still green, so the rename cannot rot.

After branding, `pnpm init-ds --check` looks for stragglers using the same rename rules and the same
file traversal as the codemod. It does not mutate files.

Skill names under `.claude/skills/` (`ds-decide`) are agent tooling, not the brand, and are not
renamed.
