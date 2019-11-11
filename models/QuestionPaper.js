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
  }
});
const QuestionPaper = mongoose.model("questionPaper", questionPaperSchema);
module.exports = QuestionPaper;
