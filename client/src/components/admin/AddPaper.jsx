import React, { useState } from "react";
import QuestionForm, { validate } from "./QuestionForm";
import Modal from "../extras/Modal";
import axios from "axios";
import allQuestionForms from "./AddPaper/allQuestionForms";
import renderModalBody from "./AddPaper/renderModalBody";
import renderPDFUpload from "./AddPaper/renderPDFUpload";
import renderQuestionNumsDisplayer from "./AddPaper/renderQuestionNumsDisplayer";
const AddPaper = () => {
  const [questionNum, setQuestionNum] = useState(1);
  const [questions, setQuestions] = useState(getquestionsObj({}));
  const addQuestion = question => {
    setQuestions({
      ...questions,
      [questionNum]: { ...questions[questionNum], ...question }
    });
  };
  return (
    <React.Fragment>
      <div className="col-md-9 col-lg-7 mx-auto mt-2">
        {renderPDFUpload(setQuestions, questions)}
        <h4>Questions</h4>
        {renderQuestionNumsDisplayer(setQuestionNum, questions)}
      </div>
      {//find appropriate question form
      allQuestionForms(
        questions,
        addQuestion,
        setQuestionNum,
        setQuestions
      ).find(questionForm => {
        return parseInt(questionForm.key) === questionNum;
      })}
      <div className="text-center m-2">
        <Modal
          openButton={{
            className: "btn btn-primary px-4 save-qp-button",
            text: "Save Question Paper"
          }}
          modalHeading="Are you sure you want to save the paper?"
          modalBody={renderModalBody(questions)}
        />
      </div>
      <div className="alert alert-info col-7 mx-auto mt-4 text-center ">
        <small>
          Warning: Don't change question numbers unless you're finished with
          one. Progress is not saved for a single question
        </small>
      </div>
    </React.Fragment>
  );
};

const getquestionsObj = () => {
  const questions = {};
  for (let i = 1; i <= 100; i++) {
    questions[i] = { options: {} };
  }
  return questions;
};
export default AddPaper;
