const QuestionPaper = require("../models/QuestionPaper");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const QuizResults = require("../models/QuizResults");
//Controller for GET => /getPapers
const getPapers = async (req, res) => {
  const papers = await QuestionPaper.find({ isCompleted: true }).sort(
    "-created_at"
  );
  res.json(papers);
};

// Controller for GET=> /getPaper/:id
const getPaper = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Id is needed");
  }
  let paper;
  try {
    paper = await QuestionPaper.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
      isCompleted: true
    });
  } catch (err) {
    return res.status(404).send("Not found");
  }
  if (!paper) {
    return res.status(404).send("Not found");
  }
  const filePath = path.join(
    process.cwd(),
    "resources",
    "questionPapers",
    "client",
    `${paper._id}.question.json`
  );
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath).toString();
    return res.json({ questions: JSON.parse(fileData), title: paper.title });
  }
  res.status(404).send("not found");
};

// Controller for GET =>/getAnswer/:id
const getAnswer = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Id is needed");
  }
  let paper;
  try {
    paper = await QuestionPaper.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
      isCompleted: true
    });
  } catch (err) {
    return res.status(404).send("Not found");
  }
  if (!paper) {
    return res.status(404).send("Not found");
  }
  const filePath = path.join(
    process.cwd(),
    "resources",
    "questionPapers",
    "client",
    `${paper._id}.answer.json`
  );
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath).toString();
    return res.json(JSON.parse(fileData));
  }
};

// Controller for POST => /saveQuizResult
const saveQuizResult = async (req, res) => {
  try {
    if (
      !req.body.timeRemaining ||
      !req.body.answers ||
      !req.body.questionPaperId
    ) {
      return res.status(400).send("Body incomplete");
    }
    const questionPaper = await QuestionPaper.findOne({
      _id: new mongoose.Types.ObjectId(req.body.questionPaperId),
      isCompleted: true
    });
    if (!questionPaper) {
      res.status(404).send("Paper not found");
    }
    let notAttempted = 0;
    let wrongAnswers = 0;
    let rightAnswers = 0;
    const recievedAnswers = req.body.answers;
    const answers = {};
    const answerPath = path.join(
      process.cwd(),
      "resources",
      "questionPapers",
      "client",
      `${questionPaper._id}.answer.json`
    );
    const existingResult = await QuizResults.findOne({
      questionPaperId: new mongoose.Types.ObjectId(questionPaper._id),
      "user._id": new mongoose.Types.ObjectId(req.user._id)
    });
    if (existingResult) {
      await existingResult.remove();
    }
    const correctAnswers = JSON.parse(fs.readFileSync(answerPath).toString());
    for (let i = 1; i <= 100; i++) {
      answers[i] = { answered: recievedAnswers[i], correct: correctAnswers[i] };
      if (!recievedAnswers[i]) {
        notAttempted++;
        continue;
      }
      if (recievedAnswers[i] !== correctAnswers[i]) {
        wrongAnswers++;
        continue;
      }
      rightAnswers++;
    }
    const newResult = new QuizResults({
      user: req.user,
      questionPaperId: questionPaper._id,
      performance: { notAttempted, wrongAnswers, rightAnswers },
      timeRemaining: req.body.timeRemaining,
      answers
    });
    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

//GET => /getQuizResult?resultId
const getQuizResult = async (req, res) => {
  const questionPaperId = req.query.qpId;
  if (!questionPaperId) {
    return res.status(400).send("Missing params");
  }
  try {
    const result = await QuizResults.findOne({
      questionPaperId: new mongoose.Types.ObjectId(questionPaperId),
      "user._id": new mongoose.Types.ObjectId(req.user._id)
    });
    if (!result) {
      return res.status(404).send("Result not found");
    }
    if (result.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).send("Unauthorized");
    }
    res.json(result);
  } catch (err) {
    res.status(404).send("Result not found");
  }
};
module.exports = {
  getPapers,
  getPaper,
  saveQuizResult,
  getQuizResult,
  getAnswer
};
