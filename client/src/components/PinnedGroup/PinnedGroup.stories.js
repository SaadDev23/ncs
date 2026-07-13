import { PinnedGroup } from ".";

export default {
  title: "Components/PinnedGroup",
  component: PinnedGroup,
  argTypes: {
    dark: {
      options: ["off", "on"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    dark: "off",
    className: {},
    text: "Pinned Group",
    text1: "#javascript",
    text2: "82,645 Posted by this tag",
    text3: "#bitcoin",
    text4: "65,523 Posted • Trending",
    text5: "#design",
    text6: "51,354 • Trending in Bangladesh",
    text7: "#blogging",
    text8: "48,029 Posted by this tag",
    text9: "#tutorial",
  },
};
