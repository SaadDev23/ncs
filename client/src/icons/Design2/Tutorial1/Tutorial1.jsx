/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

export const Tutorial1 = ({ color = "#3ED6A4", className }) => {
  return (
    <svg
      className={`tutorial-1 ${className}`}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M10.6949 20C5.07336 20 0.5 15.5141 0.5 10.0002C0.5 4.48625 5.07336 0 10.6949 0C13.7586 0 16.6319 1.33335 18.5776 3.65811C18.9555 4.10941 19.0376 4.62944 18.5776 5.00007C18.2533 5.26146 17.6816 5.21706 17.5 5.00007C15.965 3.16634 13.5 1.5 10.6946 1.5C6.26173 1.5 2 5.652 2 10.0001C2 14.3481 6.26165 18.5 10.6946 18.5C13.479 18.5 16.5175 16.5024 18 14.1857C18.3165 13.6912 18.7357 13.6927 18.995 13.8524C19.5364 14.1857 19.6514 14.8154 19.3349 15.3098C17.4556 18.2468 14.2253 20 10.6949 20Z"
        fill={color}
      />
      <path className="path" d="M8.5 5L15.5 9.71805L8.5 14V5Z" fill={color} />
    </svg>
  );
};

Tutorial1.propTypes = {
  color: PropTypes.string,
};
