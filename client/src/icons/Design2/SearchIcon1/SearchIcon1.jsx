/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

export const SearchIcon1 = ({ color = "#858EAD", className }) => {
  return (
    <svg
      className={`search-icon-1 ${className}`}
      fill="none"
      height="21"
      viewBox="0 0 21 21"
      width="21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle className="circle" cx="10" cy="9" r="8" stroke={color} strokeWidth="2" />
      <path className="path" d="M15.5 15.5L19.5 19.5" stroke={color} strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
};

SearchIcon1.propTypes = {
  color: PropTypes.string,
};
