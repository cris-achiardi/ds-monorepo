import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from '../radio/Radio';
import { RadioGroup } from './RadioGroup';

const meta: Meta = { title: 'Components/RadioGroup' };
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
      <label>
        <Radio.Root value="three">
          <Radio.Indicator>●</Radio.Indicator>
        </Radio.Root>
        Option three
      </label>
    </RadioGroup>
  ),
};
