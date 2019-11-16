import React, { useEffect, useState, useRef } from "react";
import { GoVerified } from "react-icons/go";
const ProfilePic = props => {
  const [isOpen, setOpen] = useState(false);
  const picRef = useRef(null);
  // handler for whenever clicked on page
  useEffect(() => {
    //add page click handler on mount
    document.addEventListener("click", event => {
      if (event.target !== picRef.current) {
        console.log("outside click");
        if (!isOpen) {
          setOpen(false);
        }
      }
    });
  }, []);
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
          <li>
            <a href="">Profile</a>
          </li>
          {props.isAdmin && (
            <li>
              <a href="">Admin Panel</a>
            </li>
          )}
          <li>
            <a href="/api/auth/logout">Logout</a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfilePic;
