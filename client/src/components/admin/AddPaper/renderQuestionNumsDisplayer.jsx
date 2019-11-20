import React from "react";
import { validate } from "./QuestionForm";
const renderQuestionNumsDisplayer = (setQuestionNum, questions) => {
  const elems = [];
  for (let i = 1; i <= 100; i++) {
    let classes = "questionNumButton";

    //check if the question number is already added
    if (questions[i] === "missing") {
      classes += " questionNumButtonIncomplete";
    } else {
      const errors = validate(questions[i]);

      if (Object.keys(errors).length === 0) {
        classes += " questionNumButtonCompleted";
      }
      if (Object.keys(errors).length === 5) {
        classes += " questionNumButtonIncomplete";
      }
    }
    elems.push(
      <button className={classes} onClick={() => setQuestionNum(i)} key={i}>
        {i}
      </button>
    );
  }
  return elems;
};
export default renderQuestionNumsDisplayer;
