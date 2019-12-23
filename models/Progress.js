const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const progressSchema = new Schema({
  user: { type: Object },
  questionPaperId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "questionPaper"
  },
  timeRemaining: Number,
  answers: { type: Object, required: true }
});

const Progress = mongoose.model("progress", progressSchema);
module.exports = Progress;
