import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from './Toggle';

const meta: Meta = { title: 'Components/Toggle' };
export default meta;

export const Default: StoryObj = {
  render: () => <Toggle aria-label="Example toggle">Toggle</Toggle>,
};
