import React from "react";
import axios from "axios";
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
export default renderPDFUpload;
