import React from "react";
import { slide as Menu } from "react-burger-menu";

export default props => {
  return (
<Menu {...props}>
    <a className="menu-item" href="/">
        Home
      </a>

      <a className="menu-item" href="/userprofile">
        Profile
      </a>

      <a className="menu-item" href="/Upload">
        Upload File
      </a>

      <a className="menu-item" href="/help">
        Help
      </a>
      <a className="menu-item" href="/logout">
        Logout
      </a>
    </Menu>
  );
};