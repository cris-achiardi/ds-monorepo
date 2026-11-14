import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertDialog } from './AlertDialog';

const meta: Meta = { title: 'Components/AlertDialog' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Open alert dialog</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Viewport>
          <AlertDialog.Popup>
            <AlertDialog.Title>Title</AlertDialog.Title>
            <AlertDialog.Description>Description</AlertDialog.Description>
            <AlertDialog.Close>Close</AlertDialog.Close>
          </AlertDialog.Popup>
        </AlertDialog.Viewport>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};
