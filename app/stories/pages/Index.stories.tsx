import { linkTo } from "@storybook/addon-links";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import Index from "../../src/pages/index";

export default {
  title: "1. Upload",
} as ComponentMeta<typeof Index>;

const Template: ComponentStory<typeof Index> = () => (
  <Index onSubmit={linkTo("2. Confirmation")} />
);

export const Initial = Template.bind({});
