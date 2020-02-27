import React, { useState } from "react";
import ImageInput from "../../extras/ImageInput";
import Field from "../../extras/Field";
import Checkbox from "../../extras/Checkbox";
const FieldsComp = ({ initialValues, errors, setImageInState }) => {
  const [hasImage, setHasImage] = useState(Boolean(initialValues.image));
  const [hasDirection, setHasDirection] = useState(
    Boolean(initialValues.direction)
  );
  const [hasDirectionImage, setHasDirectionImage] = useState(
    Boolean(initialValues.directionImage)
  );
  //checkboxes for options for directions and image
  //actual Fields Component
  return (
    <div className="form-group">
      {renderCheckboxes(
        setHasImage,
        hasImage,
        setHasDirection,
        hasDirection,
        hasDirectionImage,
        setHasDirectionImage,
        setImageInState
      )}
      {hasDirection && (
        <React.Fragment>
          <Field
            type="text"
            name="direction"
            placeholder="Direction Detail"
            className="form-control mt-2 form-field"
            value={initialValues.direction && initialValues.direction.text}
            error={errors.direction}
          />
          <div className="ml-0 text-left mt-1">
            <label
              style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "80%" }}
            >
              Direction valid upto question number:
            </label>
            <input
              type="number"
              className="form-control col-md-2 col-3 ml-2 form-field "
              name="direction_upto"
              min="1"
              defaultValue={
                initialValues.direction && initialValues.direction.ending
              }
              max="100"
            />
          </div>
        </React.Fragment>
      )}
      <Field
        type="text"
        name="question"
        className="form-control mt-2 form-field"
        placeholder="Question"
        value={initialValues.question}
        error={errors.question}
      />
      {hasImage && (
        <ImageInput
          setImageInState={setImageInState}
          initialImage={initialValues.image}
          name="question_image"
          label="Question Image"
        />
      )}
      {hasDirectionImage && (
        <React.Fragment>
          <ImageInput
            label="Direction Image"
            name="direction_image"
            initialImage={
              initialValues.directionImage && initialValues.directionImage.url
            }
          />
          <div className="ml-0 text-left mt-1">
            <label
              style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "80%" }}
            >
              Direction Image valid upto question number:
            </label>
            <input
              type="number"
              className="form-control col-md-2 col-3 ml-2 form-field "
              name="direction_image_upto"
              min="1"
              defaultValue={
                initialValues.directionImage &&
                initialValues.directionImage.ending
              }
              max="100"
            />
          </div>
        </React.Fragment>
      )}
      {renderOptions(initialValues, errors)}
    </div>
  );
};

const renderCheckboxes = (
  setHasImage,
  hasImage,
  setHasDirection,
  hasDirection,
  hasDirectionImage,
  setHasDirectionImage,
  setImageInState
) => {
  return (
    <div className="text-center m-1">
      <Checkbox
        onClick={() => {
          if (hasImage) {
            setImageInState(null);
          }
          setHasImage(!hasImage);
        }}
        checked={hasImage}
      ></Checkbox>
      <label className="mr-2">Has Image</label>
      <Checkbox
        onClick={() => setHasDirection(!hasDirection)}
        checked={hasDirection}
      ></Checkbox>
      <label className="mr-2">Has Direction</label>
      <Checkbox
        onClick={() => setHasDirectionImage(!hasDirectionImage)}
        checked={hasDirectionImage}
      ></Checkbox>
      <label>Has Direction Image</label>
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
