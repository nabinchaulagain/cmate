const {
  extractQuestionPaper,
  getPDFText,
  extractAnswerSheet
} = require("../utils/pdf");
const {
  getFinalQuestionsObj,
  deleteUpdatedPicsInPaper,
  deleteAllImagesInPaper,
  getFinalClientPaper
} = require("../utils/q&a");
const fs = require("fs");
const QuestionPaper = require("../models/QuestionPaper");
const path = require("path");
// controller for POST=> /admin/uploadPaper
const uploadPaper = async (req, res) => {
  try {
    if (req.file) {
      //get raw text
      const rawText = await getPDFText(req.file.buffer);
      fs.writeFile("./info.txt", rawText, () => {});
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
    const recievedPaper = JSON.parse(req.body.questions);
    const {
      incompleteQuestions,
      isCompleted,
      questionPaperObj
    } = getFinalQuestionsObj(req.files, recievedPaper);
    questionPaper.incompletes = incompleteQuestions;
    questionPaper.isCompleted = isCompleted;
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
    if (isCompleted) {
      const clientPaper = getFinalClientPaper(questionPaperObj);
      const clientQuestionPath = path.join(
        process.cwd(),
        "resources",
        "questionPapers",
        "client",
        `${savedPaper._id}.question.json`
      );
      const clientAnswerPath = path.join(
        process.cwd(),
        "resources",
        "questionPapers",
        "client",
        `${savedPaper._id}.answer.json`
      );
      fs.writeFile(
        clientFilePath,
        JSON.stringify(clientPaper.questions),
        err => {}
      );
      fs.writeFile(
        clientAnswerPath,
        JSON.stringify(clientPaper.answers),
        err => {}
      );
    }
    res.status(200).send("Done");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};

// DELETE=>/admin/deletePaper
const deletePaper = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).send("Id is needed");
  }
  const paper = await QuestionPaper.findById(req.body.id);
  if (!paper) {
    return res.status(404).send("Paper not found");
  }
  const filePath = path.join(
    process.cwd(),
    "resources",
    "questionPapers",
    `${paper._id}.json`
  );
  const clientQuestionPath = path.join(
    process.cwd(),
    "resources",
    "questionPapers",
    "client",
    `${paper._id}.question.json`
  );
  const clientAnswerPath = path.join(
    process.cwd(),
    "resources",
    "questionPapers",
    "client",
    `${paper._id}.answer.json`
  );
  await paper.remove();
  deleteAllImagesInPaper(filePath);
  fs.unlink(filePath, err => {});
  fs.unlink(clientQuestionPath, err => {});
  fs.unlink(clientAnswerPath, err => {});
  res.status(200).send(await QuestionPaper.find().sort("-created_at"));
};

//controller for PATCH => /admin/editPaper
const editPaper = async (req, res) => {
  try {
    if (!req.body.questions) {
      res.status(400).send("question are needed");
    }
    if (!req.body.id) {
      res.status(400).send("Id is needed");
    }
    const paper = await QuestionPaper.findById(req.body.id);
    if (!paper) {
      res.status(404).send("Paper not found");
    }
    const recievedPaper = JSON.parse(req.body.questions);
    const {
      incompleteQuestions,
      isCompleted,
      questionPaperObj
    } = getFinalQuestionsObj(req.files, recievedPaper);
    paper.incompletes = incompleteQuestions;
    paper.isCompleted = isCompleted;
    await paper.save();
    const filePath = path.join(
      process.cwd(),
      "resources",
      "questionPapers",
      `${paper._id}.json`
    );
    deleteUpdatedPicsInPaper(filePath, questionPaperObj);
    fs.writeFile(filePath, JSON.stringify(questionPaperObj), err => {});
    if (isCompleted) {
      const clientPaper = getFinalClientPaper(questionPaperObj);
      const clientQuestionPath = path.join(
        process.cwd(),
        "resources",
        "questionPapers",
        "client",
        `${paper._id}.question.json`
      );
      const clientAnswerPath = path.join(
        process.cwd(),
        "resources",
        "questionPapers",
        "client",
        `${paper._id}.answer.json`
      );
      fs.writeFile(
        clientQuestionPath,
        JSON.stringify(clientPaper.questions),
        err => {}
      );
      fs.writeFile(
        clientAnswerPath,
        JSON.stringify(clientPaper.answers),
        err => {}
      );
    }
    res.status(200).send("done");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

//GET => /admin/getPapers
const getPapers = async (req, res) => {
  const papers = await QuestionPaper.find().sort("-created_at");
  res.json(papers);
};

//GET => admin/getPaper/{id}
const getPaper = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Id is needed");
  }
  const paper = await QuestionPaper.findById(req.params.id);
  if (!paper) {
    return res.status(404).send("Not found");
  }
  const filePath = path.join(
    process.cwd(),
    "resources",
    "questionPapers",
    `${paper._id}.json`
  );
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath).toString();
    return res.json(JSON.parse(fileData));
  }
  res.status(404).send("not found");
};

module.exports = {
  uploadPaper,
  uploadAnswer,
  savePaper,
  deletePaper,
  editPaper,
  getPaper,
  getPapers
};
