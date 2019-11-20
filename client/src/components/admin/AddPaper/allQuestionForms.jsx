import React from "react";
import QuestionForm from "./QuestionForm";
const allQuestionForms = (
  questions,
  addQuestion,
  setQuestionNum,
  setQuestions
) => {
  const comps = [];
  for (let qn = 1; qn <= 100; qn++) {
    //push a different question form component to the array 100 times for 100 questions
    comps.push(
      <QuestionForm
        questionNum={qn}
        addQuestion={addQuestion}
        initialValues={questions[qn]}
        key={qn}
        goToNext={() => {
          setQuestionNum(qn + 1);
        }}
        setImageInState={image => {
          setQuestions({ ...questions, [qn]: { image, ...questions[qn] } });
        }}
      />
    );
  }
  return comps;
};
export default allQuestionForms;
