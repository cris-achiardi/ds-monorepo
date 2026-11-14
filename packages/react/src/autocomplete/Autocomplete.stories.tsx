import type { Meta, StoryObj } from '@storybook/react-vite';
import { Autocomplete } from './Autocomplete';

interface Option {
  id: string;
  value: string;
}

const options: Option[] = [
  { id: '1', value: 'Option one' },
  { id: '2', value: 'Option two' },
  { id: '3', value: 'Option three' },
];

const meta: Meta = { title: 'Components/Autocomplete' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Autocomplete.Root items={options}>
      <label>
        Label
        <Autocomplete.Input placeholder="Type to filter" />
      </label>
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={4}>
          <Autocomplete.Popup>
            <Autocomplete.Empty>No matches</Autocomplete.Empty>
            <Autocomplete.List>
              {(option: Option) => (
                <Autocomplete.Item key={option.id} value={option}>
                  {option.value}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  ),
};
