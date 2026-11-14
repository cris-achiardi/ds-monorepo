import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './Separator';

const meta: Meta = { title: 'Components/Separator' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div>
      <p>Above</p>
      <Separator />
      <p>Below</p>
    </div>
  ),
};
