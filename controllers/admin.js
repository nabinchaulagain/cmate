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
const PaperReport = require("../models/QuestionPaperReport");
const mongoose = require("mongoose");
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

//GET => admin/getReports
const getAllReports = async (req, res) => {
  const allReports = await PaperReport.find().populate(
    "questionPaper",
    "title"
  );
  const reports = {};
  let totalReports = 0;
  allReports.forEach(report => {
    totalReports++;
    const currentReport = {
      reporter: report.reporter,
      description: report.description
    };
    const paperId = report.questionPaper._id;
    const questionNum = report.questionNum;
    if (reports[paperId]) {
      if (reports[paperId][questionNum]) {
        reports[paperId][questionNum].push(currentReport);
      } else {
        reports[paperId][questionNum] = [currentReport];
      }
    } else {
      reports[paperId] = {
        [report.questionNum]: [currentReport],
        title: report.questionPaper.title
      };
    }
  });

  res.json({ reports, totalReports });
};

//GET => admin/getReports/:paperId?questionNum
const getReportsInQuestion = async (req, res) => {
  if (req.query.questionNum <= 0 || req.query.questionNum >= 101) {
    return res.status(400).send("question number bad");
  }
  const findCriteria = {
    questionPaper: mongoose.Types.ObjectId(req.params.paperId),
    questionNum: req.query.questionNum
  };
  const allReports = await PaperReport.find(findCriteria);
  const quiz = await QuestionPaper.findById(req.params.paperId);
  const questionPath = path.join(
    process.cwd(),
    "resources",
    "questionPapers",
    `${req.params.paperId}.json`
  );
  if (!fs.existsSync(questionPath)) {
    return res.status(404).send("Question paper not found.");
  }
  const reports = [];
  allReports.forEach(report => {
    reports.push({
      id: report._id,
      reporter: report.reporter,
      description: report.description
    });
  });
  const questionData = JSON.parse(fs.readFileSync(questionPath).toString());
  const question = questionData[req.query.questionNum];
  res.json({ reports, initialValues: question, title: quiz.title });
};

//POST => /admin/resolveReports:paperId?questionNum=
const resolveReports = async (req, res) => {
  if (req.query.questionNum <= 0 || req.query.questionNum >= 101) {
    return res.status(400).send("question number bad");
  }
  if (!req.body.question) {
    return res.status(400).send("Question is needed");
  }
  const recievedQuestion = JSON.parse(req.body.question);
  if (!validateQuestion(recievedQuestion)) {
    return res.status(400).send("Wrong question format");
  }
  const findCriteria = {
    questionPaper: mongoose.Types.ObjectId(req.params.paperId),
    questionNum: req.query.questionNum
  };
  const allReports = await PaperReport.find(findCriteria);
  if (allReports.length === 0) {
    return res.status(400).send("Report not found");
  }
  const quiz = await QuestionPaper.findById(req.params.paperId);
  const questionPaperPath = path.join(
    process.cwd(),
    "resources",
    "questionPapers",
    `${req.params.paperId}.json`
  );
  if (!quiz || !fs.existsSync(questionPaperPath)) {
    return res.status(404).send("Not found");
  }
  const questionPaper = JSON.parse(
    fs.readFileSync(questionPaperPath).toString()
  );
  const newQuestion = { ...recievedQuestion };
  req.files.forEach(uploadedFile => {
    if (uploadedFile.fieldname.includes("directionImage")) {
      const endNum = /directionImage_to_(\d+)/g.exec(uploadedFile.fieldname)[1];
      newQuestion.directionImage = {
        url: uploadedFile.filename,
        ending: parseInt(endNum)
      };
    } else {
      newQuestion.image = uploadedFile.filename;
    }
  });
  questionPaper[req.query.questionNum] = newQuestion;
  deleteUpdatedPicsInPaper(questionPaperPath, questionPaper);
  fs.writeFile(questionPaperPath, JSON.stringify(questionPaper), err => {});
  const clientPaper = getFinalClientPaper(questionPaper);
  const clientQuestionPath = path.join(
    process.cwd(),
    "resources",
    "questionPapers",
    "client",
    `${quiz._id}.question.json`
  );
  const clientAnswerPath = path.join(
    process.cwd(),
    "resources",
    "questionPapers",
    "client",
    `${quiz._id}.answer.json`
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
  await PaperReport.deleteMany(findCriteria);
  res.send("done");
};

module.exports = {
  uploadPaper,
  uploadAnswer,
  savePaper,
  deletePaper,
  editPaper,
  getPaper,
  getPapers,
  getAllReports,
  getReportsInQuestion,
  resolveReports
};
