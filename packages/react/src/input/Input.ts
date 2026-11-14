// Seam over the Base UI component, with this system's styles applied. See ../../README.md.
import {
  Input as BaseInput,
  type InputChangeEventDetails,
  type InputChangeEventReason,
  type InputProps,
  type InputState,
} from '@base-ui/react/input';
import { withClassName } from '../internal/withClassName';
import styles from './Input.module.css';

export * from '@base-ui/react/input';

export const Input = withClassName(BaseInput, styles.root);
// The type namespace Base UI merges onto the component, restated because `Input` is redeclared.
export namespace Input {
  export type Props = InputProps;
  export type State = InputState;
  export type ChangeEventReason = InputChangeEventReason;
  export type ChangeEventDetails = InputChangeEventDetails;
}
