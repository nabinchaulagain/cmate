import React, { useState } from "react";
import axios from "axios";
import { validate } from "./QuestionForm";
import history from "../../../history";
import { useDispatch } from "react-redux";
import flashMessage from "../../../utils/flashMessage";
const ModalBody = ({ questions }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
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
      onSubmit={event =>
        saveQuestionPaper(event, questions, setError, dispatch)
      }
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
        {error && (
          <small className="text-danger" style={{ fontSize: "80%" }}>
            {error}
          </small>
        )}
      </div>

      <input
        type="submit"
        className="btn btn-success mt-2"
        value="Confirm Save"
      />
    </form>
  );
};

const saveQuestionPaper = async (event, questions, setError, dispatch) => {
  event.preventDefault();
  const form = event.target;
  const input = form.querySelector("#modalFormInput");
  const questionsToSend = {};
  const formData = new FormData();
  if (!input.value) {
    return setError("Question title is required");
  }
  for (let i = 1; i <= 100; i++) {
    questionsToSend[i] = { ...questions[i] };
    if (questions[i].image) {
      formData.append("question." + i, questions[i].image);
      delete questionsToSend[i].image;
    }
    if (questions[i].directionImage) {
      formData.append(
        "directionImage." + i + "." + questions[i].directionImage.ending,
        questions[i].directionImage.url
      );
      delete questionsToSend[i].directionImage;
    }
  }
  formData.append("questions", JSON.stringify(questionsToSend));
  formData.append("title", input.value);
  await axios.post("/api/admin/savePaper", formData);
  history.push("/admin");
  flashMessage(dispatch, "Question Paper was Added");
};

export default ModalBody;
