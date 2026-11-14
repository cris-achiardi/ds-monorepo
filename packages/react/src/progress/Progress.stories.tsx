import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta: Meta = { title: 'Components/Progress' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Progress.Root value={40}>
      <Progress.Label>Label</Progress.Label>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
      <Progress.Value />
    </Progress.Root>
  ),
};
