import { Meetups } from ".";

export default {
  title: "Components/Meetups",
  component: Meetups,
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
    text: "Meetups",
    text1: "UIHUT - Crunchbase Company Profile...",
    text2: "UIHUT&nbsp;&nbsp;•&nbsp;&nbsp;Sylhet, Bangladesh",
    text3: "Design Meetups USA | Dribbble",
    text4: "Dribbble&nbsp;&nbsp;•&nbsp;&nbsp;Austin, Texas, USA",
    text5: "Meetup Brand Identity Design - Beha...",
    rectangle: "/imgHome/rectangle-32-3.svg",
    text6: "Behance&nbsp;&nbsp;•&nbsp;&nbsp;Sab jose, Califonia, USA",
  },
};
