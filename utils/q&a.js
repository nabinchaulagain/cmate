const assignAnswers = (questions, answers) => {
  for (section in questions) {
    // i refers to question num [1-100]
    for (i in questions[section].questions) {
      if (questions[section].questions[i] === "missing") {
        questions[section].questions[i] = {
          question: questions[section].questions[i],
          correctAnswer: answers[i]
        };
      } else {
        questions[section].questions[i].correctAnswer = answers[i];
      }
    }
  }
};
module.exports = { assignAnswers };
