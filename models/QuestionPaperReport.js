const mongoose = require("mongoose");
const userMinObj = {
  name: String,
  profilePic: String,
  id: mongoose.Types.ObjectId
};
const questionPaperReportSchema = new mongoose.Schema({
  questionNum: { type: Number, min: 1, max: 100, required: true },
  questionPaper: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "questionPaper"
  },
  description: { type: String },
  reporter: userMinObj,
  reported_at: { type: Date, default: Date.now }
});

const QuestionPaperReport = mongoose.model(
  "questionPaperReports",
  questionPaperReportSchema
);

module.exports = QuestionPaperReport;
