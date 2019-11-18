import React from "react";
import axios from "axios";
import { validate } from "../QuestionForm";
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

export default renderModalBody;
