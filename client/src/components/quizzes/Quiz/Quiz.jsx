import React, { useContext } from "react";
import { QuizContext } from "./QuizProvider";
import "../quizzes.css";
import SingleQuestion from "./SingleQuestion";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import Checkbox from "../../extras/Checkbox";
import QuizTimer from "./QuizTimer";
import Modal from "../../extras/Modal";

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
          <QuizTimer />
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
                className="btn btn-sm btn-success p-2"
                onClick={() => actions.setQuestionNum(store.questionNum - 1)}
              >
                <MdNavigateBefore size="20" />
              </button>
            )}
          </div>
          <div className="text-right col-6">
            {store.questionNum !== 100 && (
              <button
                className="btn btn-sm btn-success p-2"
                onClick={() => actions.setQuestionNum(store.questionNum + 1)}
              >
                <MdNavigateNext size="20" />
              </button>
            )}
          </div>
        </div>
        <div className="text-center mb-4">
          {Object.keys(store.answers).length !== 100 && (
            <Modal
              openButton={{
                className: "btn btn-info save-qp-button mr-3",
                text: "Save my progress"
              }}
              modalHeading="Save my progress?"
              modalBody={<SaveProgressModal store={store} actions={actions} />}
            />
          )}
          <Modal
            openButton={{
              className: "btn btn-primary save-qp-button",
              text: "I am done"
            }}
            modalHeading="Are you Done?"
            modalBody={<SubmitModal store={store} actions={actions} />}
          />
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
        className={`questionNumBtn 
        ${store.answers[i] ? "answered" : ""}
        ${parseInt(store.questionNum) === i ? "selected" : ""}`}
        onClick={() => actions.setQuestionNum(i)}
        key={i}
      >
        {i}
      </button>
    );
  }
  return elems;
};

const SubmitModal = ({ actions, store }) => {
  const incompleteQuestions = 100 - Object.keys(store.answers).length;
  if (incompleteQuestions === 0) {
    return (
      <div>
        <p>It is recomended that you go through your answers at least twice</p>
        <button className="btn btn-success" onClick={actions.finishQuiz}>
          Confirm Answers
        </button>
      </div>
    );
  }
  return (
    <div>
      <p>
        There are still{" "}
        <b className="text-danger">{incompleteQuestions} questions</b> you
        haven't attempted. Do you still want to finish?
      </p>
      <button className="btn btn-lg btn-success" onClick={actions.finishQuiz}>
        Yes
      </button>
    </div>
  );
};

const SaveProgressModal = ({ actions }) => {
  return (
    <div>
      <p>Are you sure you want to save your progress?</p>
      <button className="btn btn-lg btn-success" onClick={actions.saveProgress}>
        Yes
      </button>
    </div>
  );
};

export default Quiz;
