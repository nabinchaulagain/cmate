import React, { useContext, useEffect, useCallback } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { ResultContext } from "./ResultContext";
import AutoComplete from "./AutoComplete";
import axios from "axios";
const SearchBar = () => {
  const ctx = useContext(ResultContext);
  const hideAutoComplete = useCallback(
    event => {
      if (
        !document.querySelector('input[type="search"]').contains(event.target)
      ) {
        ctx.setShowAutoComplete(false);
      }
    },
    [ctx]
  );
  useEffect(() => {
    document.addEventListener("click", hideAutoComplete);
    return () => {
      document.removeEventListener("click", hideAutoComplete);
    };
  }, [hideAutoComplete]);
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        handleSubmit(ctx.state.query, ctx.setSearchResults);
      }}
    >
      <div className="text-center">
        <input
          type="search"
          className="form-control col-md-4 col-6"
          value={ctx.state.query}
          onChange={async e => {
            ctx.setQuery(e.target.value);
            if (e.target.value === "") {
              return ctx.setShowAutoComplete(false);
            }
            ctx.setShowAutoComplete(true);
            const response = await axios.get(
              `/api/results/getSearchResult?keyword=${e.target.value}`
            );
            ctx.setSearchReco(response.data);
          }}
          style={{ display: "inline-block" }}
          placeholder="Enter your name"
        />
        <label htmlFor="submit">
          <AiOutlineSearch size="32" style={{ cursor: "pointer" }} />
        </label>
      </div>
      <input type="submit" style={{ display: "none" }} id="submit" />
      {ctx.state.showAutoComplete && <AutoComplete />}
    </form>
  );
};

const handleSubmit = async (query, setSearchResults) => {
  const response = await axios.get(`/api/results/getResults?keyword=${query}`);
  setSearchResults(response.data);
};
export default SearchBar;
