import React, { useState } from "react";
import ImageInput from "../extras/ImageInput";
import Field from "../extras/Field";
import Checkbox from "../extras/Checkbox";
const FieldsComp = props => {
  const [hasImage, setHasImage] = useState(Boolean(props.initialValues.image));
  const [hasDirection, setHasDirection] = useState(
    Boolean(props.initialValues.direction)
  );
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
          className="form-control mt-2 mb-2"
          value={props.initialValues.direction}
          error={props.errors.direction}
        />
      )}
      <Field
        type="text"
        name="question"
        className="form-control mb-3"
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
    <div className="row mx-auto mt-3">
      <Field
        type="text"
        className="col-5 form-control ml-0 mr-2 mx-auto"
        placeholder="Option A"
        name="a"
        value={initialValues.options.a}
        error={errors.a}
      />
      <Field
        type="text"
        className="col-5 form-control mx-auto"
        placeholder="Option B"
        name="b"
        value={initialValues.options.b}
        error={errors.b}
      />
      <Field
        type="text"
        className="col-5 form-control mr-2 mt-2 mx-auto"
        placeholder="Option C"
        name="c"
        value={initialValues.options.c}
        error={errors.c}
      />
      <Field
        type="text"
        className="col-5 form-control mt-2 mx-auto"
        placeholder="Option D"
        name="d"
        value={initialValues.options.d}
        error={errors.d}
      />
    </div>
  );
};

export default FieldsComp;
