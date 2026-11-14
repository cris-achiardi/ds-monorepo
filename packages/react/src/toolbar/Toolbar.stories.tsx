import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toolbar } from './Toolbar';

const meta: Meta = { title: 'Components/Toolbar' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Toolbar.Root>
      <Toolbar.Button>Button one</Toolbar.Button>
      <Toolbar.Button>Button two</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Group aria-label="Group">
        <Toolbar.Button>Button three</Toolbar.Button>
        <Toolbar.Button>Button four</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator />
      <Toolbar.Link href="#">Link</Toolbar.Link>
      <Toolbar.Input aria-label="Example input" placeholder="Placeholder" />
    </Toolbar.Root>
  ),
};
