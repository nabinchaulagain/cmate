import React, { useState } from "react";
const ImageInputField = props => {
  const [uploadedImg, setUploadedImg] = useState(props.initialImage);
  return (
    <div className="mt-2">
      <div className="text-left">
        <label htmlFor={props.name} className="btn btn-light btn-sm">
          Upload {props.label}
        </label>
      </div>
      <input
        type="file"
        name={props.name}
        onChange={ev => {
          setUploadedImg(ev.target.files[0]);
          if (props.setImageInState) {
            props.setImageInState(ev.target.files[0]);
          }
        }}
        style={{ display: "none" }}
        id={props.name}
        accept=".jpg,.jpeg,.png"
      />
      {uploadedImg && (
        <div className="col-4 mx-auto mt-2">
          <img
            id={props.name + "display"}
            src={
              uploadedImg instanceof Blob
                ? URL.createObjectURL(uploadedImg)
                : `/images/${uploadedImg}`
            }
            alt="uploadedImage"
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageInputField;
