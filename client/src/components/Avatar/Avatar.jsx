import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Avatar.css";

export const Avatar = ({ username, profilepicture, alt = "User avatar", className = "", style = {}, onClick }) => {
  const [hasError, setHasError] = useState(false);
  const initial = username ? username.charAt(0).toUpperCase() : "U";
  const shouldShowImage = profilepicture && !hasError;

  return shouldShowImage ? (
    <img
      className={`avatar-image ${className}`}
      alt={alt}
      style={style}
      src={`data:image/${profilepicture};base64, ${profilepicture}`}
      onError={() => setHasError(true)}
      onClick={onClick}
    />
  ) : (
    <div className={`avatar-initials ${className}`} style={style} onClick={onClick}>
      {initial}
    </div>
  );
};

Avatar.propTypes = {
  username: PropTypes.string,
  profilepicture: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};
