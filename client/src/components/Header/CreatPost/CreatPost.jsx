/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Button } from "../Button";
import { Avatar } from "../../Avatar/Avatar";
import "./style.css";

export const CreatPost = ({ dark, className, hasInputData = true, buttonText = "Create Post" , profilepicture}) => {
  return (
    <div className={`creat-post dark-18-${dark} ${className}`}>
      <div className="main-2">
        <div className="abatars">
          <Avatar
            profilepicture={profilepicture}
            alt="Profile"
            className="mask-group"
          />
        </div>
        {hasInputData && (
          <div className="input-data">
            <p className="text-wrapper-2">Let’s share what going on your mind...</p>
          </div>
        )}

        <Button className="button-instance" text={buttonText} />
      </div>
    </div>
  );
};

CreatPost.propTypes = {
  dark: PropTypes.oneOf(["off", "on"]),
  hasInputData: PropTypes.bool,
  buttonText: PropTypes.string,
};
