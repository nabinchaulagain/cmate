import React, { useState, useEffect } from "react";
import ImageInput from "../../extras/ImageInput";
import Field from "../../extras/Field";
import Checkbox from "../../extras/Checkbox";
const FieldsComp = props => {
  const [hasImage, setHasImage] = useState(Boolean(props.initialValues.image));
  const [hasDirection, setHasDirection] = useState(
    Boolean(props.initialValues.direction)
  );
  useEffect(() => {
    if (!hasImage) {
      props.setImageInState(null);
    }
  }, [hasImage]);
  //checkboxes for options for directions and image
  //actual Fields Component
  return (
    <div className="form-group">
      {renderCheckboxes(setHasImage, hasImage, setHasDirection, hasDirection)}
      {hasDirection && (
        <Field
          type="text"
          name="direction"
          placeholder="Direction Detail"
          className="form-control mt-2 form-field"
          value={props.initialValues.direction}
          error={props.errors.direction}
        />
      )}
      <Field
        type="text"
        name="question"
        className="form-control mt-2 form-field"
        placeholder="Question"
        value={props.initialValues.question}
        error={props.errors.question}
      />
      {hasImage && (
        <ImageInput
          setImageInState={props.setImageInState}
          initialImage={props.initialValues.image}
        />
      )}
      {renderOptions(props.initialValues, props.errors)}
    </div>
  );
};

const renderCheckboxes = (
  setHasImage,
  hasImage,
  setHasDirection,
  hasDirection
) => {
  return (
    <div className="text-center m-2">
      <Checkbox
        onClick={() => setHasImage(!hasImage)}
        checked={hasImage}
      ></Checkbox>
      <label className="mr-3">Has Image</label>
      <Checkbox
        onClick={() => setHasDirection(!hasDirection)}
        checked={hasDirection}
      ></Checkbox>
      <label>Has Direction</label>
    </div>
  );
};
const renderOptions = (initialValues, errors) => {
  return (
    <div className=" mx-auto mt-3 row">
      <Field
        type="text"
        className="col-5 form-control ml-0 mr-2 mx-auto"
        placeholder="Option A"
        name="a"
        value={initialValues.options.a}
      />
      <Field
        type="text"
        className="col-5 form-control mx-auto"
        placeholder="Option B"
        name="b"
        value={initialValues.options.b}
      />
      {renderFieldError(errors, "a")}
      {renderFieldError(errors, "b")}
      <Field
        type="text"
        className="col-5 form-control mt-2 mx-auto"
        placeholder="Option C"
        name="c"
        value={initialValues.options.c}
      />
      <Field
        type="text"
        className="col-5 form-control mt-2 mx-auto "
        placeholder="Option D"
        name="d"
        value={initialValues.options.d}
      />
      {renderFieldError(errors, "c")}
      {renderFieldError(errors, "d")}
      {renderRadioButtons(initialValues)}
      {renderFieldError(errors, "correctOption", "center", 11)}
    </div>
  );
};
const renderRadioButtons = initialValues => {
  return (
    <div className="col-12 mt-4">
      <div>Correct Option</div>
      A
      <input
        type="radio"
        name="correctOption"
        className="ml-1 mr-4"
        value="a"
        defaultChecked={initialValues.correctOption === "a"}
      />
      B
      <input
        type="radio"
        name="correctOption"
        className="ml-1 mr-4"
        value="b"
        defaultChecked={initialValues.correctOption === "b"}
      />
      C
      <input
        type="radio"
        name="correctOption"
        className="ml-1 mr-4"
        value="c"
        defaultChecked={initialValues.correctOption === "c"}
      />
      D
      <input
        type="radio"
        name="correctOption"
        className="ml-1 mr-4"
        value="d"
        defaultChecked={initialValues.correctOption === "d"}
      />
    </div>
  );
};

const renderFieldError = (errors, fieldName, align = "left", colWidth = 6) => {
  if (errors[fieldName]) {
    return (
      <div className={`form-field-error col-${colWidth} text-${align}`}>
        <small className="ml-4">{errors[fieldName]}</small>
      </div>
    );
  }
};
export default FieldsComp;
