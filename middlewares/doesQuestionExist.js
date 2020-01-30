const DiscussionQuestion = require("../models/DiscussionQuestion");
const mongoose = require("mongoose");
const doesQuestionExist = (req, res, next) => {
  const question = DiscussionQuestion.findOne({
    _id: mongoose.Types.ObjectId(req.params.questionId)
  });
  if (!question) {
    return res.status(404).send("Question doesn't exist");
  }
  next();
};

module.exports = doesQuestionExist;
