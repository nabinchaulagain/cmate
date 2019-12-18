const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizResultSchema = new Schema({
  user: { type: Object },
  questionPaperId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "questionPaper"
  },
  timeRemaining: Number,
  answers: { type: Object, required: true },
  performance: {
    notAttempted: { required: true, type: Number },
    wrongAnswers: { required: true, type: Number },
    rightAnswers: { required: true, type: Number }
  }
});

const QuizResult = mongoose.model("quizresult", quizResultSchema);
module.exports = QuizResult;
