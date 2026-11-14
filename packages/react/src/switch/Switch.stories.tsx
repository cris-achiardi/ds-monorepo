import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { Switch } from './Switch';

const meta: Meta = { title: 'Components/Switch' };
export default meta;

// Story layout only: how a label sits beside the control is not part of the component.
const row: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--ds-spacing-8)',
  fontSize: 'var(--ds-font-size-14)',
  lineHeight: 'var(--ds-line-height-20)',
};

export const Default: StoryObj = {
  render: () => (
    <label style={row}>
      <Switch.Root defaultChecked>
        <Switch.Thumb />
      </Switch.Root>
      Label
    </label>
  ),
};

export const Unchecked: StoryObj = {
  render: () => (
    <label style={row}>
      <Switch.Root>
        <Switch.Thumb />
      </Switch.Root>
      Label
    </label>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ds-spacing-24)' }}>
      <label style={row}>
        <Switch.Root disabled>
          <Switch.Thumb />
        </Switch.Root>
        Off
      </label>
      <label style={row}>
        <Switch.Root disabled defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
        On
      </label>
    </div>
  ),
};
