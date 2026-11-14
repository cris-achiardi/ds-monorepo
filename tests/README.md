# `tests/`

Repo-level tests, run by `pnpm test` (Vitest). They cover the repository's own tooling, not
components — component tests will live beside the components in `packages/react`.

| Test                                     | What it protects                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| [`init-ds.test.mjs`](./init-ds.test.mjs) | `pnpm init-ds --check` flags every old-prefix syntax and leaves skill names be |
