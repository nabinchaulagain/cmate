import React from "react";
import isImage from "../../utils/isImage";
const ImageInputs = props => {
  const [images, setImages] = React.useState(null);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    setImages(props.initialImages);
  }, [props.initialImages]);
  return (
    <div className="text-left">
      <label
        htmlFor={props.label}
        className={`btn btn-${props.btnVariant || "light"}`}
      >
        {props.label}
      </label>
      <input
        type="file"
        id={props.label}
        style={{ display: "none" }}
        multiple={true}
        onChange={ev => {
          if (Object.keys(ev.target.files).length > (props.maxFiles || 5)) {
            setError(`Only ${props.maxFiles || 5} images or less are allowed`);
          } else {
            if (Object.keys(ev.target.files).length >= 1) {
              for (const imgFile of ev.target.files) {
                if (!isImage(imgFile.name)) {
                  return setError("All files should be images");
                }
              }
              setImages(ev.target.files);
              setError(null);
              props.setImagesInState(ev.target.files);
            }
          }
        }}
        accept=".jpg,.png,.jpeg"
      />
      {images && (
        <div className="text-center">
          {Object.keys(images).map(imageKey => {
            return (
              <img
                src={
                  images[imageKey] instanceof Blob
                    ? URL.createObjectURL(images[imageKey])
                    : `/images/${images[imageKey]}`
                }
                alt="uploadedImage"
                style={{ width: "18%" }}
                className="mr-1"
                key={imageKey}
              />
            );
          })}
        </div>
      )}
      {error && (
        <div
          className="bg-danger text-light mx-auto mb-2 px-1 py-1"
          style={{ fontSize: "85%", width: "max-content" }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageInputs;
