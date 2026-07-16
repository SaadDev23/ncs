import { React, useState, useEffect } from "react";
import { Group } from "../../components/Group";
import { Calendar } from "../../icons/Calendar";
import { Home } from "../../icons/Home";
import { Vector82 } from "../../icons/Vector82";
import { Avatar } from "../../components/Avatar/Avatar";
import "./header.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const response = await fetch('http://localhost:8080/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      console.log('could not end the user session');
    }
    localStorage.removeItem('access');
    navigate('/');
    navigate(0);
    if (onClose) onClose();
  };

  return (
    <div className="logout-button" onClick={handleLogOut}>
      Log Out
    </div>
  );
};


export const Header = ({ page }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [showDashboardOption, setShowDashboardOption] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const handlePastPaperLink = () => {
    console.log("Han bhai dab raha");
    if (userInfo && userInfo.role === 'admin') {
      navigate('/admin/pastpaper');
    } else {
      navigate('/pastpaper');
    }
    console.log("Han Bhai navigate bhi ho raha");
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/me", {
          method: 'GET',
          credentials: 'include'
        });
        const result = await response.json();
        const { sessionUser } = result
        setUserInfo(sessionUser);
        console.log('User Info:', sessionUser);
        if (sessionUser && sessionUser.role === 'admin') {
          setShowDashboardOption(true);
        }
        
      } catch (error) {
        console.error('Error Fetching User data', error);
      }
    };


    fetchUserInfo();
  }, []);

  const handleDashboardClick = () => {
    navigate('/admin/home');
  };
  return (
    <div id="navbar" className="header">
      <div className="main">
        <div className="div-2">
          <Link to="/home" className="brand-link" aria-label="Go to homepage">
            <img className="logo" alt="Neo Code Syndicate logo" src="/imgHome/logo-1.png" />
            <div className="hipnode">Neo Code Syndicate</div>
          </Link>
        </div>
        <div className="main-2">
          <div className="icons">
            <div className={page === "home" ? "home-wrapper" : "home-wrapper-2"}>
              <Link to="/home">
                <Home className="icon-instance-node" color="white" />
              </Link>
            </div>
            <div className={page === "pp" ? "home-wrapper" : "home-wrapper-2"}>
            <Link to="#" onClick={(e) => { e.preventDefault(); handlePastPaperLink(); }}>
              <Calendar className="icon-instance-node" color="#F4F6F8" />
            </Link>
            </div>
            <div className={page === "rh" ? "home-wrapper" : "home-wrapper-2"}>

              <Link to="/register-competition">
                <Group
                  divClassName="design-component-instance-node"
                  ellipseClassName="group-instance"
                  ellipseClassNameOverride="group-instance"
                  img="/imgHome/subtract-8.svg"
                  subtract="/imgHome/subtract-9.svg"
                  subtract1="/imgHome/subtract-10.svg"
                  subtract2="/imgHome/subtract-11.svg"
                  color="#F4F6F8" 
                />
              </Link>
            </div>
            </div>
            <div className="right-info">
              <div className="div-2">
                <div className="name">
                  <div className="profile-image" onClick={() => setShowDropdown(!showDropdown)}>
                  <Avatar
                    username={userInfo?.username}
                    profilepicture={userInfo?.profilepicture}
                    alt="Profile"
                  />
                </div>
                  <div className="AR-jakir">{userInfo && userInfo.username}</div>
                </div>
                <div className={`dropdown ${showDropdown ? 'open' : ''}`}>
                  <button className="dropbtn" onClick={() => setShowDropdown(!showDropdown)}>
                    <Vector82 className="icon-instance-node" color="#F4F6F8" />
                  </button>
                  {showDropdown && (
                    <div className="dropdown-content">
                      <Link to="/profile" onClick={() => setShowDropdown(false)}>Profile</Link>
                      {/* <Link to="/settings">Settings</Link> */}
                      {showDashboardOption && (
                        <div className="dashboard-option" onClick={() => { handleDashboardClick(); setShowDropdown(false); }}>
                          Dashboard
                        </div>
                      )}
                      <LogoutButton onClose={() => setShowDropdown(false)} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

Header.propTypes = {
  page: PropTypes.string,
};
