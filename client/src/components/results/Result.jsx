import React from "react";
import SearchBar from "./SearchBar";
import "./results.css";
import ResultDisplayer from "./ResultDisplayer";
import { Helmet } from "react-helmet";
const Result = () => {
  return (
    <div className="mt-3">
      <Helmet>
        <title>CMAT Result - Cmate</title>
        <meta name="description" content="CMAT result" />
      </Helmet>
      <h5 className="text-center">CMAT 2076 Results by FOMECD</h5>
      <SearchBar />
      <ResultDisplayer />
    </div>
  );
};

export default Result;
