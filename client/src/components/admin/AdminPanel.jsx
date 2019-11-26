import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Admin.css";
import axios from "axios";
import Modal from "../extras/Modal";
import { Link } from "react-router-dom";
const AdminHome = () => {
  const [questions, setQuestions] = useState("unset");
  useEffect(() => {
    const getAndSetQuestions = async () => {
      const response = await axios.get("/api/getPapers");
      setQuestions(response.data);
    };
    getAndSetQuestions();
  }, []);
  return (
    <div className="row">
      <Sidebar />
      <div className="jumbotron col-9 p-0" style={{ height: "100vh" }}>
        <h2 className="text-center">Question Papers</h2>
        {renderQuestionPaperList(questions)}
      </div>
    </div>
  );
};

const renderQuestionPaperList = questions => {
  if (questions.length !== 0 && questions !== "unset") {
    return (
      <ul>
        {questions.map(question => (
          <QuestionPaperCard question={question} key={question._id} />
        ))}
      </ul>
    );
  }
};
const QuestionPaperCard = ({ question }) => {
  return (
    <div
      className="card bg-light p-2 mr-4 mb-2 text-dark"
      to={`/admin/editPaper/${question._id}`}
    >
      <h5>{question.title}</h5>
      <small>Created at {new Date(question.created_at).toLocaleString()}</small>
      {!question.isCompleted && (
        <strong className="text-danger">
          {" "}
          {question.incompletes} incompete questions
        </strong>
      )}
      <div className="text-center">
        <Link
          to={`/admin/editPaper/${question._id}`}
          className="btn btn-success btn-sm mr-3"
        >
          Edit Question Paper
        </Link>
        <Modal
          openButton={{
            className: "btn btn-sm btn-danger",
            text: "Delete Question paper"
          }}
          modalHeading={`Delete ${question.title}?`}
          modalBody={
            <div>
              <button className="btn btn-lg btn-success">Yes</button>
              <button className="btn btn-lg btn-danger ml-2">No</button>
            </div>
          }
        />
      </div>
    </div>
  );
};
export default AdminHome;
