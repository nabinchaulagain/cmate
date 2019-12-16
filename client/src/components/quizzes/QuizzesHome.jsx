import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./quizzes.css";
const QuizzesHome = () => {
  return (
    <div className="col-sm-9 mx-auto mt-2">
      <h3 className="text-center">Browse all the quizzes</h3>
      <QuizList />
    </div>
  );
};
const QuizList = () => {
  const [quizzes, setQuizzes] = useState("unset");
  useEffect(() => {
    axios.get("/api/getPapers").then(response => setQuizzes(response.data));
  }, []);
  if (quizzes === "unset") {
    return <div />;
  }
  if (quizzes.length === 0) {
    return <h1>No quizzes Available for now, sorry!</h1>;
  }
  return quizzes.map(quiz => {
    return (
      <div className="col-lg-8 mb-3 mx-auto quiz-card" key={quiz._id}>
        <h5 className="text-left">
          {quiz.title}
          <small style={{ fontSize: "46%", marginLeft: "5px" }}>
            Added on {new Date(quiz.created_at).toLocaleString()}
          </small>
        </h5>
        <div className="text-left">
          <Link
            to={`/quiz/${quiz._id}`}
            className="btn btn-success text-left"
            style={{ top: 0 }}
          >
            Play quiz
          </Link>
        </div>
      </div>
    );
  });
};

export default QuizzesHome;
