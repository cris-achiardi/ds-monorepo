// Seam over the Base UI component, with this system's styles applied. See ../../README.md.
import { Button as BaseButton, type ButtonProps, type ButtonState } from '@base-ui/react/button';
import { withClassName } from '../internal/withClassName';
import styles from './Button.module.css';

export * from '@base-ui/react/button';

export const Button = withClassName(BaseButton, styles.root);
// The type namespace Base UI merges onto the component, restated because `Button` is redeclared.
export namespace Button {
  export type State = ButtonState;
  export type Props = ButtonProps;
}
