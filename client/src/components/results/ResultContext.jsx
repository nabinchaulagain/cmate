import React, { createContext, useState } from "react";

export const ResultContext = createContext();

const ResultProvider = props => {
  const [query, setQuery] = useState("");
  const [searchReco, setSearchReco] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  return (
    <ResultContext.Provider
      value={{
        state: {
          query,
          searchReco,
          searchResults,
          showAutoComplete
        },
        setQuery,
        setSearchResults,
        setSearchReco,
        setShowAutoComplete
      }}
    >
      {props.children}
    </ResultContext.Provider>
  );
};
export default ResultProvider;
