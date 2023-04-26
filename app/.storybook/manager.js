import { addons } from "@storybook/addons";

addons.setConfig({
  isFullscreen: false,
  showNav: true,
  showPanel: false,
  enableShortcuts: true,
  showToolbar: true,
  theme: undefined,
  selectedPanel: undefined,
  sidebar: {
    showRoots: false,
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
