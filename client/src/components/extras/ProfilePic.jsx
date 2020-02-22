import React, { useEffect, useState, useRef } from "react";
import { GoVerified } from "react-icons/go";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const ProfilePic = props => {
  const [isOpen, setOpen] = useState(false);
  const picRef = useRef(null);
  // handler for whenever clicked on page
  useEffect(() => {
    //add page click handler on mount
    document.addEventListener("click", event => {
      if (event.target !== picRef.current) {
        if (!isOpen) {
          setOpen(false);
        }
      }
    });
  }, [isOpen]);
  return (
    <div>
      <img
        id="profile-img"
        src={props.imgSrc}
        alt="sd"
        width="42"
        height="42"
        ref={picRef}
        onClick={() => {
          setOpen(!isOpen);
        }}
      />
      {isOpen && picRef && (
        <ul
          style={{
            position: "fixed",
            right: picRef.current.getBoundingClientRect().width + 15,
            top: 10,
            listStyle: "none"
          }}
          id="profile-dropdown"
        >
          <li>
            <h5 style={{ marginBottom: -9 }}>
              {props.username} {props.isAdmin && <GoVerified />}
            </h5>
            <small style={{ fontSize: "70%" }}>{props.email}</small>
          </li>
          {props.isAdmin && (
            <li>
              <Link to="/admin">Admin Panel</Link>
            </li>
          )}
          <li>
            <Link to={`/profile/${props.id}`}>My Profile</Link>
          </li>
          <li>
            <a href="/api/auth/logout">Logout</a>
          </li>
        </ul>
      )}
    </div>
  );
};
export const ProfilePicReusable = ({ user, size }) => {
  const currentUser = useSelector(state => state.auth.user);
  return (
    <ProfilePicReusableWrapper user={user}>
      <img
        src={user.profilePic}
        style={{ width: size, height: size, borderRadius: "100%" }}
        alt={user.name}
        title={user.email ? `${user.name}(${user.email})` : user.name}
      ></img>
      <span
        className={
          user._id === (currentUser && currentUser._id) ? "font-italic" : ""
        }
      >
        {user.name}{" "}
      </span>
    </ProfilePicReusableWrapper>
  );
};

const ProfilePicReusableWrapper = ({ user, children }) => {
  if (user._id) {
    return (
      <Link
        to={`/profile/${user._id}`}
        className="text-dark"
        style={{ textDecoration: "none" }}
      >
        {children}
      </Link>
    );
  } else {
    return <React.Fragment>{children}</React.Fragment>;
  }
};
export default ProfilePic;
