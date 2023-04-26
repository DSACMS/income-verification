import { ComponentMeta, ComponentStory } from "@storybook/react";



import Index from "../../src/pages/index";


export default {
  title: "1. Upload",
  // argTypes: {
  //   errors: { control: "checkbox", options: ["Duplicate", "File size"] },
  // },
} as ComponentMeta<typeof Index>;

const Template: ComponentStory<typeof Index> = (args) => <Index {...args} />;

export const Initial = Template.bind({});