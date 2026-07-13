/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import "./style.css";

export const Group = ({
  ellipseClassName,
  subtract = "/imgHome/subtract-5.svg",
  img = "/imgHome/subtract-4.svg",
  ellipseClassNameOverride,
  subtract1 = "/imgHome/subtract-6.svg",
  divClassName,
  subtract2 = "/imgHome/subtract-7.svg",
}) => {
  return (
    <div className="group">
      <div className="overlap-group">
        <div className={`ellipse ${ellipseClassName}`} />
        <img className="subtract" alt="Subtract" src={subtract} />
        <img className="img" alt="Subtract" src={img} />
      </div>
      <div className="overlap">
        <div className={`div ${ellipseClassNameOverride}`} />
        <img className="subtract-2" alt="Subtract" src={subtract1} />
        <div className={`ellipse-2 ${divClassName}`} />
      </div>
      <img className="subtract-3" alt="Subtract" src={subtract2} />
    </div>
  );
};

Group.propTypes = {
  subtract: PropTypes.string,
  img: PropTypes.string,
  subtract1: PropTypes.string,
  subtract2: PropTypes.string,
};
