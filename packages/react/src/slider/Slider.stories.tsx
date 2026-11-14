import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './Slider';

const meta: Meta = { title: 'Components/Slider' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Slider.Root defaultValue={25}>
      <Slider.Value />
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb aria-label="Example slider" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  ),
};
