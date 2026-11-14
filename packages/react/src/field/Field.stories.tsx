import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';

const meta: Meta = { title: 'Components/Field' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Field.Root>
      <Field.Label>Label</Field.Label>
      <Field.Control required placeholder="Required" />
      <Field.Error match="valueMissing">This field is required</Field.Error>
      <Field.Description>Description</Field.Description>
    </Field.Root>
  ),
};
