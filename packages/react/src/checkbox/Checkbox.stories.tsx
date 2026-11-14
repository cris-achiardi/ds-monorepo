import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta: Meta = { title: 'Components/Checkbox' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <label>
      <Checkbox.Root defaultChecked>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
      Label
    </label>
  ),
};
