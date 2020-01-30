import React from "react";
import ImageInputs from "../extras/ImageInputs";
import { useDispatch } from "react-redux";
import { addReply } from "../../actions/disccusions";
import flashMessage from "../../utils/flashMessage";
const ReplyForm = ({ id, initialValues, type, label }) => {
  const [images, setImages] = React.useState(null);
  const dispatch = useDispatch();
  return (
    <form
      className="p-0 text-left mt-1"
      encType="multipart/form-data"
      onSubmit={ev => {
        handleAddSubmit(ev, images, id, dispatch, setImages);
      }}
    >
      {!images && (
        <ImageInputs
          setImagesInState={setImages}
          btnVariant="info"
          label={label || "Reply"}
          maxFiles={3}
        />
      )}
      {images && (
        <React.Fragment>
          <div className="text-center row">
            {Object.keys(images).map(imageKey => (
              <div className="col-3" key={imageKey}>
                <img
                  src={URL.createObjectURL(images[imageKey])}
                  alt="uploads"
                  style={{ width: "100%", height: 200 }}
                />
              </div>
            ))}
          </div>
          <div className="text-center">
            <input
              type="submit"
              value="Confirm"
              className="btn btn-success mt-2"
            />
          </div>
        </React.Fragment>
      )}
    </form>
  );
};

const handleAddSubmit = (event, images, id, dispatch, setImages) => {
  event.preventDefault();
  const formData = new FormData();
  Object.values(images).forEach(img => {
    formData.append("images", img);
  });
  dispatch(addReply(id, formData));
  setImages(null);
  flashMessage(dispatch, "Replied");
};

export default ReplyForm;
