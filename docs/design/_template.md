# <Concern>

<!--
Template for a design record. Copy to docs/design/<kebab-concern>.md, fill it, then run
`pnpm design-index`.

The three list lines below are read by the index generator (scripts/design-index.mjs):
  Status    — Draft | Current | Superseded by <record>
  Owns      — one line; it becomes the record's row in docs/design/README.md
  Carried by — links to the components or token groups this concern is expressed through, or
               "nothing yet"

A record states INTENT and names what carries it. It never restates a token value, a
prop union or a pixel size: those live in packages/react and packages/tokens, and change
with the code. The perceptual thresholds a record does carry
(a contrast ratio, a line-length range) are review targets, not system values.

Where a rule needs a mapping no component or token carries yet, say so under Open questions. A gap
written down is more useful than a value guessed.

Every section below is required; `pnpm design-index:check` fails on a record missing one.
-->

- **Status:** Draft
- **Owns:** <the one concern this record decides>
- **Carried by:** <links to components or token groups, or "nothing yet">

## Intent

<Who is affected, and what they should perceive, understand or be able to do.>

## Principles

- **DR1 — <Principle>.** <The design MUST / SHOULD …>

## Checks

<How to test each principle on a real design. Written so an agent can run it from code, tokens or
a screenshot, not only by eye.>

| Principle | Check |
| --------- | ----- |
| DR1       | <…>   |

## In this system

<Which component, token group or gate carries each principle. No values. "Nothing yet" is a valid
answer and points at an open question.>

| Principle | Carried by      |
| --------- | --------------- |
| DR1       | <Name> — <what> |

## Don't

- <An anti-pattern this concern rules out.>

## Open questions

- **OQ1 — <Question>.** <What is undecided, and what would decide it.>

## Boundary

This record does not define <what it leaves to other owners>.
