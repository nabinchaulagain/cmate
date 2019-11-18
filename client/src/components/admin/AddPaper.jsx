import React, { useState } from "react";
import QuestionForm, { validate } from "./QuestionForm";
import Modal from "../extras/Modal";
import axios from "axios";
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
const allQuestionForms = (
  questions,
  addQuestion,
  setQuestionNum,
  setQuestions
) => {
  const comps = [];
  for (let qn = 1; qn <= 100; qn++) {
    comps.push(
      <QuestionForm
        questionNum={qn}
        addQuestion={addQuestion}
        initialValues={questions[qn]}
        key={qn}
        goToNext={() => {
          setQuestionNum(qn + 1);
        }}
        setImageInState={image => {
          setQuestions({ ...questions, [qn]: { image, ...questions[qn] } });
        }}
      />
    );
  }
  return comps;
};
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
const renderPDFUpload = (setQuestions, questions) => {
  return (
    <form className="text-right mb-2 form-group" encType="multipart/form-data">
      <input
        type="file"
        name="questionPaper"
        id="questionPaper"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={event =>
          handleQuestionPDFSubmit(event, setQuestions, questions)
        }
      />
      <input
        type="file"
        name="answerSheet"
        id="answerSheet"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={event =>
          handleAnswerPDFSubmit(event, setQuestions, questions)
        }
      />
      <label
        htmlFor="questionPaper"
        className="btn btn-info mr-2"
        role="button"
      >
        Upload PDF Question Paper
      </label>
      <label htmlFor="answerSheet" className="btn btn-danger" role="button">
        Upload PDF Answer sheet
      </label>
    </form>
  );
};

const handleQuestionPDFSubmit = async (event, setQuestions, questions) => {
  const PDF = event.target.files[0];
  const formData = new FormData();
  formData.append("questionPaper", PDF);
  try {
    const response = await axios.post("/api/admin/uploadPaper", formData);
    const responseQuestions = response.data.questions;
    const newQuestions = { ...questions };
    for (let i = 1; i <= 100; i++) {
      newQuestions[i] = { ...newQuestions[i], ...responseQuestions[i] };
    }
    setQuestions(newQuestions);
  } catch (err) {}
};
const handleAnswerPDFSubmit = async (event, setQuestions, questions) => {
  const PDF = event.target.files[0];
  const formData = new FormData();
  formData.append("answerSheet", PDF);
  try {
    const response = await axios.post("/api/admin/uploadAnswer", formData);
    const newQuestions = { ...questions };
    const answers = response.data;
    for (let i = 1; i <= 100; i++) {
      if (newQuestions[i] === "missing") {
        newQuestions[i] = { options: {}, correctOption: answers[i] };
      }
      newQuestions[i] = { ...newQuestions[i], correctOption: answers[i] };
    }
    setQuestions(newQuestions);
  } catch (err) {}
};

const renderModalBody = questions => {
  let warnings = 0;
  let incompletes = 0;
  for (let i = 1; i <= 100; i++) {
    if (questions[i] === "missing") {
      warnings++;
    } else {
      const errors = validate(questions[i]);
      if (Object.keys(errors).length === 5) {
        warnings++;
      } else {
        if (Object.keys(errors).length !== 0) {
          incompletes++;
        }
      }
    }
  }
  return (
    <form
      onSubmit={event => saveQuestionPaper(event, questions)}
      encType="multipart/form-data"
    >
      <h6>
        {warnings === 0 ? (
          "No warnings"
        ) : (
          <span className="text-danger">{warnings} warnings</span>
        )}{" "}
        and{" "}
        {incompletes === 0 ? (
          "No incomplete questions"
        ) : (
          <span className="text-warning">
            {incompletes} incomplete questions
          </span>
        )}{" "}
        found.
      </h6>
      <div>
        <label>Question Paper Name: </label>
        <input
          type="text"
          className="form-control col-7 ml-2"
          id="modalFormInput"
          style={{ display: "inline" }}
        />
      </div>

      <input
        type="submit"
        className="btn btn-success mt-2"
        value="Confirm Save"
      />
    </form>
  );
};
const saveQuestionPaper = async (event, questions) => {
  event.preventDefault();
  const form = event.target;
  const input = form.querySelector("#modalFormInput");
  const questionsToSend = {};
  const formData = new FormData();
  if (!input.value) {
    return;
  }
  for (let i = 1; i <= 100; i++) {
    questionsToSend[i] = { ...questions[i] };
    if (questions[i].image) {
      // questionImages.push(questions[i].image);
      formData.append("question." + i, questions[i].image);
      delete questionsToSend[i].image;
    }
  }
  formData.append("questions", JSON.stringify(questionsToSend));
  formData.append("title", input.value);
  const res = await axios.post("/api/admin/savePaper", formData);
  console.log(res.data);
};
const getquestionsObj = () => {
  const questions = {};
  for (let i = 1; i <= 100; i++) {
    questions[i] = { options: {} };
  }
  return questions;
};

export default AddPaper;
