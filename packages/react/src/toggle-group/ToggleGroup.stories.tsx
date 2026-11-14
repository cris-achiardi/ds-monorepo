import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '../toggle/Toggle';
import { ToggleGroup } from './ToggleGroup';

const meta: Meta = { title: 'Components/ToggleGroup' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <ToggleGroup aria-label="Options" defaultValue={['one']}>
      <Toggle value="one">One</Toggle>
      <Toggle value="two">Two</Toggle>
      <Toggle value="three">Three</Toggle>
    </ToggleGroup>
  ),
};
