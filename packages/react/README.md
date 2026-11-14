# @ds/react

The React component library. Every Base UI component is re-exported here **with no styles and no
API of our own yet**: each module under `src/` is a pass-through.

## What is decided

| Fact                                                             | Where it is recorded                                                                            |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Behaviour comes from `@base-ui/react`, re-exported unchanged     | [ADR 0003](../../docs/ADR/0003-the-library-re-exports-base-ui-entry-points-unchanged.md)        |
| Styles will be CSS Modules beside the component (none exist yet) | [ADR 0004](../../docs/ADR/0004-component-styles-are-written-as-css-modules.md)                  |
| One folder per component, named after its Base UI entry point    | [ADR 0005](../../docs/ADR/0005-one-folder-per-component-named-after-its-base-ui-entry-point.md) |
| React 18 and 19 are supported as peers                           | `package.json` → `peerDependencies`                                                             |
| The package scope and the CSS / data-attribute prefixes          | `/ds.config.json` — never hard-code                                                             |
| Stories sit beside their component                               | `apps/storybook/README.md`                                                                      |

## What is here

```
src/<entry>/<Name>.ts            re-exports @base-ui/react/<entry>
src/<entry>/<Name>.stories.tsx   the component assembled with placeholder content, unstyled
src/index.ts                     the barrel: one line per module
```

38 components and 4 utilities (`CSPProvider`, `DirectionProvider`, `mergeProps`, `useRender`). The
utilities have no story.

### Modules

| Folder                | Main export         | Story |
| --------------------- | ------------------- | ----- |
| `accordion/`          | `Accordion`         | yes   |
| `alert-dialog/`       | `AlertDialog`       | yes   |
| `autocomplete/`       | `Autocomplete`      | yes   |
| `avatar/`             | `Avatar`            | yes   |
| `button/`             | `Button`            | yes   |
| `checkbox/`           | `Checkbox`          | yes   |
| `checkbox-group/`     | `CheckboxGroup`     | yes   |
| `collapsible/`        | `Collapsible`       | yes   |
| `combobox/`           | `Combobox`          | yes   |
| `context-menu/`       | `ContextMenu`       | yes   |
| `csp-provider/`       | `CSPProvider`       | no    |
| `dialog/`             | `Dialog`            | yes   |
| `direction-provider/` | `DirectionProvider` | no    |
| `drawer/`             | `Drawer`            | yes   |
| `field/`              | `Field`             | yes   |
| `fieldset/`           | `Fieldset`          | yes   |
| `form/`               | `Form`              | yes   |
| `input/`              | `Input`             | yes   |
| `menu/`               | `Menu`              | yes   |
| `menubar/`            | `Menubar`           | yes   |
| `merge-props/`        | `mergeProps`        | no    |
| `meter/`              | `Meter`             | yes   |
| `navigation-menu/`    | `NavigationMenu`    | yes   |
| `number-field/`       | `NumberField`       | yes   |
| `otp-field/`          | `OTPField`          | yes   |
| `popover/`            | `Popover`           | yes   |
| `preview-card/`       | `PreviewCard`       | yes   |
| `progress/`           | `Progress`          | yes   |
| `radio/`              | `Radio`             | yes   |
| `radio-group/`        | `RadioGroup`        | yes   |
| `scroll-area/`        | `ScrollArea`        | yes   |
| `select/`             | `Select`            | yes   |
| `separator/`          | `Separator`         | yes   |
| `slider/`             | `Slider`            | yes   |
| `switch/`             | `Switch`            | yes   |
| `tabs/`               | `Tabs`              | yes   |
| `toast/`              | `Toast`             | yes   |
| `toggle/`             | `Toggle`            | yes   |
| `toggle-group/`       | `ToggleGroup`       | yes   |
| `toolbar/`            | `Toolbar`           | yes   |
| `tooltip/`            | `Tooltip`           | yes   |
| `use-render/`         | `useRender`         | no    |

Usage, parts and props are Base UI's. The reference for a module is the page of the same name in
the documentation bundled with the dependency, under `docs/react/components/` in the installed
`@base-ui/react` package.

Import components from `@ds/react`, not from `@base-ui/react`: the module is where a component will
gain its styles, and a direct import bypasses it.

## Working on a component

Styling a component, or narrowing what it exposes, happens in its module and its folder. Nothing
here is styled, so several parts have no visible area yet (slider track and thumb, switch thumb,
progress and meter indicators, separator, scroll-area scrollbar). That is the expected state, not a
bug in the story.

Do not add placeholder values to make a story look finished. There are no tokens, and a hard-coded
value in a component stylesheet passes every check in this repository.

## What is not decided

Each of these is open. Decide it when a component forces the question, and write the decision down.

- How a stylesheet consumes tokens — decided with the token system
- Whether the public API stays Base UI's parts or gets narrowed per component
- How a consumer restyles a part
- Build tooling and the published entry points — `package.json` → `exports` points at source for
  now, which is enough for the workspace and Storybook but not for publishing
- Component testing
- Nothing checks that the modules here match the entry points of the installed Base UI version

## Commands

```bash
pnpm typecheck        # tsc over this package and the Storybook config
pnpm dev:storybook    # preview components
```

There is no `build` script yet. `pnpm build` at the root runs each package's `build` if it has one,
so adding the script here is all it takes to join the chain.
