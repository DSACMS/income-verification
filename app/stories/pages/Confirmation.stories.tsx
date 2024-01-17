import { ComponentMeta, ComponentStory } from "@storybook/react";

import Confirmation from "../../src/pages/upload/confirmation";

export default {
  title: "Confirmation Page",
} as ComponentMeta<typeof Confirmation>;

const Template: ComponentStory<typeof Confirmation> = (args) => (
  <Confirmation {...args} />
);

export const ConfirmationPage = Template.bind({});
