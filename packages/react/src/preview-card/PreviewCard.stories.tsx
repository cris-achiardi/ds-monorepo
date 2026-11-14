import type { Meta, StoryObj } from '@storybook/react-vite';
import { PreviewCard } from './PreviewCard';

const meta: Meta = { title: 'Components/PreviewCard' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <PreviewCard.Root>
      <p>
        Hover the <PreviewCard.Trigger href="#">link</PreviewCard.Trigger> to preview it.
      </p>
      <PreviewCard.Portal>
        <PreviewCard.Positioner sideOffset={8}>
          <PreviewCard.Popup>
            <PreviewCard.Arrow />
            Preview content
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  ),
};
