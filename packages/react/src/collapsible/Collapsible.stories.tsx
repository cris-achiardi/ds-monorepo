import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible } from './Collapsible';

const meta: Meta = { title: 'Components/Collapsible' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Collapsible.Root>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Panel>Panel content</Collapsible.Panel>
    </Collapsible.Root>
  ),
};
