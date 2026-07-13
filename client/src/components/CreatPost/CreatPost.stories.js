import { CreatPost } from ".";

export default {
  title: "Components/CreatPost",
  component: CreatPost,
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
  },
};
