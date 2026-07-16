import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Avatar.css";

function base64ImageSource(profilepicture) {
  if (!profilepicture) return "";
  if (profilepicture.startsWith("data:image/") || profilepicture.startsWith("http")) {
    return profilepicture;
  }

  const value = profilepicture.trim();
  const mimeType = value.startsWith("iVBOR")
    ? "image/png"
    : value.startsWith("R0lGOD")
      ? "image/gif"
      : value.startsWith("UklGR")
        ? "image/webp"
        : "image/jpeg";
  return `data:${mimeType};base64,${value}`;
}

export const Avatar = ({ username, profilepicture, alt = "User avatar", className = "", style = {}, onClick }) => {
  const [hasError, setHasError] = useState(false);
  const initial = username ? username.charAt(0).toUpperCase() : "U";
  const imageSource = base64ImageSource(profilepicture);
  const shouldShowImage = imageSource && !hasError;

  useEffect(() => {
    setHasError(false);
  }, [profilepicture]);

  return shouldShowImage ? (
    <img
      className={`avatar-image ${className}`}
      alt={alt}
      style={style}
      src={imageSource}
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
