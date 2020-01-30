import React from "react";
import QuestionReplies from "./QuestionReplies";
const QuestionModal = ({ description, images, id }) => {
  return (
    <div
      className="col-12 mx-auto"
      style={{ height: "auto", paddingBottom: "70vh" }}
    >
      <p className="text-left mb-4">{description}</p>

      <div className="row text-center">
        {images &&
          images.map(imageLoc => (
            <div className="col-sm-6 mb-2" key={imageLoc}>
              <img
                src={`/images/${imageLoc}`}
                alt={description}
                style={{ width: "100%" }}
              />
            </div>
          ))}
      </div>
      <QuestionReplies id={id} />
    </div>
  );
};

export default QuestionModal;
