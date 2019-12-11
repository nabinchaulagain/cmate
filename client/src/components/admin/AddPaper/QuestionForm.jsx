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
      className="col-lg-6 col-md-7 col-sm-9 col-11 mx-auto mt-2 p-3 text-center bg-dark text-light"
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
  const directionImage = form.querySelector('input[name="direction_image"]');
  const directionImageSaved = form.querySelector("#direction_imagedisplay");
  const directionImageEnd = form.querySelector(
    'input[name="direction_image_upto"]'
  );
  let directionText = form.querySelector("input[name='direction']");
  const directionUpto = form.querySelector("input[name='direction_upto']");
  let correctOption;
  form.querySelectorAll("input[name='correctOption']").forEach(radioBox => {
    if (radioBox.checked) {
      correctOption = radioBox;
    }
    return;
  });
  const formValues = { question, options: { a, b, c, d } };
  if (directionText && directionUpto) {
    formValues.direction = {
      text: directionText.value,
      ending: directionUpto.value
    };
  }
  if (
    directionImage &&
    directionImageEnd &&
    (directionImage.files[0] || directionImageSaved) &&
    directionImageEnd.value
  ) {
    formValues.directionImage = {
      url: directionImage.files[0]
        ? directionImage.files[0]
        : /.+\/([a-z0-9]+\.\w{3,4})/.exec(directionImageSaved.src)[1],
      ending: directionImageEnd.value
    };
  }
  if (correctOption) {
    formValues.correctOption = correctOption.value;
  }
  if (!directionImage) {
    formValues.directionImage = null;
  }
  if (!directionText) {
    formValues.direction = null;
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
