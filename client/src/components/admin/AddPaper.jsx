import React from 'react';
import PaperForm from "./PaperForm";
//function for inital state of questions
const AddPaper= ()=>{
  return <PaperForm initialQuestions={getQuestionsObj()} type="add"/>;
}

const getQuestionsObj = () => {
  const questions = {};
  for (let i = 1; i <= 100; i++) {
    questions[i] = { options: {} };
  }
  return questions;
};
export default AddPaper;