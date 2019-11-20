import React, { useState } from "react";
import axios from "axios";
const PDFUpload = ({ setQuestions, questions, setIsLoading }) => {
  const [error, setError] = useState(false);
  return (
    <form className="text-right mb-2 form-group" encType="multipart/form-data">
      <input
        type="file"
        name="questionPaper"
        id="questionPaper"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={event =>
          handleQuestionPDFSubmit(
            event,
            setQuestions,
            questions,
            setIsLoading,
            setError
          )
        }
      />
      <input
        type="file"
        name="answerSheet"
        id="answerSheet"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={event =>
          handleAnswerPDFSubmit(
            event,
            setQuestions,
            questions,
            setIsLoading,
            setError
          )
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
      {error && (
        <div
          className="text-center bg-danger col-lg-6 col-8 mx-auto "
          style={{ height: "auto" }}
        >
          <small className="text-light" style={{ fontSize: "70%" }}>
            {error}
          </small>
        </div>
      )}
    </form>
  );
};

const handleQuestionPDFSubmit = async (
  event,
  setQuestions,
  questions,
  setIsLoading,
  setError
) => {
  const PDF = event.target.files[0];
  const formData = new FormData();
  formData.append("questionPaper", PDF);
  try {
    setIsLoading("Uploading question and processing .......");
    const response = await axios.post("/api/admin/uploadPaper", formData);
    const responseQuestions = response.data.questions;
    const newQuestions = { ...questions };
    for (let i = 1; i <= 100; i++) {
      //update each question by overriding existing values(could be empty objects)
      newQuestions[i] = { ...newQuestions[i], ...responseQuestions[i] };
    }
    setQuestions(newQuestions);
    setError(false);
  } catch (err) {
    setError("Please make sure the pdf is a correct question paper");
  } finally {
    setIsLoading(false);
  }
};
const handleAnswerPDFSubmit = async (
  event,
  setQuestions,
  questions,
  setIsLoading,
  setError
) => {
  const PDF = event.target.files[0];
  const formData = new FormData();
  formData.append("answerSheet", PDF);
  try {
    setIsLoading("Uploading answer and processing .......");
    const response = await axios.post("/api/admin/uploadAnswer", formData);
    const newQuestions = { ...questions };
    const answers = response.data;
    for (let i = 1; i <= 100; i++) {
      if (newQuestions[i] === "missing") {
        newQuestions[i] = { options: {}, correctOption: answers[i] };
      }
      //update each question by overriding existing values(could be empty objects)
      newQuestions[i] = { ...newQuestions[i], correctOption: answers[i] };
    }
    setQuestions(newQuestions);
    setError(false);
  } catch (err) {
    setError("Please make sure the pdf is a correct answer paper");
  } finally {
    setIsLoading(false);
  }
};
export default PDFUpload;
