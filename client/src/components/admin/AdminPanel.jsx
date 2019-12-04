import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Admin.css";
import axios from "axios";
import Modal from "../extras/Modal";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import flashMessage from "../../utils/flashMessage";
import renderLoading from "../extras/renderLoading";
const AdminHome = () => {
  const [questions, setQuestions] = useState("unset");
  const [currentPage, setCurrentPage] = useState(1);
  const [reloadPage, setReloadPage] = useState(Math.random());
  useEffect(() => {
    const getAndSetQuestions = async () => {
      const response = await axios.get("/api/getPapers");
      setQuestions(response.data);
    };
    getAndSetQuestions();
  }, [reloadPage]);
  return (
    <div className="row">
      <Sidebar />
      <div className="jumbotron col-9 p-0" style={{ height: "100vh" }}>
        <h2 className="text-center">Question Papers</h2>
        {//render list of questions in current page
        Array.isArray(questions) &&
          renderQuestionPaperList(
            questions.filter(
              (qn, index) =>
                index + 1 <= currentPage * 4 &&
                index + 1 > (currentPage - 1) * 4
            ),
            setReloadPage
          )}
        {Array.isArray(questions) &&
          renderPagination(
            currentPage,
            Math.ceil(questions.length / 4),
            setCurrentPage
          )}
        {!Array.isArray(questions) && renderLoading("Loading questions ....")}
      </div>
    </div>
  );
};

const renderPagination = (currentPage, questions, setCurrentPage) => {
  const elems = [];
  for (let i = 1; i <= questions; i++) {
    elems.push(
      <button
        className={`btn btn-${
          i === currentPage ? "primary" : "secondary"
        } mr-1`}
        onClick={() => setCurrentPage(i)}
        key={i}
      >
        {i}
      </button>
    );
  }
  if(elems.length>1){
    return <div className="text-center">{elems}</div>;
  }
  
};
const renderQuestionPaperList = (questions, setReloadPage) => {
  if (questions.length !== 0 && questions !== "unset") {
    return (
      <ul>
        {questions.map(question => (
          <QuestionPaperCard
            question={question}
            key={question._id}
            setReloadPage={setReloadPage}
          />
        ))}
      </ul>
    );
  }
};
const QuestionPaperCard = ({ question, setReloadPage }) => {
  const dispatch = useDispatch();
  return (
    <div
      className="card bg-light p-2 mr-4 mb-2 text-dark"
      to={`/admin/editPaper/${question._id}`}
    >
      <h5>{question.title}</h5>
      <small>Created at {new Date(question.created_at).toLocaleString()}</small>
      {!question.isCompleted && (
        <strong className="text-danger">
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
              <button
                className="btn btn-lg btn-success"
                onClick={async () => {
                  await axios.delete("/api/admin/deletePaper", {
                    data: {
                      id: question._id
                    }
                  });
                  setReloadPage(Math.random);
                  setTimeout(
                    () => flashMessage(dispatch, "Question paper deleted"),
                    500
                  );
                }}
              >
                Yes
              </button>
              <button className="btn btn-lg btn-danger ml-2">No</button>
            </div>
          }
        />
      </div>
    </div>
  );
};
export default AdminHome;
