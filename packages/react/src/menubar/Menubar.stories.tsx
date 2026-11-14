import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from '../menu/Menu';
import { Menubar } from './Menubar';

const meta: Meta = { title: 'Components/Menubar' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Menubar>
      <Menu.Root>
        <Menu.Trigger>First</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={4}>
            <Menu.Popup>
              <Menu.Item>Item one</Menu.Item>
              <Menu.Item>Item two</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <Menu.Root>
        <Menu.Trigger>Second</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={4}>
            <Menu.Popup>
              <Menu.Item>Item three</Menu.Item>
              <Menu.Item>Item four</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Menubar>
  ),
};
