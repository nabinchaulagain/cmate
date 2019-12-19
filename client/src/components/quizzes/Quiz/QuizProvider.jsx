import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import history from "../../../history";
export const QuizContext = React.createContext();

const QuizProvider = props => {
  const [questionPaper, setQuestionPaper] = useState(null);
  const [title, setTitle] = useState(null);
  const [questionNum, setQuestionNum] = useState(1);
  const [answers, setAnswers] = useState({});
  const [skipOnAnswer, setSkipOnAnswer] = useState(true);
  const [time, setTime] = useState(5400);
  const [showResult, setShowResult] = useState(false);
  const setAnswer = React.useCallback((qn, ansNo) => {
    setAnswers({ ...answers, [qn]: ansNo });
    if (qn !== 100 && skipOnAnswer) {
      setQuestionNum(qn + 1);
    }
  });
  const finishQuiz = React.useCallback(async () => {
    await axios.post("/api/saveQuizResult", {
      questionPaperId: props.quizId,
      timeRemaining: time,
      answers
    });
    history.push(`/quizResult/${props.quizId}`);
  });
  useEffect(() => {
    const initQuestionPaper = async () => {
      try {
        const { data } = await axios.get(`/api/getPaper/${props.quizId}`);
        setTitle(data.title);
        setQuestionPaper(data.questions);
      } catch (err) {
        if (err) window.location = "/quizzes";
      }
    };
    initQuestionPaper();
  }, []);
  useEffect(() => {
    let isSubscribed = true;
    if (time !== 0) {
      setTimeout(() => {
        if (isSubscribed) {
          setTime(time - 1);
        }
      }, 950);
    }
    return () => (isSubscribed = false);
  }, [time]);
  return (
    <QuizContext.Provider
      value={{
        store: {
          questionPaper,
          title,
          questionNum,
          answers,
          skipOnAnswer,
          time,
          showResult
        },
        actions: {
          setQuestionNum,
          setAnswer,
          setSkipOnAnswer: () => {
            setSkipOnAnswer(!skipOnAnswer);
          },
          setShowResult,
          finishQuiz
        }
      }}
    >
      {props.children}
    </QuizContext.Provider>
  );
};

const sumbitQuiz = () => {};

export default QuizProvider;
