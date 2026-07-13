/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

export const Design2 = ({ color = "#5D95E8", className }) => {
  return (
    <svg
      className={`design-2 ${className}`}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M17.7229 5.00023C16.5947 5.00023 15.6717 5.86222 15.5076 6.98297H12.1229V5.00023H7.61019V6.98297H4.47179C4.28721 5.86225 3.36419 5.00023 2.25644 5.00023C1.00518 5.00023 0 6.0563 0 7.37098C0 8.68562 1.00515 9.74173 2.25644 9.74173C3.20009 9.74173 4.00007 9.13828 4.34875 8.2763H5.64107C3.44616 9.65544 2 12.5 2.76918 16H4C3.5 12.5 5.04628 9.59056 7.61034 8.75005V9.7415H12.1231V8.75005C14.6871 9.59056 17 12.5 16 16H17.2308C18 12 16.2871 9.65521 14.1128 8.27591H15.6513C15.9999 9.1379 16.7999 9.74134 17.7436 9.74134C18.9948 9.74134 20 8.68528 20 7.37059C19.9999 6.0561 18.9742 5.00023 17.7229 5.00023Z"
        fill={color}
      />
    </svg>
  );
};

Design2.propTypes = {
  color: PropTypes.string,
};
