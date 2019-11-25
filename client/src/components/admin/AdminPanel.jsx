import React,{useState,useEffect,useRef} from "react";
import Sidebar from "./Sidebar";
import "./Admin.css";
import axios from "axios";
import Modal from "../extras/Modal"
const AdminHome = () => {
  const [questions,setQuestions] = useState("unset");
  useEffect(()=>{
    const getAndSetQuestions=async()=>{
      const response = await axios.get("/api/admin/getPapers");
      setQuestions(response.data);
    }
    getAndSetQuestions()
  },[])
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

const renderQuestionPaperList =(questions)=>{
  if(questions.length !==0 && questions !== "unset"){
    return (
      <ul>
        {questions.map((question)=><QuestionPaperCard question={question} key={question._id}/>)}
      </ul>
    )
  }
}
const QuestionPaperCard= ({question})=>{
  const noBtnRef= useRef(null);
  return(
    <div className="card bg-light p-2 mr-4 mb-2 text-dark" to={`/admin/editPaper/${question._id}`}>
      <h5>{question.title}</h5>
      <small>Created at {new Date(question.created_at).toLocaleString()}</small>
      {!question.isCompleted && <strong className="text-danger"> {question.incompletes} incompete questions</strong>}
      <div className="text-center">
        <Modal 
        openButton={{className:"btn btn-sm btn-danger",text:"Delete Question paper"}} 
        modalHeading={`Delete ${question.title}?`} 
        modalBody={
          <div>
            <button className="btn btn-md btn-success">Yes</button>
            <button className="btn btn-md btn-danger ml-2" ref={noBtnRef}>No</button>
          </div>
        }
        closeElemRef={noBtnRef}
        />
      </div>
    </div>
  )
}

export default AdminHome;
