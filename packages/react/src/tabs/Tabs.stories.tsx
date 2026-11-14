import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

const meta: Meta = { title: 'Components/Tabs' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Tabs.Root defaultValue="one">
      <Tabs.List>
        <Tabs.Tab value="one">Tab one</Tabs.Tab>
        <Tabs.Tab value="two">Tab two</Tabs.Tab>
        <Tabs.Tab value="three">Tab three</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="one">Panel one</Tabs.Panel>
      <Tabs.Panel value="two">Panel two</Tabs.Panel>
      <Tabs.Panel value="three">Panel three</Tabs.Panel>
    </Tabs.Root>
  ),
};
