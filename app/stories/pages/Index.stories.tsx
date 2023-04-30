import { ComponentMeta, ComponentStory } from "@storybook/react";

import Index from "../../src/pages/index";

export default {
  title: "UploadPage",
} as ComponentMeta<typeof Index>;

const test = () => {
  window.location.href =
    "/iframe.html?args=&id=confirmation-page--confirmation-page&viewMode=story";
};

const Template: ComponentStory<typeof Index> = () => <Index onSubmit={test} />;

export const UploadPage = Template.bind({});
