import React from "react";
import axios from "axios";
import renderLoading from "../../extras/renderLoading";
import SingleQuizQuestion from "../SingleQuestion";
const QuizResult = props => {
  //questions
  const [questionPaper, setQuestionPaper] = React.useState("unset");
  //answers time performance and title
  const [answerSheet, setAnswerSheet] = React.useState("unset");
  React.useEffect(() => {
    const qpId = props.match.params.id;
    const prom1 = axios.get(`/api/getQuizResult?qpId=${qpId}`);
    const prom2 = axios.get(`/api/getPaper/${qpId}`);
    Promise.all([prom1, prom2]).then(([quizRes, quizQuestions]) => {
      setAnswerSheet(quizRes.data);
      setQuestionPaper(quizQuestions.data);
    });
  }, []);
  if (questionPaper === "unset" || answerSheet === "unset") {
    return renderLoading("Loading....");
  }
  const allQuestions = [];
  for (let i = 1; i < 100; i++) {
    let variant;
    if (answerSheet.answers[i].answered === answerSheet.answers[i].correct) {
      variant = "green";
    } else {
      if (answerSheet.answers[i].answered) {
        variant = "red";
      }
    }
    allQuestions.push(
      <div key={i} className="col-md-9 col-12 mx-auto mb-1">
        <SingleQuizQuestion
          question={questionPaper.questions[i]}
          answer={answerSheet.answers[i]}
          variant={variant}
        />
      </div>
    );
  }
  return (
    <div className=" pt-3" style={{ background: "#dedede", height: "100vh" }}>
      <h3 className="text-center">Your Result for {questionPaper.title}</h3>
      <div className="mx-auto text-center" style={{ fontSize: "110%" }}>
        <span className="text-secondary mr-4">
          Attemped:{100 - answerSheet.performance.notAttempted}
        </span>
        <span className="text-success mr-4">
          Correct Answers: {answerSheet.performance.rightAnswers}
        </span>
        <span className="text-danger">
          Wrong Answers: {answerSheet.performance.wrongAnswers}
        </span>
      </div>
      {allQuestions}
    </div>
  );
};
export default QuizResult;
