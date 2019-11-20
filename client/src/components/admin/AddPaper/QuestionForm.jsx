import React, { useState } from "react";
import FieldComps from "./FormFields";
const QuestionForm = props => {
  const [errors, setErrors] = useState({});
  let question = props.initialValues;
  if (question === "missing") {
    question = { options: {} };
  }
  return (
    <form
      encType="multipart/form-data"
      className="col-sm-7 mx-auto mt-2 p-3 text-center bg-dark text-light"
      style={{ borderRadius: "15px" }}
      onSubmit={event => {
        event.preventDefault();
        handleSubmit(setErrors, event, props.addQuestion, props.goToNext);
      }}
    >
      <h4 className="text-center">Question No. {props.questionNum}</h4>
      <FieldComps
        setImageInState={props.setImageInState}
        initialValues={question}
        errors={errors}
      />
      <input
        type="submit"
        value="Save Question"
        className="btn btn-primary mt-2"
      />
    </form>
  );
};
const handleSubmit = (setErrors, event, addQuestion, goToNext) => {
  const form = event.target;
  const question = form.querySelector("input[name='question']").value;
  const a = form.querySelector('input[name="a"]').value;
  const b = form.querySelector('input[name="b"]').value;
  const c = form.querySelector('input[name="c"]').value;
  const d = form.querySelector('input[name="d"]').value;
  let direction = form.querySelector("input[name='direction']");
  let correctOption;
  form.querySelectorAll("input[name='correctOption']").forEach(radioBox => {
    if (radioBox.checked) {
      correctOption = radioBox;
    }
    return;
  });
  const formValues = { question, options: { a, b, c, d } };
  if (direction) {
    formValues.direction = direction.value;
  }
  if (correctOption) {
    formValues.correctOption = correctOption.value;
  }
  const errors = validate(formValues);
  //if no errors
  if (Object.keys(errors).length !== 0) {
    return setErrors(errors);
  } else {
    addQuestion(formValues);
    goToNext();
  }
};
export const validate = formValues => {
  const errors = {};
  if (!formValues.question) {
    errors.question = "Question is required";
  }
  ["a", "b", "c", "d"].forEach(opt => {
    if (!formValues.options[opt]) {
      errors[opt] = `Option ${opt.toUpperCase()} is required`;
    }
  });
  if (!formValues.correctOption) {
    errors.correctOption = "Correct Option required";
  }
  return errors;
};
export default QuestionForm;
