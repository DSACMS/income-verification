import { addons } from "@storybook/addons";
import { create } from "@storybook/theming";

/**
 * @type {import("@storybook/addons").Config}
 */
addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: false,
  enableShortcuts: false,
  showToolbar: true,
  theme: create({
    base: "light",
    brandTitle: "Preview",
  }),
  selectedPanel: undefined,
  sidebar: {
    showRoots: false,
  },
  toolbar: {
    title: { hidden: true },
    zoom: { hidden: true },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: true },
    theme: { hidden: true },
  },
});
