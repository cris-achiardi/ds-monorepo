# How this design system works

Written for designers. No knowledge of the code assumed.

|     |                                                              |                                          |
| --- | ------------------------------------------------------------ | ---------------------------------------- |
| 1   | [From Figma to a component](./01-from-figma-to-component.md) | Why your variants don't survive the trip |

More pages get added as the system gets built — how tokens work, how a component is put together.
They are not written yet because those things are not decided yet, and an explanation of a system
that does not exist reads exactly like an explanation of one that does.

## These pages explain. They don't decide.

Everywhere else in this repo, each fact lives in exactly one place and everything points at it
rather than restating it — that's what stops docs drifting.

These pages break that rule on purpose, because an explanation that refuses to restate anything is
useless. So: **if one of these ever disagrees with the technical doc it links to, the technical doc
is right and this one is stale.** Say so and we'll fix it.

| Topic                      | The real spec               |
| -------------------------- | --------------------------- |
| How we read the Figma file | `.figma/README.md`          |
| How decisions get recorded | `docs/ADR/README.md`        |
| How a screen should look   | `docs/design/README.md`     |
| The component library      | `packages/react/README.md`  |
| The tokens                 | `packages/tokens/README.md` |
