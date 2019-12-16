const QuestionPaper = require("../models/QuestionPaper");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
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
    `${paper._id}.json`
  );
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath).toString();
    return res.json({ questions: JSON.parse(fileData), title: paper.title });
  }
  res.status(404).send("not found");
};

module.exports = { getPapers, getPaper };
