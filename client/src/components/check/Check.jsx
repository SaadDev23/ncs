/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { IconsNavigationOthers10Check2 } from "../../assets/icons/IconsNavigationOthers10Check2";
import "./style.css";

export const Check = ({
  checked,
  type,
  size,
  state,
  className,
  iconCheckboxClassName,
  icon = <IconsNavigationOthers10Check2 className="icons-navigation" color="white" />,
}) => (
  <div className={`check ${type} ${state} checked-${checked} ${className}`}>
    {(checked ||
      (state === "disabled" && type === "selection-box") ||
      (state === "pressed" && type === "exclusion-box")) && (
        <div className={`icon-checkbox ${iconCheckboxClassName}`}>{checked && <>{icon}</>}</div>
      )}
  </div>
);

Check.propTypes = {
  checked: PropTypes.bool,
  type: PropTypes.oneOf(["exclude", "selected", "selection-box", "exclusion-box", "intermediate"]),
  size: PropTypes.oneOf(["twelve"]),
  state: PropTypes.oneOf(["disabled", "pressed", "enabled", "hover"]),
};
