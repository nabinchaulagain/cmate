import React, { useState, useEffect } from "react";
import Modal from "../extras/Modal";
import allQuestionForms from "./AddPaper/allQuestionForms";
import ModalBody from "./AddPaper/ModalBody";
import PDFUpload from "./AddPaper/PDFUpload";
import renderQuestionNumsDisplayer from "./AddPaper/renderQuestionNumsDisplayer";
import renderLoading from "../extras/renderLoading";
import axios from "axios";
import history from "../../history";
import flashMessage from "../../utils/flashMessage";
import { IoIosPlay, IoIosPause } from "react-icons/io";
const PaperForm = ({ initialQuestions, type, id, dispatch }) => {
  const [questionNum, setQuestionNum] = useState(1);
  const [questions, setQuestions] = useState(initialQuestions);
  const [isLoading, setIsLoading] = useState(false);
  const addQuestion = question => {
    setQuestions({
      ...questions,
      [questionNum]: { ...questions[questionNum], ...question }
    });
  };
  return (
    <React.Fragment>
      <div className="col-md-9 col-lg-7 col-12 mx-auto mt-2">
        <PDFUpload
          setQuestions={setQuestions}
          questions={questions}
          setIsLoading={setIsLoading}
        />
        <div className=" text-right mr-4 mb-2">
          <Player
            setQuestionNum={setQuestionNum}
            questionNum={questionNum}
          ></Player>
        </div>
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
      <ul className="alert alert-info col-7 mx-auto mt-4 text-left ">
        <h5 className="text-center">Please read</h5>
        <li>
          Don't change question numbers unless you're finished with one.
          Progress is not saved for a single question
        </li>
        <li>Images and direction images have to be manually added.</li>
        <li>
          Please check all questions after you are done.{" "}
          <span
            onClick={() => document.querySelector("#player").click()}
            id="review-preview"
          >
            Click on review question button
          </span>{" "}
          to do so.
        </li>
        <li>Don't forget to review all directions</li>
      </ul>
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
    if (
      questions[i].directionImage &&
      questions[i].directionImage.url instanceof Blob
    ) {
      formData.append(
        "directionImage." + i + "." + questions[i].directionImage.ending,
        questions[i].directionImage.url
      );
      delete questionsToSend[i].directionImage;
    }
  }
  formData.append("questions", JSON.stringify(questionsToSend));
  formData.append("id", id);
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
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

const Player = props => {
  const [activeNumber, setActiveNum] = useState(props.questionNum);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    let isSubscribed = true;
    if (activeNumber === 100) {
      setIsActive(false);
    }
    if (isActive && activeNumber !== 100) {
      setTimeout(() => {
        if (isSubscribed && isActive) {
          props.setQuestionNum(activeNumber + 1);
          setActiveNum(activeNumber + 1);
        }
      }, 2000);
    }
    return () => (isSubscribed = false);
  }, [isActive, activeNumber]);
  useEffect(() => {
    setActiveNum(props.questionNum);
  }, [props.questionNum]);
  return (
    <React.Fragment>
      <button
        id="player"
        className="btn btn-primary ml-1 mr-1"
        onClick={() => setIsActive(!isActive)}
      >
        {isActive ? <IoIosPause /> : <IoIosPlay />}
      </button>
      Review Question Paper
    </React.Fragment>
  );
};

export default PaperForm;
