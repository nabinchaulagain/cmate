const validateQuestion = require("../validators/validateQuestion");
const fs = require("fs");
const path = require("path");
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
  const isCompleted = incompleteQuestions === 0;
  return { questionPaperObj, isCompleted, incompleteQuestions };
};

const deleteUpdatedPicsInPaper = (fileName, newFileData) => {
  const oldFileData = JSON.parse(fs.readFileSync(fileName).toString());
  for (let i = 1; i <= 100; i++) {
    if (oldFileData[i].image !== newFileData[i].image && oldFileData[i].image) {
      const imageLocation = path.join(
        process.cwd(),
        "resources",
        "images",
        oldFileData[i].image
      );
      fs.unlink(imageLocation, () => {});
    }
  }
};

const deleteAllImagesInPaper = fileName => {
  const fileData = JSON.parse(fs.readFileSync(fileName).toString());
  for (let i = 1; i <= 100; i++) {
    if (fileData[i].image) {
      const imageLocation = path.join(
        process.cwd(),
        "resources",
        "images",
        fileData[i].image
      );
      fs.unlink(imageLocation, () => {});
    }
  }
};
module.exports = {
  assignAnswers,
  getFinalQuestionsObj,
  deleteUpdatedPicsInPaper,
  deleteAllImagesInPaper
};
