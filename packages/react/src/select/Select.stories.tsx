import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const options = [
  { label: 'Option one', value: 'one' },
  { label: 'Option two', value: 'two' },
  { label: 'Option three', value: 'three' },
];

const meta: Meta = { title: 'Components/Select' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Select.Root items={options}>
      <Select.Label>Label</Select.Label>
      <Select.Trigger>
        <Select.Value placeholder="Select an option" />
        <Select.Icon>▾</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4}>
          <Select.Popup>
            <Select.List>
              {options.map(({ label, value }) => (
                <Select.Item key={value} value={value}>
                  <Select.ItemIndicator>✓</Select.ItemIndicator>
                  <Select.ItemText>{label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  ),
};
