import React from "react";
import { QuizContext } from "./QuizProvider";
import formatQuestion from "../../../utils/formatQuestion";
const SingleQuestion = ({ question }) => {
  const { store, actions } = React.useContext(QuizContext);
  return (
    <div className="col-lg-8 col-sm-10 col-12 mx-auto jumbotron p-3">
      <h5
        dangerouslySetInnerHTML={{ __html: formatQuestion(question.direction) }}
      ></h5>
      <h5
        dangerouslySetInnerHTML={{ __html: formatQuestion(question.question) }}
        className="text-left col-11 mr-4 mx-auto mt-3"
      ></h5>
      {question.directionImage && (
        <img
          src={`/images/${question.directionImage}`}
          style={{ width: "100%" }}
        />
      )}
      {question.image && (
        <img src={`/images/${question.image}`} style={{ width: "100%" }} />
      )}
      <div className="row col-12 mx-auto">
        <Options
          options={question.options}
          setAnswer={ans => {
            actions.setAnswer(store.questionNum, ans);
          }}
          correctOption={store.answers && store.answers[store.questionNum]}
        />
      </div>
    </div>
  );
};

const Options = ({ options, setAnswer, correctOption }) => {
  return Object.keys(options).map((optNo, index) => {
    return (
      <div className={`col-6 mb-2 text-center`} key={optNo}>
        <button
          className={`btn text-center p-2 btn-${
            optNo === correctOption ? "success" : "warning"
          }`}
          onClick={() => setAnswer(optNo)}
        >
          {options[optNo]}
        </button>
      </div>
    );
  });
};

export default SingleQuestion;
