import React from "react";
import axios from "axios";
import renderLoading from "../../extras/renderLoading";
import SingleQuestion from "../SingleQuestion";
import { convertTime } from "../../../utils/time";
const QuizResult = props => {
  //questions and title
  const [questionPaper, setQuestionPaper] = React.useState("unset");
  //answers time performance
  const [answerSheet, setAnswerSheet] = React.useState("unset");
  const [currentPage, setCurrentPage] = React.useState(1);
  React.useEffect(() => {
    const qpId = props.match.params.id;
    const prom1 = axios.get(`/api/getQuizResult?qpId=${qpId}`);
    const prom2 = axios.get(`/api/getPaper/${qpId}`);
    Promise.all([prom1, prom2]).then(([quizRes, quizQuestions]) => {
      setAnswerSheet(quizRes.data);
      setQuestionPaper(quizQuestions.data);
    });
  }, []);
  React.useEffect(() => {
    if (
      questionPaper !== "unset" &&
      answerSheet !== "unset" &&
      !window.isListenerAppended
    ) {
      const handleScroll = () => {
        const lastQuestion = document.querySelector(".singleQues:last-of-type");
        if (
          lastQuestion.offsetTop + lastQuestion.clientHeight <
          window.pageYOffset + window.innerHeight
        ) {
          setCurrentPage(currentPage + 1);
        }
      };
      window.isListenerAppended = true;
      document.addEventListener("scroll", handleScroll);
      return () => {
        window.isListenerAppended = false;
        document.removeEventListener("scroll", handleScroll);
      };
    }
  }, [currentPage, questionPaper, answerSheet]);
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
      <div key={i} className="col-md-9 col-12 mx-auto mb-1 singleQues">
        <SingleQuestion
          question={questionPaper.questions[i]}
          answer={answerSheet.answers[i]}
          variant={variant}
          questionNum={i}
        />
      </div>
    );
  }
  const { hours, seconds, minutes } = convertTime(
    5400 - answerSheet.timeRemaining
  );
  return (
    <div
      className="pt-3"
      style={{
        background: "#dedede",
        height: "auto",
        paddingBottom: "2%"
      }}
    >
      <h3 className="text-center">Your Result for {questionPaper.title}</h3>
      <h4 className="text-center">
        Finished in {hours}:{minutes}:{seconds}
      </h4>
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
      {allQuestions.slice(0, currentPage * 5)}
    </div>
  );
};
export default QuizResult;
