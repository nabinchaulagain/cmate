import React from "react";
import { useDispatch } from "react-redux";
import { addQuestion, editQuestion } from "../../actions/disccusions";
import flashMessage from "../../utils/flashMessage";
import ImageInputs from "../extras/ImageInputs";
const QuestionForm = props => {
  const [formValues, setFormValues] = React.useState(props.initialValues || {});
  const [errors, setErrors] = React.useState({});
  const dispatch = useDispatch();
  return (
    <form
      className="p-1 mb-2 text-center"
      style={{ background: "#8f8c8c" }}
      onSubmit={ev => {
        const wasAccepted = handleFormSubmit(ev, formValues, setErrors);
        if (wasAccepted) {
          const formData = new FormData();
          formData.append("question", formValues.question);
          formData.append("description", formValues.description);
          if (formValues.images) {
            Object.values(formValues.images).forEach(img => {
              if (img instanceof Blob) {
                formData.append("images", img);
              }
            });
          }
          const actionToDispatch =
            props.type === "edit"
              ? editQuestion(props.id, formData)
              : addQuestion(formData);
          dispatch(actionToDispatch);
          setFormValues({});
          setErrors({});
          const messageToFlash =
            props.type === "edit" ? "Question Edited" : "Question added";
          flashMessage(dispatch, messageToFlash);
          props.hideForm();
        }
      }}
      encType="multipart/form-data"
    >
      <div className="text-right">
        <button
          className="btn btn-sm btn-danger"
          onClick={props.hideForm}
          type="button"
        >
          Close
        </button>
      </div>
      <input
        type="text"
        onChange={ev => {
          setFormValues({ ...formValues, question: ev.target.value });
          setErrors({
            ...errors,
            question: validateForm(ev.target.value, "Title")
          });
        }}
        value={formValues.question || ""}
        className="form-control col-10 mx-auto "
        placeholder="Question"
      />
      {errors.question && (
        <div className="text-left col-10 mx-auto">
          <small className="text-danger">{errors.question}</small>
        </div>
      )}
      <textarea
        onChange={ev => {
          setErrors({
            ...errors,
            description: validateForm(ev.target.value, "Body")
          });
          setFormValues({ ...formValues, description: ev.target.value });
        }}
        value={formValues.description || ""}
        rows={5}
        placeholder="Describe your question"
        className="col-10 mx-auto mt-2"
      ></textarea>
      {errors.description && (
        <div className="text-left col-10 mx-auto">
          <small className="text-danger">{errors.description}</small>
        </div>
      )}
      <div className="mx-auto col-10">
        <ImageInputs
          label="Images of your question"
          setImagesInState={images => {
            setFormValues({ ...formValues, images });
          }}
          initialImages={formValues.images}
        />
      </div>
      {props.serverError && (
        <div
          className="bg-danger text-light mx-auto mb-2 px-1 py-1"
          style={{ fontSize: "85%", width: "max-content" }}
        >
          {props.serverError}
        </div>
      )}
      <input
        type="submit"
        className="btn btn-success mt-1"
        value={`${props.type === "edit" ? "Edit" : "Ask"} Question`}
      />
    </form>
  );
};
const validateForm = (fieldValue, fieldName) => {
  if (!fieldValue) {
    return `${fieldName} is required`;
  }
};
const handleFormSubmit = (ev, formValues, setErrors) => {
  ev.preventDefault();
  const questionErr = validateForm(formValues.question, "Question");
  const descriptionErr = validateForm(formValues.description, "Description");
  if (!questionErr && !descriptionErr) {
    return true;
  }
  setErrors({ question: questionErr, description: descriptionErr });
  return false;
};

export default QuestionForm;
