import type { Meta, StoryObj } from '@storybook/react-vite';
import { CaretDownIcon, CheckIcon, XIcon } from '@phosphor-icons/react';
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

const render = (disabled: boolean, open = false) => (
  <Combobox.Root
    items={options}
    disabled={disabled}
    defaultOpen={open}
    defaultValue={open ? options[1] : undefined}
  >
    <Combobox.Label>Label</Combobox.Label>
    <Combobox.InputGroup>
      <Combobox.Input placeholder="Type to filter" />
      <Combobox.Clear aria-label="Clear selection">
        <XIcon weight="bold" />
      </Combobox.Clear>
      <Combobox.Trigger aria-label="Open popup">
        <CaretDownIcon weight="bold" />
      </Combobox.Trigger>
    </Combobox.InputGroup>
    <Combobox.Portal>
      <Combobox.Positioner sideOffset={4}>
        <Combobox.Popup>
          <Combobox.Empty>No matches</Combobox.Empty>
          <Combobox.List>
            {(option: Option) => (
              <Combobox.Item key={option.value} value={option}>
                <Combobox.ItemIndicator>
                  <CheckIcon weight="bold" />
                </Combobox.ItemIndicator>
                {option.label}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
);

export const Default: StoryObj = { render: () => render(false) };

// Opens on load with a value selected, so the popup, the highlight and the indicator are visible.
export const Open: StoryObj = { render: () => render(false, true) };

export const Disabled: StoryObj = { render: () => render(true) };
