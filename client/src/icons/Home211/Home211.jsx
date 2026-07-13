/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

export const Home211 = ({ color = "white", className }) => {
  return (
    <svg
      className={`home-2-11 ${className}`}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="g" clipPath="url(#clip0_5_978)">
        <path
          className="path"
          d="M19.3441 7.51979L10.8801 0.339502C10.639 0.121006 10.3253 -1.19835e-05 9.99995 -1.19835e-05C9.6746 -1.19835e-05 9.36087 0.121006 9.1198 0.339502L0.656708 7.51989C0.450052 7.70712 0.284891 7.93554 0.171857 8.19045C0.0588223 8.44537 0.000419987 8.72113 0.000409126 8.99999L0.000409126 19.3357C0.000409124 19.5119 0.0703816 19.6808 0.19494 19.8054C0.319499 19.93 0.488446 20 0.664612 20L6.00041 20C6.5527 20 7.00041 19.5523 7.00041 19V15C7.00041 14.436 7.5525 13.9788 8.1167 13.9788H11.8832C12.4475 13.9788 13.0004 14.436 13.0004 15V19C13.0004 19.5523 13.4481 20 14.0004 20H19.3362C19.5124 20 19.6813 19.93 19.8059 19.8054C19.9304 19.6808 20.0004 19.5119 20.0004 19.3357V8.99999C20.0004 8.72113 19.9419 8.44536 19.8289 8.19043C19.7159 7.9355 19.5507 7.70706 19.3441 7.51979Z"
          fill={color}
        />
      </g>
      <defs className="defs">
        <clipPath className="clip-path" id="clip0_5_978">
          <rect className="rect" fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </svg>
  );
};

Home211.propTypes = {
  color: PropTypes.string,
};
