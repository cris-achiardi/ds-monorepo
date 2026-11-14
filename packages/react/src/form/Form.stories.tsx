import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/Button';
import { Field } from '../field/Field';
import { Form } from './Form';

const meta: Meta = { title: 'Components/Form' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Form onSubmit={(event) => event.preventDefault()}>
      <Field.Root name="example">
        <Field.Label>Label</Field.Label>
        <Field.Control required placeholder="Required" />
        <Field.Error />
      </Field.Root>
      <Button type="submit">Submit</Button>
    </Form>
  ),
};
