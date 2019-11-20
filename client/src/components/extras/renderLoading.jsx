import React from "react";
import { ScaleLoader } from "react-spinners";
const renderLoading = message => {
  return (
    <div className="mx-auto text-center">
      <ScaleLoader height="100"></ScaleLoader>
      {message}
    </div>
  );
};
export default renderLoading;
