# `.github/workflows/`

Continuous integration. The place a gate becomes enforcement rather than a suggestion.

The scripts themselves live in [`scripts/`](../../scripts/README.md); this directory only decides
**when they run and on what**.

## What is here

| Workflow                     | Jobs                | What it protects                               |
| ---------------------------- | ------------------- | ---------------------------------------------- |
| [`verify.yml`](./verify.yml) | `verify`, `init-ds` | Repository checks, and branding codemod health |

### `verify`

Runs the same set of gates as `pnpm verify`, one step per gate, each with a comment stating what
that gate catches that nothing else would — then builds Storybook, which `pnpm verify` does not.

Steps are separate rather than one `pnpm verify` call on purpose: a failure names itself in the
GitHub UI without anyone reading a log.

**A gate must not depend on anything produced later in its own chain.** The `init-ds` job below runs
the real `pnpm verify` on a clean checkout, which is what catches a gate that accidentally needs
build output.

### `init-ds`

A matrix that runs `pnpm init-ds <name>` on a clean checkout, then asserts the **renamed** repo is
still green and that no stragglers of the old prefix survive.

The codemod runs once per project, so in normal use it is never exercised again. This job is the
only reason it stays correct. **Delete the job once the repo has been branded** — `init-ds` refuses
to run twice, so the job would fail from then on.

## Why gates live here and not only in `pnpm verify`

**A rule whose breach produces no build error has to be gated in CI, or it is enforced on whichever
machine happens to run `verify`.**

That is why the two lists must stay in step: a gate added to `package.json` and not to `verify.yml`
protects the author and nobody else. When you add one, add it in both places, with a comment here
saying what it catches.

## What is deliberately absent

No deploy, no release, no publish workflow. There are no components to release yet, and an unused
publish pipeline is a thing that breaks quietly and is discovered on the day it is first needed.
