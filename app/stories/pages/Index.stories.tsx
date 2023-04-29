import { linkTo } from "@storybook/addon-links";
import { ComponentMeta, ComponentStory } from "@storybook/react";



import Index from "../../src/pages/index";

export default {
  title: "UploadPage",
} as ComponentMeta<typeof Index>;

const Template: ComponentStory<typeof Index> = () => (
  <Index onSubmit={linkTo("Confirmation Page")} />
);

export const UploadPage = Template.bind({});