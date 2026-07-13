import { Check } from ".";

export default {
  title: "Components/Check",
  component: Check,
  argTypes: {
    type: {
      options: ["exclude", "selected", "selection-box", "exclusion-box", "intermediate"],
      control: { type: "select" },
    },
    size: {
      options: ["twelve"],
      control: { type: "select" },
    },
    state: {
      options: ["disabled", "pressed", "enabled", "hover"],
      control: { type: "select" },
    },
  },
};

export const Default = {
  args: {
    checked: true,
    type: "exclude",
    size: "twelve",
    state: "disabled",
    className: {},
    iconCheckboxClassName: {},
  },
};
