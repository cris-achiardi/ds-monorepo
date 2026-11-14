import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from '../radio-group/RadioGroup';
import { Radio } from './Radio';

const meta: Meta = { title: 'Components/Radio' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <RadioGroup aria-label="Options" defaultValue="one">
      <label>
        <Radio.Root value="one">
          <Radio.Indicator>●</Radio.Indicator>
        </Radio.Root>
        Option one
      </label>
      <label>
        <Radio.Root value="two">
          <Radio.Indicator>●</Radio.Indicator>
        </Radio.Root>
        Option two
      </label>
    </RadioGroup>
  ),
};
