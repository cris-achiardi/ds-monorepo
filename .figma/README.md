# `.figma/`

How this repo reads its design source, and what it has recorded so far.

**The design file is linked, and nothing has been read from it yet.**
[`manifest.json`](./manifest.json) → `sources.main` holds its key, name and URL; everything else
reads them from there. Both maps are still empty.

**Build isolation.** `.figma/` is development-time tooling only: it sits at the repo root outside
every workspace package, no package source imports from it, and no build target reads it. Nothing
here can break a build.

## What Figma is here

**A canvas to read, not a specification.** The design source is where a designer explores — that is
what it is for, and a decision made without exploring is a guess. But nothing in it binds the code,
and nothing in it is checked.

Three consequences:

- **Reading Figma is not a pipeline stage.** No skill sweeps the file to read it. You read it when you need
  reference, and you write down what you found in `docs/research/`.
- **Measure, never eyeball.** A screenshot cannot tell you a padding value or a bound variable. A
  number read off an image is a guess, and a proposal built on guessed numbers is worse than no
  proposal because it looks specific.
- **A Figma variant property is not a prop.** Most files encode several unrelated kinds of thing in
  one variant axis and only one of them is a prop. The sort is explained in
  [`../docs/documentation/01-from-figma-to-component.md`](../docs/documentation/01-from-figma-to-component.md).

## Where things are documented

| You want                                  | Look at                                           |
| ----------------------------------------- | ------------------------------------------------- |
| Which Figma file, and what is in it       | [`manifest.json`](./manifest.json) → `sources`    |
| How a Figma variable name becomes a token | `manifest.json` → `identity.variableNaming`       |
| Known problems in the source file         | `manifest.json` → `identity.*.knownProblems`      |
| What a map entry may contain              | [`schema/`](./schema/) — the schemas are the spec |

## Two bridges — and neither is a dependency

The wiring is `manifest.json` → `bridges`, which is authoritative; this table is the orientation.

| Bridge    | What it is                                  | Needs                                                          |
| --------- | ------------------------------------------- | -------------------------------------------------------------- |
| **read**  | The official Figma MCP connector            | nothing — no install, no daemon, no plugin                     |
| **write** | figma-console MCP + a Desktop Bridge plugin | Figma Desktop, the plugin open in the file, a local MCP server |

No `pnpm` script, no gate and no CI job invokes either, so `pnpm verify` is green on a machine with
no Figma tooling installed.

**Nothing gates the write side.** Anything generated into Figma can drift from the code and no build
fails — `maps/components.json` is a record, not a check.

### Reading the file

There are no scripts here: with an MCP bridge the **agent is the script**. Read the file key from
`manifest.json` → `sources`; never hard-code it.

| Tool                 | Use it for                                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `get_metadata`       | The structure — node ids, names, types. Start here; do not guess node ids.                                                                |
| `get_variable_defs`  | The variables **bound to a given node**. Note: it answers per-node, not per-file, so a full inventory means walking representative nodes. |
| `get_design_context` | One node as reference code + a screenshot.                                                                                                |
| `get_screenshot`     | A visual check. Never a substitute for measuring.                                                                                         |

#### Structure

```
get_metadata(fileKey)                  -> top-level pages (guid + name)
get_metadata(fileKey, nodeId: "0:1")   -> the tree for that page
```

Returns node ids, layer types, names, positions, sizes. Returns **no style, no bound variable and no
variant property value** — do not infer paint or spacing from it.

#### Variables — the one to be careful about

`get_variable_defs(fileKey, nodeId)` returns the variables **bound to that node and its
descendants**, not the file's collections. There is no "list every variable" call on the read
bridge. So a full inventory is a **union over representative nodes**, and its completeness is a
claim you have to earn:

1. Pick nodes that between them cover every section.
2. Call it on each.
3. Union the results.
4. **Write down which nodes you sampled.** That sentence is what makes the coverage claim checkable.

**The names it returns can be `codeSyntax.WEB`, not variable names.** A Figma variable carries two
names: `name` (the slash path) and an author-set code syntax string. They are separate fields and
can differ. Record both in `manifest.json` → `identity.variableNaming` before mapping anything.

#### Variant properties

They are the component set's **child names** (`Size=Small, Shape=Circle`). Parse the axis names and
values out of those. A set whose children are named `Frame 1`, `Frame 2` has **no variant
properties** — a finding about the file, worth stating plainly.

#### Things that will bite

| Symptom                               | What is actually happening                                            |
| ------------------------------------- | --------------------------------------------------------------------- |
| A variable you expected is missing    | It is not bound on the node you asked about. Sample a different node. |
| Node ids from a previous session fail | They are file-local. Re-run `get_metadata`.                           |
| Two styles disagree on a value        | Both are real. Record both; the disagreement is the finding.          |
| A "component" is a plain frame        | Not a component set. It cannot carry variants.                        |

## The maps

| File                                             | What it records                                                 |
| ------------------------------------------------ | --------------------------------------------------------------- |
| [`maps/tokens.json`](./maps/tokens.json)         | Figma variable → token path. `code: null` means drift.          |
| [`maps/components.json`](./maps/components.json) | Code component → Figma node, plus the variant axes found there. |

Both are **empty and schema-valid**. `pnpm verify:figma` validates them in CI, so an empty map is a
checked state rather than an unchecked one.

## Conventions

- **Code is canonical.** For token _values_, `packages/tokens` wins and Figma is downstream. A
  difference is drift in Figma, not a change to adopt back into the tokens.
- **Join on stable keys.** `componentKey` for components, `variableKey` (or the code token path)
  for variables — never on node ids, which are file-local and change.
- **Add an entry when the work is done, not before.** The map's value as a record comes from it
  being empty where the work has not happened.
- **A null is a finding.** `code: null`, `key: null`, `separatorUnknown: true` — these say "not
  measured yet", which is more useful than a confident guess, because a guess never gets revisited.
- **Correct a measurement in place, and say that you did.** A silently corrected fact teaches nobody
  which readings are safe to trust.

## Writing to Figma

Three rules bind every write, because the failure modes are quiet:

- **Check the file, then lock it.** Compare `figma.fileKey` against `sources.<key>.key` from the
  manifest, then pin the target with `figma_navigate({ url, lock: true })`. The active file drifts
  between open documents; an unpinned write lands wherever the user last clicked.
- **Never type a file key.** It comes from the manifest.
- **Record after, never before.** An entry in `maps/components.json` means the work is done.
