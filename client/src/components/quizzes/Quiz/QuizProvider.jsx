import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

export const QuizContext = React.createContext();

const QuizProvider = props => {
  const [questionPaper, setQuestionPaper] = useState(null);
  const [title, setTitle] = useState(null);
  const [questionNum, setQuestionNum] = useState(1);
  const [answers, setAnswers] = useState({});
  const [skipOnAnswer, setSkipOnAnswer] = useState(true);
  const setAnswer = React.useCallback((qn, ansNo) => {
    setAnswers({ ...answers, [qn]: ansNo });
    if (qn !== 100 && skipOnAnswer) {
      setQuestionNum(qn + 1);
    }
  });
  useEffect(() => {
    const initQuestionPaper = async () => {
      try {
        const { data } = await axios.get(`/api/getPaper/${props.quizId}`);
        setTitle(data.title);
        setQuestionPaper(data.questions);
      } catch (err) {
        window.location = "/quizzes";
      }
    };
    initQuestionPaper();
  }, []);

  return (
    <QuizContext.Provider
      value={{
        store: { questionPaper, title, questionNum, answers, skipOnAnswer },
        actions: {
          setQuestionNum,
          setAnswer,
          setSkipOnAnswer: () => {
            setSkipOnAnswer(!skipOnAnswer);
          }
        }
      }}
    >
      {props.children}
    </QuizContext.Provider>
  );
};

export default QuizProvider;
