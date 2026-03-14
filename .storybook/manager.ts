import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

const charlieTheme = create({
  base: "dark",
  brandTitle: "Charlie UI",
  brandUrl: "/",
  colorPrimary: "#ff6363",
  colorSecondary: "#ff6363",
  appBg: "#07080a",
  appContentBg: "#0c0d0f",
  appBorderColor: "rgba(255,255,255,0.06)",
  textColor: "#f4f4f5",
  textMutedColor: "#6a6b6c",
  barBg: "#111214",
  barTextColor: "#9c9c9d",
  barSelectedColor: "#ff6363",
});

addons.setConfig({
  theme: charlieTheme,
});
