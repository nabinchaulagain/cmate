const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const questionPaperSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  created_at: {
    type: Number,
    default: Date.now()
  },
  isCompleted: {
    type: Boolean,
    required: true
  },
  incompletes: {
    type: Number,
    required: true
  }
});
const QuestionPaper = mongoose.model("questionPaper", questionPaperSchema);
module.exports = QuestionPaper;
