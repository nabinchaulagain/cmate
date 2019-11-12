import React, { useEffect, useState, useRef } from "react";
const ProfilePic = props => {
  const [isOpen, setOpen] = useState(false);
  const picRef = useRef(null);
  // handler for whenever clicked on page
  const handlePageClick = event => {
    if (event.target !== picRef.current) {
      if (!isOpen) {
        setOpen(false);
      }
    }
  };
  useEffect(() => {
    //add page click handler on mount
    document.addEventListener("click", handlePageClick);
    return () => {
      //remove page click handler on unmount
      document.removeEventListener("click", handlePageClick);
    };
  }, []);
  return (
    <div>
      <img
        src={props.imgSrc}
        alt="sd"
        width="42"
        height="42"
        ref={picRef}
        onClick={() => {
          setOpen(!isOpen);
        }}
      />
      {isOpen &&
        props.dropDownItems.map(dropdownItem => (
          <li key={Math.random()}>{dropdownItem}</li>
        ))}
    </div>
  );
};

export default ProfilePic;
