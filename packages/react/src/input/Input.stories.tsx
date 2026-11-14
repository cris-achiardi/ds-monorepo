import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta: Meta = { title: 'Components/Input' };
export default meta;

export const Default: StoryObj = {
  render: () => <Input aria-label="Example input" placeholder="Placeholder" />,
};
