const {
  extractQuestionPaper,
  getPDFText,
  extractAnswerSheet
} = require("../utils/pdf");
const fs = require("fs");
const QuestionPaper = require("../models/QuestionPaper");
const path = require("path");
const { assignAnswers } = require("../utils/q&a");
// controller for POST=> /admin/uploadPaper
const uploadPaper = async (req, res) => {
  if (req.file) {
    //get raw text
    const rawText = await getPDFText(req.file.buffer);
    //get json format of question paper and send it
    const qp = extractQuestionPaper(rawText);
    res.json(qp);
  } else {
    res.status(400).send("question paper(pdf) must be sent");
  }
};

//Controller for POST=> /admin/uploadAnswer
const uploadAnswer = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("answer paper(pdf) must be sent");
  }
  const rawText = await getPDFText(req.file.buffer);
  const answerSheet = extractAnswerSheet(rawText);
  res.json(answerSheet);
};

//controller for POST => /admin/savePaper
const savePaper = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).send("Title Is needed");
    }
    if (!req.body.questions) {
      return res.status(400).send("Questions Are needed");
    }
    const questionPaper = new QuestionPaper({ title: req.body.title });
    const savedPaper = await questionPaper.save();
    const recievedPaper = JSON.parse(req.body.questions);
    const questionPaperObj = {};
    const imagesInQuestionPaper = [];
    req.files.forEach(file => {
      //get qn
      const questionNum = file.fieldname.split(".")[1];
      const fileName = file.filename;
      imagesInQuestionPaper.push({ fileName, questionNum });
    });
    for (let i = 1; i <= 100; i++) {
      const imageInQn = imagesInQuestionPaper.find(
        image => parseInt(image.questionNum) === i
      );
      if (imageInQn) {
        questionPaperObj[i] = {
          ...recievedPaper[i],
          image: imageInQn.fileName
        };
        continue;
      }
      questionPaperObj[i] = recievedPaper[i];
    }
    fs.writeFile(
      path.join(
        process.cwd(),
        "resources",
        "questionPapers",
        `${savedPaper._id}.json`
      ),
      JSON.stringify(questionPaperObj),
      err => {}
    );
    res.status(200).send(questionPaperObj);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

//controller for POST => /admin/saveAnswer
const saveAnswer = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send("Id needed");
    }
    if (!req.body.answerSheet) {
      return res.status(400).send("Answer sheet is needed");
    }
    const existingPaper = await QuestionPaper.findById(req.params.id);
    if (!existingPaper) {
      return res.status(404).send("Question Paper not found");
    }
    //get json file
    const jsonString = fs
      .readFileSync(
        path.join(
          process.cwd(),
          "resources",
          "questionPapers",
          `${existingPaper._id}.json`
        )
      )
      .toString("utf-8");
    let questionPaper = JSON.parse(jsonString);
    assignAnswers(questionPaper, req.body.answerSheet);
    fs.writeFileSync(
      path.join(
        process.cwd(),
        "resources",
        "questionPapers",
        `${existingPaper._id}.json`
      ),
      JSON.stringify(questionPaper)
    );
    res.status(200).send("done");
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
module.exports = { uploadPaper, uploadAnswer, savePaper, saveAnswer };
