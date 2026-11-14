// The parts of `Combobox`. Same names and same props as Base UI's.
//
// STYLED here: Label, InputGroup, Input, Clear, Trigger, Popup, List, Item, ItemIndicator, Empty.
// PASSED THROUGH with no class of ours: every other part. A pass-through part renders with no
// styles, exactly as before this module was styled.
import { Combobox as Base } from '@base-ui/react/combobox';
import { withClassName } from '../internal/withClassName';
import styles from './Combobox.module.css';

// --- Passed through. `export import` carries the component and its type namespace together.
export import Root = Base.Root;
export import Value = Base.Value;
export import Status = Base.Status;
export import Portal = Base.Portal;
export import Backdrop = Base.Backdrop;
export import Positioner = Base.Positioner;
export import Arrow = Base.Arrow;
export import Icon = Base.Icon;
export import Group = Base.Group;
export import GroupLabel = Base.GroupLabel;
export import Chips = Base.Chips;
export import Chip = Base.Chip;
export import ChipRemove = Base.ChipRemove;
export import Row = Base.Row;
export import Collection = Base.Collection;
export import Separator = Base.Separator;
export import useFilter = Base.useFilter;
export import useFilteredItems = Base.useFilteredItems;
export import createItems = Base.createItems;

// --- Styled.
export const Label = withClassName(Base.Label, styles.label);
export namespace Label {
  export type State = Base.Label.State;
  export type Props = Base.Label.Props;
}

export const InputGroup = withClassName(Base.InputGroup, styles.inputGroup);
export namespace InputGroup {
  export type State = Base.InputGroup.State;
  export type Props = Base.InputGroup.Props;
}

export const Input = withClassName(Base.Input, styles.input);
export namespace Input {
  export type State = Base.Input.State;
  export type Props = Base.Input.Props;
}

export const Clear = withClassName(Base.Clear, styles.clear);
export namespace Clear {
  export type State = Base.Clear.State;
  export type Props = Base.Clear.Props;
}

export const Trigger = withClassName(Base.Trigger, styles.trigger);
export namespace Trigger {
  export type State = Base.Trigger.State;
  export type Props = Base.Trigger.Props;
}

export const Popup = withClassName(Base.Popup, styles.popup);
export namespace Popup {
  export type State = Base.Popup.State;
  export type Props = Base.Popup.Props;
}

export const List = withClassName(Base.List, styles.list);
export namespace List {
  export type State = Base.List.State;
  export type Props = Base.List.Props;
}

export const Item = withClassName(Base.Item, styles.item);
export namespace Item {
  export type State = Base.Item.State;
  export type Props = Base.Item.Props;
}

export const ItemIndicator = withClassName(Base.ItemIndicator, styles.itemIndicator);
export namespace ItemIndicator {
  export type State = Base.ItemIndicator.State;
  export type Props = Base.ItemIndicator.Props;
}

export const Empty = withClassName(Base.Empty, styles.empty);
export namespace Empty {
  export type State = Base.Empty.State;
  export type Props = Base.Empty.Props;
}
