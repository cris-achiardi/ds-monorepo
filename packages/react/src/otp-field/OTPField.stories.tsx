import type { Meta, StoryObj } from '@storybook/react-vite';
import { OTPField } from './OTPField';

const LENGTH = 6;

const meta: Meta = { title: 'Components/OTPField' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <OTPField.Root length={LENGTH} aria-label="Verification code">
      {Array.from({ length: LENGTH }, (_, index) => (
        <OTPField.Input key={index} aria-label={`Character ${index + 1} of ${LENGTH}`} />
      ))}
    </OTPField.Root>
  ),
};
