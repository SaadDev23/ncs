import React from "react";
import { User } from "../../../icons/User";
import { UserChecked } from "../../../icons/UserChecked";
import { Users02 } from "../../../icons/Users02";
import "./style.css";
import { useNavigate } from 'react-router-dom';

export default function FspcStart() {
  const navigate = useNavigate();

  const redirectToRegister = () => {
    navigate('/register');
  };
  const redirectToLogin = () => {
    navigate('/login');
  };
  const redirectToAdmin = () => {
    navigate('/admin/login');
  };

  return (
    <div className="users-container">
      <div className="users">
      <button className="user-button" onClick={redirectToLogin}>
          <User className="user-instance" />
          <div className="text-wrapper">User Login</div>
        </button>

        <button className="user-button" onClick={redirectToRegister}>
          <Users02 className="users-02" />
          <div className="text-wrapper-2">User Register</div>
        </button>

        <button className="user-button" onClick={redirectToAdmin}>
          <UserChecked className="user-checked" />
          <div className="text-wrapper-3">Admin</div>
        </button>
      </div>
    </div>
  );
}
