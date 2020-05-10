import React from "react";
import { slide as Menu } from "react-burger-menu";

export default props => {
  return (
    <Menu>
      <a className="menu-item" href="/">
        Home
      </a>

      <a className="menu-item" href="/logon">
        Login
      </a>

      <a className="menu-item" href="registration">
        Register
      </a>

      <a className="menu-item" href="/upload">
        Upload
      </a>
    </Menu>
  );
};