# @ds/react

The React component library. Every Base UI component is re-exported here **with no API of our own**.
Four modules are styled with the tokens: `button/`, `switch/`, `input/` and `combobox/`. Every other
module under `src/` is still a pass-through with no styles.

## What is decided

| Fact                                                                | Where it is recorded                                                                                                     |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Behaviour comes from `@base-ui/react`, re-exported unchanged        | [ADR 0003](../../docs/ADR/0003-the-library-re-exports-base-ui-entry-points-unchanged.md)                                 |
| Styles are CSS Modules beside the component                         | [ADR 0004](../../docs/ADR/0004-component-styles-are-written-as-css-modules.md)                                           |
| A stylesheet reads tokens as `var(--ds-…)` and holds no other value | [ADR 0009](../../docs/ADR/0009-tokens-build-to-one-stylesheet-of-custom-properties-and-the-theme-is-a-root-attribute.md) |
| Icons are Phosphor, imported from `@phosphor-icons/react`           | [ADR 0010](../../docs/ADR/0010-icons-come-from-phosphor.md)                                                              |
| One folder per component, named after its Base UI entry point       | [ADR 0005](../../docs/ADR/0005-one-folder-per-component-named-after-its-base-ui-entry-point.md)                          |
| React 18 and 19 are supported as peers                              | `package.json` → `peerDependencies`                                                                                      |
| The package scope and the CSS / data-attribute prefixes             | `/ds.config.json` — never hard-code                                                                                      |
| Stories sit beside their component                                  | `apps/storybook/README.md`                                                                                               |
| The prop surface is a generated catalogue, checked in CI            | [ADR 0006](../../docs/ADR/0006-the-prop-surface-is-a-generated-catalogue-checked-in-ci.md)                               |

## What is here

```
src/<entry>/<Name>.ts            re-exports @base-ui/react/<entry>
src/<entry>/<Name>.parts.ts      STYLED MODULES ONLY, when the export is a namespace of parts
src/<entry>/<Name>.module.css    STYLED MODULES ONLY: the stylesheet
src/<entry>/<Name>.stories.tsx   the component assembled with placeholder content
src/internal/withClassName.tsx   gives a Base UI part a class and changes nothing else about it
src/css-modules.d.ts             the type of a `*.module.css` import
src/<entry>/<Name>.props.json    GENERATED: every component and part of the module, with its props
prop-catalogue.json              GENERATED: the index — which components take each prop
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

### The prop catalogue

`<Name>.props.json` and `prop-catalogue.json` are written by `pnpm prop-catalogue` from the types
the barrel exports: for each prop its type, its documented default (`null` when none is documented)
and whether it is required. Start at the index to find where a prop is used, then open one
module's file. Never edit them by hand.

`pnpm prop-catalogue:check` fails when they no longer match the types — after an upgrade of
`@base-ui/react` or `typescript`, or an edit to a module. If the change is intended, regenerate and
commit the result with it.

Import components from `@ds/react`, not from `@base-ui/react`: the module is where a component will
gain its styles, and a direct import bypasses it.

## Working on a component

Styling a component, or narrowing what it exposes, happens in its module and its folder. In an
unstyled module several parts have no visible area yet (slider track and thumb, progress and meter
indicators, separator, scroll-area scrollbar). That is the expected state, not a bug in the story.

### How a module is styled

`button/` and `switch/` are the two shapes to copy.

- **A single component** (`Button`, `Input`): the module redeclares the export as
  `withClassName(Base, styles.root)` and restates the type namespace Base UI merges onto it.
- **A namespace of parts** (`Switch`, `Combobox`): a `<Name>.parts.ts` file exports every part. A
  styled part is `withClassName(Base.Part, styles.part)` plus its type namespace; a part with no
  styles is passed through with `export import Part = Base.Part`. The module then does
  `export * as <Name> from './<Name>.parts'`.

Either way the props are Base UI's: `pnpm prop-catalogue:check` passed unchanged after the four
modules were styled, and it is the check that a styled module did not alter the prop surface. A
consumer's `className` is kept and placed after ours.

### What a stylesheet may contain

Token references and structure, nothing else
([ADR 0009](../../docs/ADR/0009-tokens-build-to-one-stylesheet-of-custom-properties-and-the-theme-is-a-root-attribute.md),
rule 7). **Nothing enforces this**: a hard-coded colour or pixel value in a CSS Module passes every
check in this repository, and so does `var()` of a custom property that does not exist.

Do not add a token to fill a gap in a component. Where the four styled modules met a gap, they did
without, and the gap is listed below.

### Gaps the four styled modules met

Each is a decision that was not made, recorded so it is not mistaken for one.

- **One look per component.** A variant (`secondary`, `destructive`, a size) would be a prop of our
  own. `Button` is the accent fill only.
- **No font family.** There is no font-family token; every styled part inherits it.
- **No shadow.** The Combobox popup is separated from the page by `border.default` alone, which is
  1.48:1 against the page in the light theme.
- **No easing.** Transitions name a duration token and use the browser's default curve.
- **No z-index.** `Combobox.Positioner` is passed through and stacks in document order.
- **The switch thumb has no role.** It uses `bg.inverse` when off, the only fill that reaches 3:1
  against `bg.muted` in both themes, and `accent.on` when on.
- **The focus ring.** `border.focus` at `border-width.2`, offset by `spacing.2` on Button and
  Switch, and drawn over the border on Input and the Combobox field. The offset was chosen here,
  not decided.
- **Icon weight.** See [ADR 0010](../../docs/ADR/0010-icons-come-from-phosphor.md).

## What is not decided

Each of these is open. Decide it when a component forces the question, and write the decision down.

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
pnpm prop-catalogue   # regenerate the prop catalogue
```

There is no `build` script yet. `pnpm build` at the root runs each package's `build` if it has one,
so adding the script here is all it takes to join the chain.
