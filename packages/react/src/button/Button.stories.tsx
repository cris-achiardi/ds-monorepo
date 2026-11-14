import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRightIcon, PlusIcon } from '@phosphor-icons/react';
import { Button } from './Button';

const meta: Meta = { title: 'Components/Button' };
export default meta;

export const Default: StoryObj = {
  render: () => <Button>Button</Button>,
};

export const WithIcon: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ds-spacing-12)' }}>
      <Button>
        <PlusIcon weight="bold" />
        Add item
      </Button>
      <Button>
        Continue
        <ArrowRightIcon weight="bold" />
      </Button>
    </div>
  ),
};

export const Disabled: StoryObj = {
  render: () => <Button disabled>Button</Button>,
};
