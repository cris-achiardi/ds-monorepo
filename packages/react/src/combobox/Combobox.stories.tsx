import type { Meta, StoryObj } from '@storybook/react-vite';
import { Combobox } from './Combobox';

interface Option {
  label: string;
  value: string;
}

const options: Option[] = [
  { label: 'Option one', value: 'one' },
  { label: 'Option two', value: 'two' },
  { label: 'Option three', value: 'three' },
];

const meta: Meta = { title: 'Components/Combobox' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Combobox.Root items={options}>
      <Combobox.Label>Label</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Type to filter" />
        <Combobox.Clear aria-label="Clear selection">×</Combobox.Clear>
        <Combobox.Trigger aria-label="Open popup">▾</Combobox.Trigger>
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup>
            <Combobox.Empty>No matches</Combobox.Empty>
            <Combobox.List>
              {(option: Option) => (
                <Combobox.Item key={option.value} value={option}>
                  <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
                  {option.label}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  ),
};
