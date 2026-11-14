import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta = { title: 'Components/Button' };
export default meta;

export const Default: StoryObj = {
  render: () => <Button>Button</Button>,
};
