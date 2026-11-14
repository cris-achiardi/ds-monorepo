import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from './Menu';

const meta: Meta = { title: 'Components/Menu' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Open menu</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="start">
          <Menu.Popup>
            <Menu.Item>Item one</Menu.Item>
            <Menu.Item>Item two</Menu.Item>
            <Menu.Separator />
            <Menu.Item>Item three</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};
