import React from "react";
import SearchBar from "./SearchBar";
import "./results.css";
import ResultDisplayer from "./ResultDisplayer";
const Result = () => {
  return (
    <div className="mt-3">
      <SearchBar />
      <ResultDisplayer />
    </div>
  );
};

export default Result;
