import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from '../field/Field';
import { Fieldset } from './Fieldset';

const meta: Meta = { title: 'Components/Fieldset' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Fieldset.Root>
      <Fieldset.Legend>Legend</Fieldset.Legend>
      <Field.Root>
        <Field.Label>First field</Field.Label>
        <Field.Control />
      </Field.Root>
      <Field.Root>
        <Field.Label>Second field</Field.Label>
        <Field.Control />
      </Field.Root>
    </Fieldset.Root>
  ),
};
