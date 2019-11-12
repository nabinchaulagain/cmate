import React, { useState } from "react";
import { Navbar as BSNavbar, Nav, NavDropdown } from "react-bootstrap";
import ProfilePic from "./extras/ProfilePic";
const Navbar = props => {
  const [showProfile, setShowProfile] = useState(false);
  return (
    <BSNavbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      className="navbar"
    >
      <BSNavbar.Brand href="/" style={{ fontSize: "160%" }}>
        C-Mate
      </BSNavbar.Brand>
      <BSNavbar.Toggle aria-controls="responsive-navbar-nav" />
      <BSNavbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="">Quizzes</Nav.Link>
          <Nav.Link href="">Result</Nav.Link>
        </Nav>
        <Nav className="navbar-right">
          {props.authData && (
            <ProfilePic
              imgSrc={props.authData.profilePic}
              dropDownItems={["hello", "sorajk"]}
            />
          )}
        </Nav>
      </BSNavbar.Collapse>
    </BSNavbar>
  );
};

export default Navbar;
