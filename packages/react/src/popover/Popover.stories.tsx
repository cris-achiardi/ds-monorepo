import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';

const meta: Meta = { title: 'Components/Popover' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Open popover</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Title>Title</Popover.Title>
            <Popover.Description>Description</Popover.Description>
            <Popover.Close>Close</Popover.Close>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};
