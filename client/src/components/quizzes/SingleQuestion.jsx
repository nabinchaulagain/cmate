import React from "react";
import formatQuestion from "../../utils/formatQuestion";
import ReportQuestion from "./ReportQuestion";
const SingleQuestion = ({
  question,
  answer,
  actions,
  store,
  variant,
  questionNum
}) => {
  return (
    <div
      className={`col-lg-8 col-sm-10 col-12 mx-auto jumbotron p-3 ${
        variant === "green" ? "singleQuestionRight" : ""
      }${variant === "red" ? "singleQuestionWrong" : ""}`}
    >
      {questionNum && (
        <h6 className="text-center">Question No. {questionNum}</h6>
      )}
      <div className="text-right">
        <ReportQuestion questionNum={questionNum || store.questionNum} />
      </div>
      <Direction direction={question.direction} />
      <h5
        dangerouslySetInnerHTML={{ __html: formatQuestion(question.question) }}
        className="text-left col-11 mr-4 mx-auto"
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
        {!answer && (
          <Options
            options={question.options}
            setAnswer={ans => {
              actions.setAnswer(store.questionNum, ans);
            }}
            correctOption={store.answers && store.answers[store.questionNum]}
          />
        )}
        {answer && (
          <OptionsWithAnswer options={question.options} answer={answer} />
        )}
      </div>
    </div>
  );
};

const Direction = ({ direction }) => {
  if (!direction) {
    return <div />;
  }
  if (
    direction.length <= 200 &&
    !direction.includes("paragraph") &&
    !direction.includes("passage")
  ) {
    return (
      <h5 dangerouslySetInnerHTML={{ __html: formatQuestion(direction) }}></h5>
    );
  }
  return (
    <p
      dangerouslySetInnerHTML={{
        __html: direction
      }}
    ></p>
  );
};
const Options = ({ options, setAnswer, correctOption }) => {
  return Object.keys(options).map((optNo, index) => {
    return (
      <div className={`col-6 mb-2 text-center`} key={optNo}>
        <button
          className={`btn text-center p-2 btn-${
            optNo === correctOption ? "info" : "warning"
          }`}
          onClick={() => setAnswer(optNo)}
        >
          {options[optNo]}
        </button>
      </div>
    );
  });
};

const OptionsWithAnswer = ({ options, answer }) => {
  return Object.keys(options).map((optNo, index) => {
    let buttonClasses = "btn btn-secondary";
    if (optNo === answer.answered) {
      buttonClasses = "btn btn-warning";
    }
    if (optNo === answer.correct) {
      buttonClasses = "btn btn-success";
    }
    return (
      <div className={`col-6 mb-2 text-center`} key={optNo}>
        <button className={buttonClasses}>{options[optNo]}</button>
      </div>
    );
  });
};
export default SingleQuestion;
