import React, { useContext } from "react";
import { QuizContext } from "./QuizProvider";
import "../quizzes.css";
import SingleQuestion from "./SingleQuestion";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import Checkbox from "../../extras/Checkbox";
const Quiz = () => {
  const { store, actions } = useContext(QuizContext);
  if (!store.questionPaper || !store.title) {
    return <div />;
  }
  return (
    <React.Fragment>
      <div className="ml-4 mt-2 col-lg-8 col-12 mx-auto">
        <h2 className="text-center">{store.title}</h2>
        <div className="text-right mb-2">
          <Checkbox
            checked={store.skipOnAnswer}
            onClick={actions.setSkipOnAnswer}
            variant="dark"
          />
          Auto-Skip
        </div>
        <QuestionNumberDisplayer />
      </div>
      <div className="mt-3">
        <h4 className="text-center">Question Number {store.questionNum}</h4>
        {allQuestions(store.questionPaper).filter(
          question => parseInt(question.key) === store.questionNum
        )}
        <div className="row col-lg-8 col-12 mx-auto">
          <div className="text-left col-6">
            {store.questionNum !== 1 && (
              <button
                className="btn btn-success p-2"
                onClick={() => actions.setQuestionNum(store.questionNum - 1)}
              >
                <MdNavigateBefore size="40" />
              </button>
            )}
          </div>
          <div className="text-right col-6">
            {store.questionNum !== 100 && (
              <button
                className="btn btn-success p-2"
                onClick={() => actions.setQuestionNum(store.questionNum + 1)}
              >
                <MdNavigateNext size="40" />
              </button>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const allQuestions = questions => {
  const questionComps = [];
  for (let i = 1; i <= 100; i++) {
    questionComps.push(<SingleQuestion question={questions[i]} key={i} />);
  }
  return questionComps;
};

const QuestionNumberDisplayer = () => {
  const { actions, store } = useContext(QuizContext);
  const elems = [];
  for (let i = 1; i <= 100; i++) {
    elems.push(
      <button
        className={`questionNumBtn ${
          parseInt(store.questionNum) === i ? "selected" : ""
        }`}
        onClick={() => actions.setQuestionNum(i)}
        key={i}
      >
        {i}
      </button>
    );
  }
  return elems;
};

export default Quiz;
