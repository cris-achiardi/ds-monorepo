import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta: Meta = { title: 'Components/Switch' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <label>
      <Switch.Root defaultChecked>
        <Switch.Thumb />
      </Switch.Root>
      Label
    </label>
  ),
};
