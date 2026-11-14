import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from '../field/Field';
import { Input } from './Input';

const meta: Meta = { title: 'Components/Input' };
export default meta;

export const Default: StoryObj = {
  render: () => <Input aria-label="Example input" placeholder="Placeholder" />,
};

export const Filled: StoryObj = {
  render: () => <Input aria-label="Example input" defaultValue="Value" />,
};

// `data-invalid` comes from the surrounding Field; Input has no invalid prop of its own.
export const Invalid: StoryObj = {
  render: () => (
    <Field.Root invalid>
      <Input aria-label="Example input" defaultValue="Value" />
    </Field.Root>
  ),
};

export const Disabled: StoryObj = {
  render: () => <Input aria-label="Example input" placeholder="Placeholder" disabled />,
};
