import React from "react";
import QuestionForm from "../QuestionForm";
const allQuestionForms = (
  questions,
  addQuestion,
  setQuestionNum,
  setQuestions
) => {
  const comps = [];
  for (let qn = 1; qn <= 100; qn++) {
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
