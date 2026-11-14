import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextMenu } from './ContextMenu';

const meta: Meta = { title: 'Components/ContextMenu' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Item>Item one</ContextMenu.Item>
            <ContextMenu.Item>Item two</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item>Item three</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
};
