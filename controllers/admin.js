const {
  extractQuestionPaper,
  getPDFText,
  extractAnswerSheet
} = require("../utils/pdf");
const fs = require("fs");
const QuestionPaper = require("../models/QuestionPaper");
const path = require("path");
const { assignAnswers } = require("../utils/q&a");
const validateQuestion = require("../validators/validateQuestion");
// controller for POST=> /admin/uploadPaper
const uploadPaper = async (req, res) => {
  try {
    if (req.file) {
      //get raw text
      const rawText = await getPDFText(req.file.buffer);
      //get json format of question paper and send it
      const qp = extractQuestionPaper(rawText);
      res.json(qp);
    } else {
      res.status(400).send("question paper(pdf) must be sent");
    }
  } catch (err) {
    res.status(500).send("Incorrect format ");
  }
};

//Controller for POST=> /admin/uploadAnswer
const uploadAnswer = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("answer paper(pdf) must be sent");
    }
    const rawText = await getPDFText(req.file.buffer);
    const answerSheet = extractAnswerSheet(rawText);
    res.json(answerSheet);
  } catch (err) {
    res.status(500).send("Incorrect format ");
  }
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
    fs.writeFile("./ss.json", req.body.questions, err => {});
    const recievedPaper = JSON.parse(req.body.questions);
    const questionPaperObj = {};
    const imagesInQuestionPaper = [];
    let incompleteQuestions = 0;
    req.files.forEach(file => {
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
        console.log("missing paper");
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
    questionPaper.incompletes = incompleteQuestions;
    questionPaper.isCompleted = incompleteQuestions === 0;
    const savedPaper = await questionPaper.save();
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

//Controller for GET => /admin/getPapers
const getPapers= async (req,res)=>{
  const papers= await QuestionPaper.find();
  res.json(papers);
}
module.exports = { uploadPaper, uploadAnswer, savePaper, saveAnswer,getPapers };
