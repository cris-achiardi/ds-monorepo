# Skills

Agent skills for this design system. Each one is a **module** in the sense the root
[`AGENTS.md`](../../AGENTS.md) means it: loaded when a task is in its territory, not read up front.

A skill is not documentation. It is the procedure plus the traps — what to read, in what order, what
the tooling will let you do wrong, and what to write down when you are finished.

## The arc

The repo's governing sequence is **explore → report → decide (ADR) → build**.

```
   Figma  ──by hand──▶  docs/research/  ──ds-decide──▶  docs/ADR/  ──by hand──▶  packages/
```

**Exploring and writing up are deliberately unmechanized.** Reading the design source is something a
person does when they need reference. What Figma is here, and the call sequences for reading it,
live in [`../../.figma/README.md`](../../.figma/README.md).

**Building has no skill yet.** The React library and the token system are being authored from
scratch; a build skill written before the first component exists would encode conventions nobody has
decided.

## Index

| Skill                       | What it does                                                                                             | Writes to   |
| --------------------------- | -------------------------------------------------------------------------------------------------------- | ----------- |
| [`ds-decide`](./ds-decide/) | Turns a research report's open questions into Architecture Decision Records. Writes records, never code. | `docs/ADR/` |

The template this repo was scaffolded from also shipped component-generation and Figma-writing
skills. They depended on its contract engine and were not carried over.
