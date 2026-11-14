import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberField } from './NumberField';

const meta: Meta = { title: 'Components/NumberField' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <NumberField.Root defaultValue={100}>
      <NumberField.ScrubArea>
        <label>Label</label>
        <NumberField.ScrubAreaCursor>↔</NumberField.ScrubAreaCursor>
      </NumberField.ScrubArea>
      <NumberField.Group>
        <NumberField.Decrement>−</NumberField.Decrement>
        <NumberField.Input aria-label="Example number field" />
        <NumberField.Increment>+</NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  ),
};
