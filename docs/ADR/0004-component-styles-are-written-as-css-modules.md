# ADR 0004 — Component styles are written as CSS Modules

- **Status:** Draft
- **Date:** 2026-11-14
- **Deciders:** cris
- **Tags:** components, styling
- **Related:** [ADR 0003 — `@ds/react` depends on `@base-ui/react` and re-exports each component entry point unchanged](./0003-the-library-re-exports-base-ui-entry-points-unchanged.md)

## Context

`packages/react/README.md` listed the styling approach as undecided, to be settled when the first
component forced the question. On 2026-11-14 all 38 Base UI components were brought into
`packages/react/src/` as unstyled re-exports ([ADR 0003](./0003-the-library-re-exports-base-ui-entry-points-unchanged.md)),
so the next change to any of them is a styling change and needs an approach to follow.

What is true today:

- Base UI components accept a `className` on every part and expose state through data attributes
  and CSS variables. They ship no styles.
- The documentation bundled with `@base-ui/react@1.9.0` gives each demo in two forms, Tailwind and
  CSS Modules.
- The preview app builds with Vite, which handles `*.module.css` with no added dependency.
- No stylesheet exists in `packages/react/` yet, and `packages/tokens` produces nothing, so there is
  no token to consume.

This record is a Draft because nothing implements it. It records the choice of approach only.

## Decision

1. A component's styles are written in a CSS Module that sits beside the component's module.
2. No styling runtime or utility-class framework is added to `@ds/react`.
3. How a stylesheet reads tokens is not decided here. It is decided with the token system, in its
   own record.

## Contract

No artifact realizes this decision yet. The first component stylesheet under `packages/react/src/`
is its first contract, and this table is filled in then.

## Consequences

**Positive**

- Class names are scoped per file, so a component's styles cannot collide with a consumer's.
- No dependency is added, and the approach matches one of the two forms upstream documents.

**Negative / trade-offs**

- Publishing `@ds/react` will need a build step that compiles the modules and ships the CSS. The
  package has no build today, so this decision adds to that open work.
- Scoped class names are not a public styling API. A consumer who needs to restyle a part has to be
  given a supported way to do it, and that is not designed.
- **Quiet failure:** a CSS Module accepts any value. Until tokens exist and a gate checks for
  hard-coded values, a stylesheet full of literals passes every check in this repository.

## Alternatives considered

**Tailwind** — the other form upstream documents. Not chosen: it adds a dependency and a
configuration that would have to be wired to a token system that does not exist yet.

**Plain CSS with hand-named classes** — not chosen: collision avoidance becomes a naming convention
that nothing enforces.
