import React, { useState } from "react";
import QuestionForm, { validate } from "./QuestionForm";
import axios from "axios";
const AddPaper = props => {
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
        {renderPDFUpload(setQuestions, setQuestionNum)}
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

      <div className="alert alert-info col-9 mx-auto mt-4 text-center ">
        Warning: Don't change question numbers unless you're finished with one.
        Progress is not saved for a single question
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
          setQuestions({ ...questions, [qn]: { image } });
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
    }
    elems.push(
      <button className={classes} onClick={() => setQuestionNum(i)} key={i}>
        {i}
      </button>
    );
  }
  return elems;
};
const renderPDFUpload = (setQuestions, setQuestionNum) => {
  return (
    <form className="text-right mb-2 form-group" encType="multipart/form-data">
      <input
        type="file"
        name="questionPaper"
        id="questionPaper"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={event => {
          handlePDFFormSubmit(event, setQuestions, setQuestionNum);
        }}
      />
      <label htmlFor="questionPaper" className="btn btn-info" role="button">
        Upload PDF
      </label>
    </form>
  );
};

const handlePDFFormSubmit = async (event, setQuestions, setQuestionNum) => {
  const PDF = event.target.files[0];
  const formData = new FormData();
  formData.append("questionPaper", PDF);
  const response = await axios.post("/api/admin/uploadPaper", formData);
  console.log(response.data.questions);
  setQuestions(response.data.questions);
};

const getquestionsObj = () => {
  const questions = {};
  for (let i = 1; i <= 100; i++) {
    questions[i] = { options: {} };
  }
  return questions;
};

export default AddPaper;
