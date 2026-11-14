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

| Skill                                         | What it does                                                                                                             | Writes to                            |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| [`ds-decide`](./ds-decide/)                   | Turns a research report's open questions into Architecture Decision Records. Writes records, never code.                 | `docs/ADR/`                          |
| [`ds-figma-component`](./ds-figma-component/) | Generates a Figma component set from a component contract. **Not adapted yet.**                                          | Figma, `.figma/maps/components.json` |
| [`ds-figma-document`](./ds-figma-document/)   | Lays out the page around a component set: title, description, labelled cell grid, extension tables. **Not adapted yet.** | Figma, `.figma/maps/components.json` |
| [`ds-figma-explain`](./ds-figma-explain/)     | Builds explanatory boards: node graphs, spec tables, annotated anatomy, flows. **Not adapted yet.**                      | Figma                                |

## The Figma skills are imported, not adapted

The three `ds-figma-*` skills were copied on 2026-11-14 from
[`weave-ds-template`](https://github.com/cris-achiardi/weave-ds-template) at commit `9fed1f2`, to be
adapted to this repo afterwards. Until that happens, read them as the template's procedure, not this
repo's:

- They assume the template's **contract engine**, which was deliberately not carried over (see the
  root [`AGENTS.md`](../../AGENTS.md) → Origin). `ds-figma-component` reads a component contract
  from a `packages/contracts` package that does not exist here, so it cannot run as written.
- They describe the template's Figma file (its modes, pages and variable collections), not the file
  linked in [`../../.figma/manifest.json`](../../.figma/manifest.json).
- Five pointers to template-only files and scripts were reworded to say they were not carried over,
  because `pnpm verify:docs` fails on a pointer that resolves to nothing. No other content was
  changed.

The template's `ds-component` skill, which generated components from contracts, was not imported.
