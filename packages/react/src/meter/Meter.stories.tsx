import type { Meta, StoryObj } from '@storybook/react-vite';
import { Meter } from './Meter';

const meta: Meta = { title: 'Components/Meter' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Meter.Root value={24}>
      <Meter.Label>Label</Meter.Label>
      <Meter.Track>
        <Meter.Indicator />
      </Meter.Track>
      <Meter.Value />
    </Meter.Root>
  ),
};
