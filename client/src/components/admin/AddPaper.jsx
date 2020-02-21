import React from "react";
import PaperForm from "./PaperForm";
import { Helmet } from "react-helmet";

const AddPaper = () => {
  return (
    <React.Fragment>
      <Helmet>
        <title>Add a paper - Cmate</title>
        <meta name="description" content="Cmate Homepage" />
      </Helmet>
      <PaperForm initialQuestions={getQuestionsObj()} type="add" />
    </React.Fragment>
  );
};

const getQuestionsObj = () => {
  const questions = {};
  for (let i = 1; i <= 100; i++) {
    questions[i] = { options: {} };
  }
  return questions;
};
export default AddPaper;
