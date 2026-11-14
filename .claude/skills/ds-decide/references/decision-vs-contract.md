# Decision vs contract — where the line falls

The one rule that decides what goes in an ADR and what does not:

> **An ADR records the decision and stays agnostic. The specifics that realize it are its
> contracts, they live with the code they govern, and the record _links_ them.**

## Why, concretely

Contracts change on the implementation's schedule. A JSON schema gains a field; a script gets a
new check; a generated file grows a section. If those specifics live inside the record, then every
one of those changes is an edit to an Accepted decision — and a record that is edited constantly
is one nobody trusts to still mean what it said.

Keeping them out is what lets the decision hold still while the implementation moves.

## The test

Ask: **if this changed, would the decision have changed?**

- No → it is a contract. Link it.
- Yes → it is part of the decision. Write it.

Adding a required section to `scripts/design-index.mjs` does not change the decision "design
guidance lives in `docs/design/` as checkable principles". So the script is a contract. Deciding that
a record holds _principles rather than recipes_ does change the decision, so it belongs in the
record.

## Worked example

ADR 0002 in this repo splits like this:

| Belongs in the **record**                          | Belongs in the **contract table**  |
| -------------------------------------------------- | ---------------------------------- |
| "Design direction is its own documentation layer"  | `docs/design/README.md`            |
| "A record states principles, not recipes"          | `docs/design/_template.md`         |
| "Every principle has a check"                      | `scripts/design-index.mjs`         |
| "A gap is an open question, never a guessed value" | the `OQn` section the script needs |

Notice the shape: the left column is **rules**, the right column is **files**. If your left column
has a file path in it, or your right column has a sentence in it, the line is in the wrong place.

## What a Contract table looks like

```markdown
## Contract

The realizing specifics live with the code they govern, not here:

| Concern           | Where                                                               |
| ----------------- | ------------------------------------------------------------------- |
| Shape of a record | `docs/design/_template.md`                                          |
| Enforcement       | `scripts/design-index.mjs` (`pnpm design-index:check`, gated in CI) |
| Reading guide     | `docs/design/README.md`                                             |
```

Always name **how it is enforced**, not just where it lives. A contract with no gate is a
suggestion, and it is worth the record saying which of the two this is.

## The failure mode to watch for

Erosion is gradual and comfortable: one convenient field at a time, each individually reasonable.
A record that started as a decision becomes a specification, then becomes stale, then becomes
misleading. The moment you want to paste a schema fragment "just so it is all in one place", that
is the erosion starting.
