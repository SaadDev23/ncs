/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Vector173 } from "../../icons/Vector173";
import { Link } from "react-router-dom";
import "./style.css";



export const PinnedGroup = ({
  dark,
  className,
  text = "Pinned Group",
 
}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = "http://localhost:8080/api/codeforces-rankings";
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const filteredData = result.result.filter(
          (user) => user.country === "Pakistan" && user.city === "Karachi"
        );
        setData(filteredData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Codeforces data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className={`pinned-group dark-18-${dark} ${className}`}>
      <div className="main-2">
        <div className="title-2">
          <Link to="/rankings" className="title-2 rankings-link">
            <div className="text-wrapper-2">{text}</div>
            <Vector173 className="vector" color={dark === "on" ? "#F7F7F7" : "#3F4354"} />
          </Link>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="rankings-scroll" role="list" aria-label="Codeforces rankings" tabIndex="0">
            {data.map((user) => (
              <div id="user" className="tag-2" key={user.handle}>
                <img id="userIcon" alt="icon9" src={user.titlePhoto} />
                <div className="name-2">
                <div className="javascript-2">{user.handle}</div>
                <p className="element-posted-by-3">{user.rating}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link to="/rankings" className="rankings-footer">
          View All Rankings <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
    //   </div>
    // </div>
  );
};

PinnedGroup.propTypes = {
  dark: PropTypes.oneOf(["off", "on"]),
  text: PropTypes.string,
  text1: PropTypes.string,
  text2: PropTypes.string,
  text3: PropTypes.string,
  text4: PropTypes.string,
  text5: PropTypes.string,
  text6: PropTypes.string,
  text7: PropTypes.string,
  text8: PropTypes.string,
  text9: PropTypes.string,
};
