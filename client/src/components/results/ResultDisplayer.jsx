import React, { useContext, useState } from "react";
import { ResultContext } from "./ResultContext";
const ResultDisplayer = () => {
  const [pageNum, setPageNum] = useState(1);
  const {
    state: { searchResults }
  } = useContext(ResultContext);
  if (!searchResults) {
    return <div />;
  }
  if (searchResults.length === 0) {
    return <h1 className="text-center mt-4">Name not found!</h1>;
  }
  return (
    <React.Fragment>
      <table className="table table-xl table-secondary table-striped table-bordered col-8 mx-auto">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Marks</th>
            <th>Campus Name</th>
          </tr>
        </thead>
        <tbody>
          {filterResults(searchResults, pageNum).map(searchResult => (
            <tr>
              <td>{searchResult.rank}</td>
              <td>{searchResult.name}</td>
              <td>{searchResult.rollNo}</td>
              <td>{searchResult.marks}</td>
              <td>{searchResult.campus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination(pageNum, searchResults.length, setPageNum)}
    </React.Fragment>
  );
};
const filterResults = (results, pageNum) => {
  return results.filter((result, index) => {
    if (index + 1 <= pageNum * 10 && index + 1 >= pageNum * 10 - 10) {
      return true;
    }
  });
};
const renderPagination = (pageNum, items, setPageNum) => {
  const lastPageNum = Math.ceil(items / 10);
  if (lastPageNum === 1) {
    return <div />;
  }
  const buttons = [];
  for (let i = 1; i <= lastPageNum; i++) {
    buttons.push(
      <button
        className={`btn btn-${i === pageNum ? "success" : "secondary"} mr-2`}
        onClick={() => setPageNum(i)}
      >
        {i}
      </button>
    );
  }
  return <div className="text-center col-8 mx-auto">{buttons}</div>;
};
export default ResultDisplayer;
