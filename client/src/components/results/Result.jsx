import React from "react";
import SearchBar from "./SearchBar";
import "./results.css";
import ResultDisplayer from "./ResultDisplayer";
const Result = () => {
  return (
    <div className="mt-3">
      <h5 className="text-center">CMAT 2076 Results by FOMECD</h5>
      <SearchBar />
      <ResultDisplayer />
    </div>
  );
};

export default Result;
