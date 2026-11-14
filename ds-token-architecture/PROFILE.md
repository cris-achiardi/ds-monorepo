# PROFILE.md — ds-monorepo

_Checked in: 2026-11-14 · Mode: assess · Re-confirm at next run_

The intake questions were not put to the owner; every row below was discovered from the repo and
from a live read of the Figma file. Rows that could not be discovered say so.

**The target moved during the run.** The first read found 0 variables in the Figma file and an empty
`packages/tokens`. Part-way through, 183 variables in 11 collections and 13 files under
`packages/tokens/tokens/` appeared, written by other work in progress in the same working tree. All
counts below are from the second read. The working tree was uncommitted and still changing; this
profile describes it as it stood at that read.

## The system

- Serves: `@ds/react` (43 component folders, every Base UI entry point re-exported unstyled) and
  the Storybook preview app. No consuming product yet.
- Age & origin: scaffolded 2026-11-14 from `weave-ds-template`. Deliberate build, pre-v0.
- Owner: the repository owner authors the token system (`AGENTS.md`).
- Why now: the token set was minted today from a canvas exploration. Nothing consumes it yet, so
  this is the cheapest moment a change will ever have.

## Token sources

- Code: `packages/tokens/tokens/`, DTCG 2025.10 JSON, one file per collection (12 token files, 225
  token entries) plus `tokens.resolver.json` (one set `primitives`, one modifier `theme` with
  contexts `light` and `dark`). No build; `package.json` has no `build` script.
- Design: Figma file `4IXxagPAVz0QWGDlnBsfYr`. 11 variable collections, 183 variables, 0 paint /
  text / effect styles. Page `Tokens` (node `1:5`) holds four sections of drawn swatches, the
  exploration the variables were minted from; 0 of its nodes are bound to a variable.
- Source of truth when they disagree: code is canonical for values (`.figma/manifest.json`).
- Map: `.figma/maps/tokens.json` records all 183 variables against a code path; 0 are `code: null`.
- Consumers reachable: `packages/react/src` (live). No product.
- Docs: `packages/tokens/README.md`, `.figma/README.md`. No token page. ADR 0007 and ADR 0008 (both Draft) record the format and the tiers; they appeared after the token files, during this run.

## Evidence access map

| Source                | Access | Verified how                                                                                                                                                                            |
| --------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Token source (code)   | live   | Parsed all 13 files under `packages/tokens/tokens/`; resolved every semantic `$value` against the primitives file                                                                       |
| Token source (design) | live   | Figma Console MCP (Desktop Bridge 1.41.5). `figma_execute` walked `valuesByMode` for all 183 variables, read scopes and publishing flags, and read all 1,270 nodes on the `Tokens` page |
| Consumers             | live   | Grep of `packages/react` (`*.ts`, `*.tsx`, `*.css`) for hex, `px` and `rgb()` literals: 0 files matched                                                                                 |
| Build & docs          | live   | Read `.figma/manifest.json`, `.figma/maps/tokens.json`, `ds.config.json`, `AGENTS.md`; ran `pnpm verify:docs`                                                                           |

## Vocabulary translation

| Architecture says    | This system says                                                   | Evidence                                                    |
| -------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Tier 1 / definitions | "primitives" (`color.blue.800`, `Blue/800`; scales named by value) | Collection `Color primitives`; resolver set `primitives`    |
| Tier 2 / usage       | "semantic" (`color.bg.page`, `bg/page`)                            | Collection `Color semantic`; `color-semantic.*.tokens.json` |
| Tier 3 / components  | not present                                                        | No collection, no file                                      |
| Knockout             | `on` (`accent/on`, `accent2/on`) and `inverse`                     | `accent/on`: "Text and icons on accent/default"             |
| Content              | `text` (covers text and icons)                                     | `success/text`: "Text and icons"                            |

## Known symptoms

- Not asked.

## Probable greens

- The canvas states a WCAG ratio beside every role that has one and flags its own failure in red.
- `$description` on semantic tokens records the job of each role.

## Intentional deviations

- `bg/backdrop` holds a raw colour with alpha in both themes; its `$description` states why ("a
  reference cannot carry alpha").
- `@ds/react` has no styles on purpose (`AGENTS.md`).
- The typeface is recorded on the canvas as undecided.

## Scope & frame

- Checks this pass: all nine · Frame: solo maintainer, pre-v0
- Out of scope: changing any variable, token file or name. Those are the owner's.
