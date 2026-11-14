# Work Order — ds-monorepo

_From: `ds-token-architecture/reports/2026-11-14-report.md` · Written: 2026-11-14_

Reds get fixed now. Yellows get scheduled. Greens get left alone. Every item cites its check and its
evidence. The owner owns the order; this is the recommendation. No item here was carried out; the
audit changed no variable and no token file.

Every rename or addition below lands in three places that must move together: the JSON under
`packages/tokens/tokens/`, the Figma variables, and `.figma/maps/tokens.json`.

## 🔴 Fix now

### 1. Give the three status fills a content colour

- **Check:** 4, Color semantics · **Evidence:** [verified] `success/default`, `warning/default` and
  `danger/default` (plus `danger/hover`) have no paired content token in either theme. No existing
  role can stand in: light `warning/default` needs dark text (12.20:1 vs 1.48:1 with white), light
  `success/default` and `danger/default` need white (6.17:1, 5.14:1).
- **Why it's first:** a destructive button cannot be styled without it, and the answer differs per
  theme, which is what a token exists to absorb.
- **First move:** add three content tokens to both theme files, named with whatever the pairing word
  turns out to be (item 3), each aliasing the step that passes.
- **AI assist:** computing every candidate step's ratio per theme is mechanical. Choosing the step
  and the name is a design decision.
- **Done when:** every non-page fill has a content token at or above 4.5:1 in both themes.
- **Effort:** S

### 2. Resolve `accent2/on` in the light theme

- **Check:** 4 · **Evidence:** [verified] White on Rose/600 is 4.04:1; the canvas marks it red and
  the token was minted with it. White on Rose/700 is 5.50:1.
- **Why it's first:** it is the only stated ratio that fails, and it sits on a brand colour.
- **First move:** choose between moving the light fill to Rose/700 (the brand hex stops being the
  fill), keeping Rose/600 and restricting it to large text or non-text use, or pairing it with dark
  content.
- **AI assist:** none beyond the arithmetic already done. This is a brand call.
- **Done when:** the pair passes, or the restriction is written into the token's `$description`.
- **Effort:** S

## 🟡 Schedule

### 3. Pick one segment order for semantic names

- **Check:** 3, Naming · **Evidence:** [verified] 16 names are `property/variant`, 26 are
  `intention/…`. The 26 are `ALL_SCOPES` in Figma because their groups mix fills, text and borders.
  `text/link` and `accent/text` are the same job and the same value in both themes. `inverse` and
  `on` both mean "content for a filled surface". `default` means fill in one group and mid-strength
  in another.
- **First move:** decide the order and the allowed words per segment, record it as an ADR, then
  rename. · **Done when:** one pattern describes all 42 names, each pairing uses one word, and every
  semantic variable has a scope narrower than `ALL_SCOPES`. · **Effort:** M
- **Suggested timing:** before the first component is styled. Zero consumers today.

### 4. Carry the audit's findings into ADR 0008

- **Check:** 3, 4 · **Evidence:** [verified] ADR 0008 (Draft) records the names as provisional and
  already lists the `accent2/on` failure and the missing `on` tokens. It does not record the two
  segment orders, the `ALL_SCOPES` consequence, or the quiet-background and focus-ring findings.
- **First move:** edit ADR 0008 in place (pre-v0 policy) when items 1 to 3 are decided. · **Done
  when:** the record matches the files. · **Effort:** S
- **Suggested timing:** with item 3.

### 5. Close tier 1 in the Figma pickers

- **Check:** 9 · **Evidence:** [verified] `Color primitives` is not hidden from publishing; all 74
  variables are `ALL_SCOPES`.
- **First move:** decide whether tier 1 is reachable by designers. If not, hide the collection from
  publishing and clear its scopes. · **Done when:** decided and recorded. · **Effort:** S
- **Suggested timing:** before the library is published.

### 6. Decide what quiet backgrounds are allowed to carry

- **Check:** 4 · **Evidence:** [verified] `text/placeholder` is 4.28:1 on `bg/subtle` and 3.81:1 on
  `bg/muted` (light), 3.64:1 on `bg/muted` (dark). `border/control` is 2.75:1 / 2.63:1 on
  `bg/muted`. Dark `bg/subtle` equals `bg/raised` (Neutral/1100).
- **First move:** either record that inputs only sit on `bg/page` and `bg/raised`, or move
  `text/placeholder` and `border/control` one step. For dark, separate `bg/subtle` from `bg/raised`.
  · **Done when:** each constraint is recorded or the ratios pass. · **Effort:** S
- **Suggested timing:** before the first input or menu is styled.

### 7. Decide the focus ring's relationship to the accent fill

- **Check:** 4 · **Evidence:** [verified] `border/focus` equals `accent/default` in both themes
  (1.00:1 against a primary button); 2.96:1 / 2.20:1 against `bg/inverse`.
- **First move:** decide the ring's offset. With a gap the ring is judged against the page and
  passes (6.10:1, 7.54:1); without one it needs its own colour. · **Done when:** recorded in the
  relevant `docs/design` record. · **Effort:** S
- **Suggested timing:** before the first focusable component is styled.

### 8. Decide whether shadow, easing and type pairings are tokens

- **Check:** 5, Beyond color · **Evidence:** [verified] The canvas draws 4 shadows, 3 easings and 8
  size / line-height pairs; none is a token or a variable. The shadow colour is Neutral/1200, the
  dark page colour, and no dark shadow is drawn.
- **First move:** per category, decide tokenized or not, and whether a semantic layer exists.
  Typography composites wait on the typeface. · **Done when:** recorded. · **Effort:** M
- **Suggested timing:** before the first floating component (tooltip, popover, dialog) is styled.

### 9. Gate what is mechanical

- **Check:** 2, 7 · **Evidence:** [verified] 0 broken references and 42 / 42 theme key parity today;
  nothing fails if either breaks. `verify:figma` does not check `code` paths or values.
- **First move:** a script that resolves every `{…}` reference and compares the key sets of the two
  theme files. Per `AGENTS.md`, it starts as a report and is promoted against a clean baseline. ·
  **Done when:** it runs in CI. · **Effort:** S
- **Suggested timing:** with the first token build.

## 🔧 Better evidence next time

- The intake interview was not run. Known pain points and the goal for the system are unrecorded in
  `PROFILE.md`.
- The token set changed under this audit. A re-check against a committed tree would be cleaner.
- Check 8 needs a styled component.

## 🟢 Keeping the greens green

- Check 6: keep tier 3 empty until a styled component proves a tier 2 role cannot serve it.
- Check 7: the key-parity gate in item 9. In Figma, parity is structural; in code it is two files.

## No guidance in the architecture

- **Size** scale (9 steps, 12 to 64px) for icons, controls and avatars.
- **Opacity** scale (8 steps), and `bg/backdrop`, which needs a colour and an alpha and holds a raw
  value because an alias cannot carry alpha.
- Scale variables named by bare value, repeated across collections.
- Whether decorative outlines (`success/border`, `warning/border`, 2.16 to 2.46:1 on their tinted
  fills) need a minimum.

## Cadence

- Re-check (all nine): when the first component is styled or a token build exists.
- Wire into CI now: item 9.
- Owner of this work order: the repository owner.
