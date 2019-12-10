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
  const directionImagesInQuestionPaper = [];
  let incompleteQuestions = 0;
  files.forEach(file => {
    //get qn of images
    console.log(file.fieldname);
    if (file.fieldname.includes("directionImage")) {
      const [, questionNum, endingNum] = file.fieldname.split(".");
      directionImagesInQuestionPaper.push({
        questionNum,
        endingNum,
        fileName: file.filename
      });
    } else {
      const questionNum = file.fieldname.split(".")[1];
      const fileName = file.filename;
      imagesInQuestionPaper.push({ fileName, questionNum });
    }
  });
  for (let i = 1; i <= 100; i++) {
    const singleQuestion = { ...recievedPaper[i] };
    //loop through questions
    if (!validateQuestion(recievedPaper[i])) {
      incompleteQuestions++;
    }
    const imageInQn = imagesInQuestionPaper.find(
      image => parseInt(image.questionNum) === i
    );
    const directionImageInQn = directionImagesInQuestionPaper.find(
      directionImage => parseInt(directionImage.questionNum) === i
    );
    // add image if image is in question
    if (imageInQn) {
      singleQuestion.image = imageInQn.fileName;
    }
    if (directionImageInQn) {
      singleQuestion.directionImage = {
        url: directionImageInQn.fileName,
        ending: parseInt(directionImageInQn.endingNum)
      };
    }
    if (recievedPaper[i].question === "noneed") {
      singleQuestion.question = "";
    }
    questionPaperObj[i] = singleQuestion;
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
    if (
      oldFileData[i].directionImage &&
      (!newFileData[i].directionImage ||
        oldFileData[i].directionImage.url !== newFileData[i].directionImage.url)
    ) {
      const imageLocation = path.join(
        process.cwd(),
        "resources",
        "images",
        oldFileData[i].directionImage.url
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
    if (fileData[i].directionImage) {
      const imageLocation = path.join(
        process.cwd(),
        "resources",
        "images",
        fileData[i].directionImage.url
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
