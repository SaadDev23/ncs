/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

export const Notification1 = ({ color = "#858EAD", stroke = "#F4F6F8", className }) => {
  return (
    <svg
      className={`notification-1 ${className}`}
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="g" clipPath="url(#clip0_5_1080)">
        <path
          className="path"
          clipRule="evenodd"
          d="M18.3325 13.0613H17.9128C19.069 13.0613 20 13.9747 20 15.1015V15.511C20 15.9648 19.6268 16.3266 19.1661 16.3266H0.833873C0.372903 16.3266 0 15.9613 0 15.511V15.1015C0 13.9752 0.93447 13.0613 2.08717 13.0613H1.66748C2.12554 13.0613 2.49994 12.6955 2.49994 12.2442V7.34691C2.49994 3.28752 5.85782 0 10.0001 0C14.1434 0 17.5003 3.28927 17.5003 7.34691V12.2442C17.5003 12.6983 17.8729 13.0613 18.3327 13.0613H18.3325ZM7.08301 17.1429H12.9163C12.9163 18.7208 11.6104 20 9.99967 20C8.38892 20 7.08301 18.7208 7.08301 17.1429Z"
          fill={color}
          fillRule="evenodd"
        />
        <circle className="circle" cx="16.5" cy="3.5" fill="#FF6934" r="3" stroke={stroke} />
      </g>
      <defs className="defs">
        <clipPath className="clip-path" id="clip0_5_1080">
          <rect className="rect" fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </svg>
  );
};

Notification1.propTypes = {
  color: PropTypes.string,
  stroke: PropTypes.string,
};
