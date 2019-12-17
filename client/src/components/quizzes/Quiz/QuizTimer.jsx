import React from "react";
import { QuizContext } from "./QuizProvider";
import { convertTime } from "../../../utils/time";
const QuizTimer = () => {
  const { store } = React.useContext(QuizContext);
  const { hours, minutes, seconds } = convertTime(store.time);
  return (
    <div className="text-center mx-auto">
      <span
        className="text-danger bg-dark p-2"
        style={{ fontSize: "130%", borderRadius: "6px" }}
      >
        {hours}:{minutes}:{seconds}
      </span>
    </div>
  );
};

export default QuizTimer;
