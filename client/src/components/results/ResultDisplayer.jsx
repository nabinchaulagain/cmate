import React, { useContext, useState, useEffect } from "react";
import { ResultContext } from "./ResultContext";
import {
  FaFastBackward,
  FaFastForward,
  FaStepForward,
  FaBackward
} from "react-icons/fa";
const ResultDisplayer = () => {
  const [pageNum, setPageNum] = useState(1);
  const {
    state: { searchResults }
  } = useContext(ResultContext);
  useEffect(() => {
    setPageNum(1);
  }, [searchResults]);
  if (!searchResults) {
    return <div />;
  }
  if (searchResults.length === 0) {
    return <h1 className="text-center mt-4">Name not found!</h1>;
  }
  return (
    <React.Fragment>
      <table className="table table-lg table-secondary table-striped table-bordered col-10 mx-auto">
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
            <tr key={searchResult.rollNo}>
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
        className={`btn btn-${
          i === pageNum ? "primary" : "secondary"
        } mr-2 mb-2`}
        onClick={() => setPageNum(i)}
        key={i}
      >
        {i}
      </button>
    );
  }
  const moveBtnClasses = "btn btn-secondary mr-2 mb-2";
  const forwardClasses = `${moveBtnClasses} ${
    pageNum === lastPageNum ? "disabled" : ""
  }`;
  const backwardClasses = `${moveBtnClasses} ${
    pageNum === 1 ? "disabled" : ""
  }`;
  return (
    <div className="text-center col-8 mx-auto">
      <BackwardButtons
        backwardClasses={backwardClasses}
        setPageNum={setPageNum}
        pageNum={pageNum}
      />
      {buttons.slice(pageNum - 1, pageNum + 2)}
      <ForwardButtons
        forwardClasses={forwardClasses}
        setPageNum={setPageNum}
        pageNum={pageNum}
        lastPageNum={lastPageNum}
      />
    </div>
  );
};

const BackwardButtons = ({ backwardClasses, setPageNum, pageNum }) => {
  return (
    <React.Fragment>
      <button className={backwardClasses} onClick={() => setPageNum(1)}>
        <FaFastBackward />
      </button>
      <button
        className={backwardClasses}
        onClick={() => {
          if (pageNum !== 1) {
            setPageNum(pageNum - 1);
          }
        }}
      >
        <FaBackward />
      </button>
    </React.Fragment>
  );
};

const ForwardButtons = ({
  forwardClasses,
  setPageNum,
  pageNum,
  lastPageNum
}) => {
  return (
    <React.Fragment>
      <button
        className={forwardClasses}
        onClick={() => {
          if (pageNum !== lastPageNum) {
            setPageNum(pageNum + 1);
          }
        }}
      >
        <FaStepForward />
      </button>
      <button
        className={forwardClasses}
        onClick={() => setPageNum(lastPageNum)}
      >
        <FaFastForward />
      </button>
    </React.Fragment>
  );
};
export default ResultDisplayer;
