// The parts of `Switch`, each given its class. Same names and same props as Base UI's.
import { Switch as Base } from '@base-ui/react/switch';
import { withClassName } from '../internal/withClassName';
import styles from './Switch.module.css';

export const Root = withClassName(Base.Root, styles.root);
export namespace Root {
  export type State = Base.Root.State;
  export type Props = Base.Root.Props;
  export type ChangeEventReason = Base.Root.ChangeEventReason;
  export type ChangeEventDetails = Base.Root.ChangeEventDetails;
}

export const Thumb = withClassName(Base.Thumb, styles.thumb);
export namespace Thumb {
  export type State = Base.Thumb.State;
  export type Props = Base.Thumb.Props;
}
