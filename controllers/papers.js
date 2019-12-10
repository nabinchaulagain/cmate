const QuestionPaper = require("../models/QuestionPaper");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
//Controller for GET => /getPapers
const getPapers = async (req, res) => {
  const papers = await QuestionPaper.find({ isComplete: true });
  res.json(papers);
};

// Controller for GET=> /getPaper/:id
const getPaper = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Id is needed");
  }
  const paper = await QuestionPaper.findOne({
    _id: mongoose.Types.ObjectId(req.params.id),
    isComplete: true
  });
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

module.exports = { getPapers, getPaper };
