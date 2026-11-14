# ds-token-architecture

State written by the global `ds-token-architecture` skill: an audit of the token layer against the
three-tier architecture (definitions, usage, components). **Audit output, not a decision and not a
token source.** Nothing here is authoritative for a value or a name; decisions go in
[`docs/ADR/`](../docs/ADR/README.md).

| Path                         | Holds                                                              |
| ---------------------------- | ------------------------------------------------------------------ |
| [`PROFILE.md`](./PROFILE.md) | What was audited, where it lives, and what evidence was reachable  |
| `reports/`                   | One dated report per run: nine lights and a record per check       |
| `work-orders/`               | One dated work order per report: what to fix now, what to schedule |

A re-check is due when the first component is styled or a token build exists, whichever is first.
