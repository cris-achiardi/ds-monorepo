import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';

function ToastButton() {
  const toastManager = Toast.useToastManager();
  return (
    <button
      type="button"
      onClick={() => toastManager.add({ title: 'Title', description: 'Description' })}
    >
      Create toast
    </button>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => (
    <Toast.Root key={toast.id} toast={toast}>
      <Toast.Content>
        <Toast.Title />
        <Toast.Description />
        <Toast.Close>Dismiss</Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ));
}

const meta: Meta = { title: 'Components/Toast' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Toast.Provider>
      <ToastButton />
      <Toast.Portal>
        <Toast.Viewport>
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  ),
};
