import React, { useContext } from "react";
import { ResultContext } from "./ResultContext";
import axios from "axios";
const AutoComplete = props => {
  const context = useContext(ResultContext);
  return (
    <ul className="col-md-4 col-6 mx-auto menu">
      {renderRecommendations(
        context.state.searchReco,
        context.setQuery,
        context.state.query,
        context.setSearchResults
      )}
    </ul>
  );
};
const renderRecommendations = (students, setQuery, query, setSearchResults) => {
  if (students && students.length !== 0) {
    return students.map(student => {
      if (!student.name || !student.rollNo) {
        return null;
      }
      const highlightedIndex = student.name.search(new RegExp(query, "i"));
      return (
        <StudentListElem
          key={student.rollNo}
          highlightedIndex={highlightedIndex}
          query={query}
          student={student}
          setQuery={setQuery}
          setSearchResults={setSearchResults}
        />
      );
    });
  }
};
const StudentListElem = ({
  highlightedIndex,
  student,
  query,
  setQuery,
  setSearchResults
}) => {
  return (
    <li
      onClick={async () => {
        setQuery(student.name);
        const response = await axios.get(
          `/api/results/getResults?keyword=${student.name}`
        );
        setSearchResults(response.data);
      }}
    >
      {student.name.substring(0, highlightedIndex)}
      <b>
        {student.name.substring(
          highlightedIndex,
          highlightedIndex + query.length
        )}
      </b>
      {student.name.substring(highlightedIndex + query.length)}
    </li>
  );
};
export default AutoComplete;
