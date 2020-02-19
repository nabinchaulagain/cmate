import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import history from "../../../history";
import { Prompt } from "react-router-dom";
export const QuizContext = React.createContext();

const QuizProvider = props => {
  const [questionPaper, setQuestionPaper] = useState(null);
  const [title, setTitle] = useState(null);
  const [questionNum, setQuestionNum] = useState(1);
  const [answers, setAnswers] = useState(props.initialValues.answers);
  const [skipOnAnswer, setSkipOnAnswer] = useState(true);
  const [time, setTime] = useState(props.initialValues.timeRemaining);
  const setAnswer = React.useCallback(
    (qn, ansNo) => {
      setAnswers({ ...answers, [qn]: ansNo });
      if (qn !== 100 && skipOnAnswer) {
        setQuestionNum(qn + 1);
      }
    },
    [answers, skipOnAnswer]
  );
  const saveProgress = React.useCallback(async () => {
    await axios.put("/api/saveQuizProgress", {
      timeRemaining: time,
      answers,
      questionPaperId: props.quizId
    });
    history.push("/");
  }, [answers, props, time]);
  const finishQuiz = React.useCallback(async () => {
    await axios.post("/api/saveQuizResult", {
      questionPaperId: props.quizId,
      timeRemaining: time,
      answers
    });
    history.push(`/quizResult/${props.quizId}`);
  }, [props.quizId, answers, time]);
  useEffect(() => {
    const initQuestionPaper = async () => {
      try {
        const { data } = await axios.get(`/api/getPaper/${props.quizId}`);
        setTitle(data.title);
        setQuestionPaper(data.questions);
      } catch (err) {
        console.log(err);
        // if (err) window.location = "/quizzes";
      }
    };
    initQuestionPaper();
  }, [props.quizId]);
  useEffect(() => {
    let isSubscribed = true;
    if (time !== 0) {
      setTimeout(() => {
        if (isSubscribed) {
          setTime(time - 1);
        }
      }, 950);
    } else {
      if (isSubscribed) {
        finishQuiz();
      }
    }
    return () => (isSubscribed = false);
  }, [time, finishQuiz]);
  return (
    <QuizContext.Provider
      value={{
        store: {
          questionPaper,
          title,
          questionNum,
          answers,
          skipOnAnswer,
          time
        },
        actions: {
          setQuestionNum,
          setAnswer,
          setSkipOnAnswer: () => {
            setSkipOnAnswer(!skipOnAnswer);
          },
          finishQuiz,
          saveProgress
        }
      }}
    >
      <Prompt
        message="Are you sure you want to leave? You might want to save your progress or finish the quiz"
        when={time !== 0 && !isModalOpen()}
      />
      {props.children}
    </QuizContext.Provider>
  );
};

const isModalOpen = () => {
  const modal = document.querySelector("div[role='dialog']");
  return Boolean(modal);
};
export default QuizProvider;
