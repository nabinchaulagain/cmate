import React, { useState } from "react";
const ImageInputField = props => {
  const [uploadedImg, setUploadedImg] = useState(props.initialImage);
  return (
    <div className="mt-2">
      <input
        type="file"
        onChange={ev => {
          setUploadedImg(ev.target.files[0]);
          console.log("we hjere");
          props.setImageInState(ev.target.files[0]);
        }}
        accept=".jpg,.jpeg,.png"
      />
      {uploadedImg && (
        <div className="col-4 mx-auto mt-2">
          <img
            src={
              uploadedImg instanceof Blob
                ? URL.createObjectURL(uploadedImg)
                : `/images/${uploadedImg}`
            }
            alt="uploadedImage"
            width="300"
          />
        </div>
      )}
    </div>
  );
};

export default ImageInputField;
