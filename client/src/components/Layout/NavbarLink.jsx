import React from "react";

const NavbarLink = (props) => {
  const { linkPath, currPath, text } = props;
  return (
    <li>
      <a
        href={linkPath}
        className={
          "nav-link px-2" + (currPath === linkPath ? " link-secondary" : "")
        }
      >
        {text}
      </a>
    </li>
  );
};

export default NavbarLink;
