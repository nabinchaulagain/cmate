import React, { useState } from "react";
const ImageInputField = props => {
  const [uploadedImg, setUploadedImg] = useState(props.initialImage);
  return (
    <div>
      <input
        type="file"
        onChange={ev => {
          setUploadedImg(ev.target.files[0]);
          props.setImageInState(ev.target.files[0]);
        }}
        accept=".jpg,.jpeg,.png"
      />
      {uploadedImg && (
        <div className="col-4 mx-auto mt-2">
          <img
            src={URL.createObjectURL(uploadedImg)}
            alt="uploadedImage"
            width="300"
          />
        </div>
      )}
    </div>
  );
};

export default ImageInputField;
