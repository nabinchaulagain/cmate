import React from "react";
const sections = [
  "Section I: Verbal Ability",
  "Section II: Quantitative Analysis",
  "Section III: Logical Reasoning",
  "Section IV: General Awareness"
];
const QuizSection = ({ questionNum }) => {
  return (
    <h5 className="text-center">{sections[Math.ceil(questionNum / 25) - 1]}</h5>
  );
};

export default QuizSection;
