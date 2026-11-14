# Architecture Decision Records (ADRs)

Each ADR captures one architecturally significant decision: its context, the decision, and its
consequences. ADRs are immutable once **Accepted** — to change a decision, supersede it with a new
ADR rather than editing the old one.

**An ADR records the decision and stays agnostic; it does not restate the specifics that realize
it.** Those specifics — schemas, scripts, generated files, code snippets, or reference docs — are
the decision's **contracts**, and they live with the code they govern. An ADR _links_ its
contracts in a `## Contract` table; it does not inline them. The shape is in
[`0000-template.md`](./0000-template.md). This is deliberate: contracts evolve with the
implementation, so keeping them out of the record is what lets an Accepted ADR stay stable instead
of being rewritten every time the details move.

**Statuses:** `Draft` → `Proposed` → `Accepted` → (`Superseded by NNNN` | `Deprecated`)

**Pre-v0 status policy.** Until the first release there is nothing downstream to protect, so the
immutability rule above is not yet in force — ADRs are edited in place and most stay **Draft**,
because decisions can still move. Only foundational decisions **already mechanized in code** are
**Accepted**. At v0 the Accepted-is-immutable / supersede-don't-edit discipline switches on for
good.

That bar is worth stating plainly, because it is the one that keeps this folder honest: _a
decision nobody has implemented is a Draft, however confident it sounds._

## The records

Two records were carried over from the template this repository was scaffolded from, because both
describe how **this repository** is organised and both are still mechanized here:

- **0001** — every layer describes itself, and pointers are verified (`pnpm verify:docs`).
- **0002** — design guidance lives in `docs/design/` as checkable principles
  (`pnpm design-index:check`).

The template's other records governed its contract engine, which was not carried over, so they
were left behind. Decisions about the React library start at **0003**. Decisions about the token
system start at **0007**.

> **The table below is generated** by `pnpm adr-index` from the records themselves — the number from
> the filename, the title from the H1, the status from each record's `Status:` line. Do not edit it
> by hand; `pnpm adr-index:check` fails the build when it drifts. That is also why a record's status
> is only ever changed **in the record**.

<!-- adr-index:start -->

| #                                                                                                       | Title                                                                                                  | Status   |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------- |
| [0001](./0001-every-layer-is-self-describing.md)                                                        | Every layer is self-describing, and context is pulled rather than pushed                               | Accepted |
| [0002](./0002-design-guidelines-live-in-docs-design-as-principles-agents-can-check.md)                  | Design guidelines live in `docs/design` as principles an agent can check, not recipes it copies        | Draft    |
| [0003](./0003-the-library-re-exports-base-ui-entry-points-unchanged.md)                                 | `@ds/react` depends on `@base-ui/react` and re-exports each component entry point unchanged            | Draft    |
| [0004](./0004-component-styles-are-written-as-css-modules.md)                                           | Component styles are written as CSS Modules                                                            | Draft    |
| [0005](./0005-one-folder-per-component-named-after-its-base-ui-entry-point.md)                          | One folder per component, named after its Base UI entry point                                          | Draft    |
| [0006](./0006-the-prop-surface-is-a-generated-catalogue-checked-in-ci.md)                               | The prop surface of `@ds/react` is a generated catalogue, committed and checked in CI                  | Draft    |
| [0007](./0007-tokens-are-authored-as-dtcg-json-one-file-per-collection.md)                              | Tokens are authored as DTCG 2025.10 JSON, one file per collection                                      | Draft    |
| [0008](./0008-two-token-tiers-semantic-colour-references-primitives.md)                                 | Two token tiers: semantic colour references primitives, and paths mirror the Figma names               | Draft    |
| [0009](./0009-tokens-build-to-one-stylesheet-of-custom-properties-and-the-theme-is-a-root-attribute.md) | Tokens build to one stylesheet of custom properties, and the theme is an attribute on the root element | Draft    |
| [0010](./0010-icons-come-from-phosphor.md)                                                              | Icons come from Phosphor, through `@phosphor-icons/react`                                              | Draft    |

<!-- adr-index:end -->

## Adding an ADR

1. Copy [`0000-template.md`](./0000-template.md); number it sequentially (`NNNN-kebab-title.md`).
2. Start at **Draft**; promote as the decision firms up and lands in code. The status lives in the
   record and nowhere else.
3. Run **`pnpm adr-index`**, and commit the regenerated table. Never edit it by hand.

`pnpm adr-index:check` fails the build if you skip step 3 — an ADR that is not in the index does not
exist, because nobody browses a directory listing.

The `ds-decide` skill does all three, and will refuse to bundle two separable decisions into one
record.

## What belongs here, and what does not

|                                                        | Goes in          | Why                                                                     |
| ------------------------------------------------------ | ---------------- | ----------------------------------------------------------------------- |
| "We will namespace every custom property"              | `docs/ADR/`      | A decision. Changing it later has consequences worth tracing.           |
| "The Figma file has 41 variables across 3 collections" | `docs/research/` | A measurement. It has no consequences; it is evidence _for_ a decision. |
| The JSON Schema that enforces the decision             | next to the code | A contract. It moves with the implementation.                           |

`docs/research/` is the **pre-decision** space and `docs/ADR/` is the **post-decision** space. A
research document ends in open questions; an ADR answers one of them.

## Writing one that is worth reading

- **One decision per record.** If the draft contains two "we will" sentences that could be argued
  separately, it is two ADRs.
- **Context is evidence, not narrative.** Prefer a measured number to an adjective. "The manifest
  is 1.79 MB, so reading it to answer a question about one component is not viable in a context
  window" is context; "the manifest is quite large" is not.
- **Consequences must include real negatives.** An ADR with only positives was not a decision, it
  was an announcement. Name what this costs, what it forecloses, and what will go wrong quietly.
- **Alternatives considered** are only worth writing where someone would genuinely have chosen
  differently. Do not pad.
