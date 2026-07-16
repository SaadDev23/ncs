import PropTypes from "prop-types";
import React from "react";
import { Bitcoin2 } from "../../icons/Bitcoin2";
import { Blogging1 } from "../../icons/Blogging1";
import { Design2 } from "../../icons/Design2";
import { Dev2 } from "../../icons/Dev2";
import { Seo1 } from "../../icons/Seo1";
import { Tutorial2 } from "../../icons/Tutorial2";
import "./style.css";
import { Link } from "react-router-dom";

export const PopularTags = ({
  dark,
  className,
  mainClassName,
  text1 ,
  text2 ,
  text3 ,
  text4 ,
  to = "/register-competition",
}) => {
  const registrationsLeft = Math.max(0, Number(text2 || 0) - Number(text3 || 0));

  return (
    <Link
      to={to}
      className={`popular-tags popular-tags-link ${dark} ${className}`}
      aria-label={`Register for ${text1}`}
    >
      <div className={`div ${mainClassName}`}>
        <div className="tags">
          <div className="tag">
            <div className="icon">
              <Dev2 className="instance-node" color="#EEA956" />
            </div>
            <div className="name">
              <div className="javascript">{text1}</div>
              <p className="element-posted-by">{registrationsLeft} registrations left</p>
              <p className="tag-location">{text4}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

PopularTags.propTypes = {
  dark: PropTypes.oneOf(["off", "on"]),
  text1: PropTypes.string,
  text2: PropTypes.string,
  text3: PropTypes.string,
  text4: PropTypes.string,
};
