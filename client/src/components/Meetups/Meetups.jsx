import PropTypes from "prop-types";
import React from "react";
import "./meetups.css";

export const Meetups = ({ text1, text2, date, kind, link }) => {
  const dateObject = new Date(date);
  const month = dateObject.toLocaleString('default', { month: 'short' });
  const day = dateObject.getDate();

  return (
    <div className={`meetups dark-46-on design-component-instance-node`}>
      <div className="main-5">
        <div className="div-2">
          <div className="date">
            <div className="text-wrapper-10">{month.toUpperCase()}</div>
            <div className="text-wrapper-11">{day}</div>
          </div>
          <div className="data-3">
            <div className="title-5">
              <p className="UIHUT-crunchbase">{text1}</p>
              <p className="UIHUT-crunchbase" style={{color: "#FF4401"}}><a href={link}>Go Now!</a> </p>
              <div className="profile">
                <img className="img" alt="Rectangle" src="/imgHome/rectangle-32-5.png" />
                <div className="text-wrapper-12">{text2}</div>
              </div>
            </div>
            <div className="tags-4">
            <div className="tag-5" style={{ backgroundColor: kind === "Local" ? '#FF4401' : '' }}>
                <div className="text-wrapper-13">Local</div>
              </div>
              <div className="tag-6" style={{ backgroundColor: kind === "Regional" ? '#FF4401' : '' }}>
                <div className="text-wrapper-13">Regional</div>
              </div>
              <div className="tag-7" style={{ backgroundColor: kind === "Worldwide" ? '#FF4401' : '' }}>
                <div className="text-wrapper-13">Worldwide</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Meetups.propTypes = {
  dark: PropTypes.oneOf(["off", "on"]),
  text1: PropTypes.string,
  text2: PropTypes.string,
};


