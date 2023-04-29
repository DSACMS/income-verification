import { addons } from "@storybook/addons";


/**
 * @type {import("@storybook/addons").Config}
 */
addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: false,
  enableShortcuts: false,
  showToolbar: true,
  theme: undefined,
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