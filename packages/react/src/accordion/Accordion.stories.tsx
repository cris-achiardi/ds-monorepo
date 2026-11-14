import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';

const meta: Meta = { title: 'Components/Accordion' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Accordion.Root>
      <Accordion.Item>
        <Accordion.Header>
          <Accordion.Trigger>First item</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>First panel</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>
          <Accordion.Trigger>Second item</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>Second panel</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  ),
};
