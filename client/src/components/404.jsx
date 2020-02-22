import React from "react";
import Background404 from "../assets/404.jpg";
const PageNotFound = () => {
  return (
    <div
      style={{ width: 800, height: 479, background: `url(${Background404})` }}
      className="mx-auto mt-3 "
    >
      <h1
        style={{
          position: "relative",
          top: "35%",
          left: "15%",
          fontSize: "300%",
          color: "white"
        }}
      >
        Page Not found!!!
      </h1>
    </div>
  );
};

export default PageNotFound;
