import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from './ScrollArea';

const meta: Meta = { title: 'Components/ScrollArea' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <ScrollArea.Root>
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          {Array.from({ length: 20 }, (_, index) => (
            <p key={index}>Line {index + 1}</p>
          ))}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};
