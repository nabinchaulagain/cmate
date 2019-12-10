import React, { useEffect } from "react";
import { Navbar as BSNavbar, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ProfilePic from "./extras/ProfilePic";
import { updateAuthStatus } from "../actions/auth";
import { TiSocialGooglePlus } from "react-icons/ti";
import { Link } from "react-router-dom";
const Navbar = props => {
  const dispatch = useDispatch();
  const authState = useSelector(state => {
    return state.auth;
  });
  useEffect(() => {
    dispatch(updateAuthStatus());
  }, [dispatch]);
  return (
    <BSNavbar
      collapseOnSelect
      expand="md"
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
          <Link className="nav-link" to="/quizzes">
            Quizzes
          </Link>
          <Link className="nav-link" to="/results">
            Result
          </Link>
        </Nav>
        <Nav className="navbar-right">{renderAuth(authState)}</Nav>
      </BSNavbar.Collapse>
    </BSNavbar>
  );
};
const renderAuth = authState => {
  if (authState.isLoggedIn === "TBD") {
    return "Loading  .....";
  }
  if (authState.isLoggedIn === true) {
    return (
      <ProfilePic
        imgSrc={authState.user.profilePic}
        email={authState.user.email}
        username={authState.user.name}
        isAdmin={authState.user.isAdmin}
      />
    );
  } else {
    return (
      <a href="/api/auth/login" className="btn btn-danger text-light">
        <TiSocialGooglePlus size="28" /> Login with Google
      </a>
    );
  }
};

export default Navbar;
