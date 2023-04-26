import { ComponentMeta, ComponentStory } from "@storybook/react";

import Confirmation from "../../src/pages/confirmation";

export default {
  title: "2. Confirmation",
} as ComponentMeta<typeof Confirmation>;

const Template: ComponentStory<typeof Confirmation> = (args) => (
  <Confirmation {...args} />
);

export const Initial = Template.bind({});
