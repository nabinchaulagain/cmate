import React, { useState } from "react";
import Modal from "../extras/Modal";
import allQuestionForms from "./AddPaper/allQuestionForms";
import ModalBody from "./AddPaper/ModalBody";
import PDFUpload from "./AddPaper/PDFUpload";
import renderQuestionNumsDisplayer from "./AddPaper/renderQuestionNumsDisplayer";
import renderLoading from "../extras/renderLoading";
import axios from "axios";
import history from "../../history";
import flashMessage from "../../utils/flashMessage";
const PaperForm = ({ initialQuestions, type, id, dispatch }) => {
  const [questionNum, setQuestionNum] = useState(1);
  const [questions, setQuestions] = useState(initialQuestions);
  const [isLoading, setIsLoading] = useState(false);
  //render submit component based on whether it is the add or edit form
  const addQuestion = question => {
    setQuestions({
      ...questions,
      [questionNum]: { ...questions[questionNum], ...question }
    });
  };
  return (
    <React.Fragment>
      <div className="col-md-9 col-lg-7 mx-auto mt-2">
        <PDFUpload
          setQuestions={setQuestions}
          questions={questions}
          setIsLoading={setIsLoading}
        />
        <h4>Questions</h4>
        {renderQuestionNumsDisplayer(setQuestionNum, questions)}
      </div>
      {isLoading && renderLoading(isLoading)}
      {//find appropriate question form component based on what is being selected out of the 100 forms
      !isLoading &&
        allQuestionForms(
          questions,
          addQuestion,
          setQuestionNum,
          setQuestions
        ).find(questionForm => {
          return parseInt(questionForm.key) === questionNum;
        })}
      <div className="text-center m-2">
        {renderSubmitComponent(questions, type, id, dispatch)}
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
const saveEditPaper = async (questions, id, dispatch) => {
  const questionsToSend = {};
  const formData = new FormData();
  for (let i = 1; i <= 100; i++) {
    questionsToSend[i] = { ...questions[i] };
    if (questions[i].image instanceof Blob) {
      formData.append("question." + i, questions[i].image);
      delete questionsToSend[i].image;
    }
  }
  formData.append("questions", JSON.stringify(questionsToSend));
  formData.append("id", id);
  await axios.patch("/api/admin/editPaper", formData);
  history.push("/admin");
  flashMessage(dispatch, "Question Paper was Edited");
};
const renderSubmitComponent = (questions, type, id, dispatch) => {
  if (type === "add") {
    return (
      <Modal
        openButton={{
          className: "btn btn-primary px-4 save-qp-button",
          text: "Save Question Paper"
        }}
        modalHeading="Are you sure you want to save the paper?"
        modalBody={<ModalBody questions={questions} />}
      />
    );
  }
  return (
    <div>
      <button
        className="btn btn-success"
        onClick={() => saveEditPaper(questions, id, dispatch)}
      >
        Save Paper
      </button>
    </div>
  );
};

export default PaperForm;
