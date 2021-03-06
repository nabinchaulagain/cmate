const DiscussionQuestion = require("../models/DiscussionQuestion");
const { deletePics } = require("../utils/discussions");
// Controller for POST=> /discussions
const addQuestion = async (req, res) => {
  const newQuestion = new DiscussionQuestion({
    question: req.body.question,
    description: req.body.description,
    user: req.user
  });
  if (req.fileUploadError) {
    return res.status(400).send(req.fileUploadError);
  }
  if (req.files.images) {
    newQuestion.images = req.files.images.map(image => {
      return image.filename;
    });
  }
  const savedQuestion = await newQuestion.save();
  res.send(savedQuestion);
};

// Controller for GET=> /discussions
const getQuestions = async (req, res) => {
  let pageNum = 1;
  if (req.query.pageNum) {
    pageNum = parseInt(req.query.pageNum);
  }
  const questionsPerPage = 5;
  const allQuestions = await DiscussionQuestion.find().sort("-created_at");
  const questions = allQuestions.slice(
    (pageNum - 1) * questionsPerPage,
    pageNum * questionsPerPage
  );
  const nextPage =
    allQuestions.length > pageNum * questionsPerPage ? pageNum + 1 : null;
  res.send({ questions, nextPage });
};

// Controller for GET=> /discussions/:id
const getQuestion = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("missing id");
  }
  let question;
  try {
    question = await DiscussionQuestion.findById(req.params.id);
  } catch (err) {
    return res.status(404).send("Not found");
  }
  if (!question) {
    return res.status(404).send("Question not found");
  }
  res.send(question);
};

// Controller for PATCH=> /disccusions/:id
const editQuestion = async (req, res) => {
  if (!req.params.id || !req.body.question || !req.body.description) {
    return res.status(400).send("missing body or params");
  }
  let question;
  try {
    question = await DiscussionQuestion.findById(req.params.id);
  } catch (err) {
    return res.status(404).send("Not found");
  }
  if (!question) {
    return res.status(404).send("Question not found");
  }
  if (question.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).send("Unauthorized");
  }
  if (req.fileUploadError) {
    return res.status(400).send(req.fileUploadError);
  }
  if (req.files.images) {
    deletePics(...question.images);
    question.images = req.files.images.map(image => {
      return image.filename;
    });
  }
  question.question = req.body.question;
  question.description = req.body.description;
  const editedQuestion = await question.save();
  res.send(editedQuestion);
};

// Controller for DELETE => /discussions/:id
const deleteQuestion = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("missing id");
  }
  let question;
  try {
    question = await DiscussionQuestion.findById(req.params.id);
  } catch (err) {
    return res.status(404).send("Not found");
  }
  if (!question) {
    return res.status(404).send("Question not found");
  }
  if (question.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).send("Unauthorized");
  }
  await question.remove();
  res.send("done");
};

// Controller for PUT => /discussions/:questionId/vote
const vote = async (req, res) => {
  const question = await DiscussionQuestion.findById(req.params.questionId);
  const vote = req.body.vote;
  if (!question) {
    return res.status(404).send("Not found");
  }
  const voteIndex = question.votes.findIndex(
    vote => vote.userId.toString() === req.user._id.toString()
  );
  const hasUserVoted = voteIndex !== -1;
  if (hasUserVoted) {
    question.votes.splice(voteIndex, 1);
  }
  if (vote !== undefined || vote !== null) {
    question.votes.push({ userId: req.user._id, vote: Number(vote) });
  }
  question.save();
  res.json(question.votes);
};

module.exports = {
  addQuestion,
  getQuestions,
  getQuestion,
  editQuestion,
  deleteQuestion,
  vote
};
