import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavigationMenu } from './NavigationMenu';

const meta: Meta = { title: 'Components/NavigationMenu' };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>
            First
            <NavigationMenu.Icon>▾</NavigationMenu.Icon>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="#">Link one</NavigationMenu.Link>
            <NavigationMenu.Link href="#">Link two</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#">Second</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner sideOffset={10}>
          <NavigationMenu.Popup>
            <NavigationMenu.Arrow />
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  ),
};
