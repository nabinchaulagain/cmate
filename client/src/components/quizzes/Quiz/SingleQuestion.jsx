import React from "react";
import SingQuest from "../SingleQuestion";
import { QuizContext } from "./QuizProvider";
const SingleQuestion = ({ question }) => {
  const { actions, store } = React.useContext(QuizContext);
  return <SingQuest question={question} actions={actions} store={store} />;
};
export default SingleQuestion;
