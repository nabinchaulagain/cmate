const QuestionPaper = require("../models/QuestionPaper");
const fs = require("fs");
const FilePath = require("../utils/filePaths");
const mongoose = require("mongoose");
const QuizResults = require("../models/QuizResults");
const QuizProgress = require("../models/Progress");
const PaperReport = require("../models/QuestionPaperReport");

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
  const filePath = FilePath.clientQuestionPath(paper._id);
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath).toString();
    const response = { questions: JSON.parse(fileData), title: paper.title };
    return res.json(response);
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
  const filePath = FilePath.clientAnswerPath(paper._id);
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath).toString();
    return res.json(JSON.parse(fileData));
  }
};

// Controller for POST => /saveQuizResult
const saveQuizResult = async (req, res) => {
  try {
    if (
      req.body.timeRemaining === null ||
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
    const answerPath = FilePath.clientAnswerPath(questionPaper._id);
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
    try {
      await QuizProgress.findOneAndDelete({
        "user._id": req.user._id,
        questionPaperId: questionPaper._id
      });
    } catch (err) {}
    res.status(201).json(savedResult);
  } catch (err) {
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

// controller for PUT => /saveQuizProgress
const saveQuizProgress = async (req, res) => {
  const { timeRemaining, answers, questionPaperId } = req.body;
  if (!timeRemaining || !answers || !questionPaperId) {
    return res.status(400).send("Incomplete body");
  }
  const previousProgress = await QuizProgress.findOne({
    "user._id": new mongoose.Types.ObjectId(req.user._id),
    questionPaperId: new mongoose.Types.ObjectId(questionPaperId)
  });
  if (previousProgress) {
    await previousProgress.remove();
  }
  const newProgress = new QuizProgress({
    user: req.user,
    questionPaperId,
    answers,
    timeRemaining
  });
  res.json(await newProgress.save());
};

// controller for GET => /getQuizProgress?paperId
const getQuizProgress = async (req, res) => {
  try {
    const previousProgress = await QuizProgress.findOne({
      questionPaperId: new mongoose.Types.ObjectId(req.query.paperId),
      "user._id": new mongoose.Types.ObjectId(req.user._id)
    });
    if (previousProgress) {
      const response = {
        answers: previousProgress.answers,
        timeRemaining: previousProgress.timeRemaining
      };
      return res.send(response);
    }
    res.status(404).send("Paper not found");
  } catch (err) {
    res.status(404).send("Not found");
  }
};

// controller for DELETE => /deleteQuizProgress?paperId
const deleteQuizProgress = async (req, res) => {
  try {
    const previousProgress = await QuizProgress.findOne({
      questionPaperId: new mongoose.Types.ObjectId(req.query.paperId),
      "user._id": new mongoose.Types.ObjectId(req.user._id)
    });
    if (!previousProgress) {
      return res.status(400).send("Bad");
    }
    await previousProgress.remove();
    res.send("done");
  } catch (err) {
    res.status(404).send("Not found");
  }
};

// Controller for POST => /report/:paperId?questionNum
const reportQuestion = async (req, res) => {
  const questionNum = parseInt(req.query.questionNum);
  if (!questionNum) {
    return res.status(400).send("question num is required");
  }
  if (questionNum <= 0 || questionNum >= 101) {
    return res.status(400).send("qn not in range");
  }
  if (!req.body.description) {
    return res.status(400).send("Description is missing");
  }
  const quiz = await QuestionPaper.findOne({
    isCompleted: true,
    _id: mongoose.Types.ObjectId(req.params.paperId)
  });
  if (!quiz) {
    return res.status(404).send("Question Paper not found");
  }
  const existingReport = await PaperReport.findOne({
    "reporter.id": req.user._id,
    questionPaper: quiz._id,
    questionNum
  });
  if (existingReport) {
    return res.status(429).send("Already reported");
  }
  const newReport = await PaperReport.create({
    questionNum,
    questionPaper: quiz._id,
    description: req.body.description,
    reporter: {
      name: req.user.name,
      profilePic: req.user.profilePic,
      id: req.user._id
    }
  });
  res.send(newReport);
};

module.exports = {
  getPapers,
  getPaper,
  saveQuizResult,
  getQuizResult,
  getAnswer,
  saveQuizProgress,
  deleteQuizProgress,
  getQuizProgress,
  reportQuestion
};
