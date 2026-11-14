# @ds/react

The React component library. **Empty on purpose**: `src/index.ts` exports nothing yet.

## What is decided

| Fact                                                    | Where it is recorded                |
| ------------------------------------------------------- | ----------------------------------- |
| Components are hand-written React, built on **Base UI** | this file — see "Not installed yet" |
| React 18 and 19 are supported as peers                  | `package.json` → `peerDependencies` |
| The package scope and the CSS / data-attribute prefixes | `/ds.config.json` — never hard-code |
| Stories sit beside their component                      | `apps/storybook/README.md`          |

## Not installed yet

Base UI is the intended behaviour layer and is **deliberately not a dependency yet**. Add it when
the first component is built, and record the decision in an ADR at that point (which package, which
version range, and how much of its API the library re-exports) — see
[`docs/ADR/README.md`](../../docs/ADR/README.md).

## What is not decided

Each of these is open. Decide it when the first component forces the question, and write the
decision down rather than letting the first file set the convention by accident.

- Styling approach (CSS Modules, plain CSS, something else) and how tokens are consumed
- Folder layout and file naming under `src/`
- Build tooling and the published entry points — `package.json` → `exports` points at source for
  now, which is enough for the workspace and Storybook but not for publishing
- Component testing

## Commands

```bash
pnpm typecheck        # tsc over this package and the Storybook config
pnpm dev:storybook    # preview components
```

There is no `build` script yet. `pnpm build` at the root runs each package's `build` if it has one,
so adding the script here is all it takes to join the chain.
