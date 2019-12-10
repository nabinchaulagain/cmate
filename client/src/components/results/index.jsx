import React from "react";
import ResultContext from "./ResultContext";
import Results from "./Result";
export default () => {
  return (
    <ResultContext>
      <Results />
    </ResultContext>
  );
};
