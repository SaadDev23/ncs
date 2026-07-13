import { Post } from ".";

export default {
  title: "Components/Post",
  component: Post,
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
    hasRectangle: true,
    text: "Bitcoin has tumbled from its record high of $58,000 after words from three wise men and women...",
    hasTags: true,
    memojiBoys: "/imgHome/memoji-boys-3-15-4.png",
    text1: "Pavel Gvay",
    hasEllipse: true,
    text2: "3 weeks ago",
    hasDiv: true,
    text3: "36,6545 Likes",
    text4: "56 comments",
    iconLikeIconLikeClassName: {},
    iconLikeHeartClassName: {},
    avatarsClassName: {},
  },
};
