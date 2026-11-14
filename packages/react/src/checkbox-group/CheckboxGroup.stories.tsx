import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '../checkbox/Checkbox';
import { CheckboxGroup } from './CheckboxGroup';

const meta: Meta = { title: 'Components/CheckboxGroup' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <CheckboxGroup aria-label="Options" defaultValue={['one']}>
      <label>
        <Checkbox.Root value="one">
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
        Option one
      </label>
      <label>
        <Checkbox.Root value="two">
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
        Option two
      </label>
      <label>
        <Checkbox.Root value="three">
          <Checkbox.Indicator>✓</Checkbox.Indicator>
        </Checkbox.Root>
        Option three
      </label>
    </CheckboxGroup>
  ),
};
