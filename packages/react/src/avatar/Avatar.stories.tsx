import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta: Meta = { title: 'Components/Avatar' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Avatar.Root>
      <Avatar.Fallback>AB</Avatar.Fallback>
    </Avatar.Root>
  ),
};
