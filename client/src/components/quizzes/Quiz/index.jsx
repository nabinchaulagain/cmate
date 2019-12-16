import React from "react";
import QuizProvider from "./QuizProvider";
import Quiz from "./Quiz";
export default props => {
  return (
    <QuizProvider quizId={props.match.params.id}>
      <Quiz />
    </QuizProvider>
  );
};
