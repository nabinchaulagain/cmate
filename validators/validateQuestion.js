const validateQuestion = question => {
  if (!question.options || !question.question || !question.correctOption) {
    return false;
  }
  for (opts of ["a", "b", "c", "d"]) {
    if (!question.options[opts]) {
      return false;
    }
  }
  return true;
};
module.exports = validateQuestion;
