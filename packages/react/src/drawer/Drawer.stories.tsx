import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './Drawer';

const meta: Meta = { title: 'Components/Drawer' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>Open drawer</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Content>
              <Drawer.Title>Title</Drawer.Title>
              <Drawer.Description>Description</Drawer.Description>
              <Drawer.Close>Close</Drawer.Close>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  ),
};
