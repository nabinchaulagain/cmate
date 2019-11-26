const validateQuestion = require("../validators/validateQuestion");
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

const getFinalQuestionsObj = (files, recievedPaper) => {
  const questionPaperObj = {};
  const imagesInQuestionPaper = [];
  let incompleteQuestions = 0;
  files.forEach(file => {
    //get qn of images
    const questionNum = file.fieldname.split(".")[1];
    const fileName = file.filename;
    imagesInQuestionPaper.push({ fileName, questionNum });
  });
  for (let i = 1; i <= 100; i++) {
    //loop through questions
    if (!validateQuestion(recievedPaper[i])) {
      incompleteQuestions++;
    }
    const imageInQn = imagesInQuestionPaper.find(
      image => parseInt(image.questionNum) === i
    );
    // add image if image is in question
    if (imageInQn) {
      questionPaperObj[i] = {
        ...recievedPaper[i],
        image: imageInQn.fileName
      };
      continue;
    }
    if (recievedPaper[i].question === "missing") {
      questionPaperObj[i] = {
        options: recievedPaper[i].options,
        direction: recievedPaper[i].direction,
        question: "",
        correctOption: recievedPaper[i].correctOption
      };
      continue;
    }
    questionPaperObj[i] = recievedPaper[i];
  }
  console.log(incompleteQuestions);
  const isCompleted = incompleteQuestions === 0;
  return { questionPaperObj, isCompleted, incompleteQuestions };
};
module.exports = { assignAnswers, getFinalQuestionsObj };
