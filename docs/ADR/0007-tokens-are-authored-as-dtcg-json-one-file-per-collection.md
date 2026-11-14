# ADR 0007 — Tokens are authored as DTCG 2025.10 JSON, one file per collection

- **Status:** Draft
- **Date:** 2026-11-14
- **Deciders:** cris
- **Tags:** tokens, packaging, figma
- **Related:** [ADR 0008 — Two token tiers: semantic colour references primitives](./0008-two-token-tiers-semantic-colour-references-primitives.md)

## Context

`packages/tokens/README.md` listed the authoring format as the first open question of the token
system, and "modes and themes" as the fourth.

What existed when this was decided, on 2026-11-14:

- The linked Figma file held 183 local variables in 11 collections, read through the plugin API:
  Color primitives (74), Color semantic (42, modes Light and Dark), Spacing (15), Size (9), Border
  width (3), Radius (9), Opacity (8), Font size (8), Line height (7), Font weight (3), Duration (5).
  They were created in that file the same day, as an exploration, before any token existed in code.
- `.figma/schema/tokens.schema.json` already describes the code side of the map as "the DTCG tokens
  under packages/tokens/tokens/", so the location and the format family were anticipated by the
  scaffold but recorded nowhere as a decision.
- The Design Tokens Community Group publishes two modules dated 2025.10: the Format Module, which
  defines a token file, and the Resolver Module, which defines how files combine. Read from
  `https://www.designtokens.org/tr/2025.10/format/` and `/resolver/` on 2026-11-14.
- The Format Module has no concept of a mode: one file holds one value per token. A collection with
  two modes therefore cannot be one file without leaving the format.

The tension is between the request (each collection is a file) and the format (a file has no
modes).

## Decision

1. Tokens are authored as JSON that follows the DTCG Format Module 2025.10, in
   `packages/tokens/tokens/`, in files named `<collection>.tokens.json`.
2. There is one file per collection. A collection with modes has one file per mode, named
   `<collection>.<mode>.tokens.json`, and every mode file declares the same set of token paths.
3. How the files combine is declared in one DTCG Resolver Module 2025.10 document,
   `tokens.resolver.json`: single-mode files form a set, and each mode axis is a modifier.
4. Values use the format's own types and shapes: `color` as an sRGB object carrying `components` and
   `hex`, `dimension` and `duration` as `{ value, unit }`, `number`, `fontWeight`. `$type` is set
   once on the root group of each file.
5. These files are the canonical source for token values. A value that differs in Figma is drift in
   Figma.
6. A token type the format defines but Figma variables cannot hold (`shadow`, `cubicBezier`) still
   belongs in these files when it is added; having no Figma variable is not a reason to keep a token
   out of the source.

## Contract

| Concern                              | Where                                         |
| ------------------------------------ | --------------------------------------------- |
| The token files                      | `packages/tokens/tokens/`                     |
| How they combine, and the theme axis | `packages/tokens/tokens/tokens.resolver.json` |
| Collection to file                   | `.figma/manifest.json`                        |
| Variable to token path               | `.figma/maps/tokens.json`                     |
| Enforcement                          | `pnpm verify:figma` — the map only            |

Nothing validates the token files themselves. On 2026-11-14 they were checked once by a throwaway
script (every reference resolves in both themes; all 183 map paths exist) and were **not** validated
against the published JSON Schema, which did not compile in the validator this repository uses.

## Consequences

**Positive**

- The files are a published interchange format, so a build tool or a Figma importer can be chosen
  later without re-authoring the source.
- A collection maps to a file by name, so the Figma correspondence needs no lookup beyond the
  manifest.
- The theme axis is declared in the format's own mechanism rather than in a private extension.

**Negative / trade-offs**

- "One file per collection" does not hold for a collection with modes: Color semantic is two files.
  Adding a mode adds a file, and adding a token means editing every mode file.
- Twelve small files and a resolver, where a single file would be easier to read whole.
- There is no build. Nothing turns these files into CSS custom properties or typed constants, so no
  component can consume a token yet, and the resolver document has never been read by a tool.
- Dimensions are authored in `px` because that is what the Figma variables hold. Whether output uses
  `rem` is left to the build decision.
- **Quiet failure:** with no validation gate, a malformed value, a reference to a token that does
  not exist, or a mode file missing a path passes `pnpm verify`. So does a value changed in Figma and
  not here, or the reverse: the map records correspondence, not equality.

## Alternatives considered

**One file per collection with the second mode in `$extensions`** — keeps the one-file rule
literally. Rejected because the dark values would live in a private shape no DTCG tool reads.

**A single file per tier** — fewer files. Rejected because the request was one file per collection,
and because the file-to-collection match is what makes the Figma map trivial.
