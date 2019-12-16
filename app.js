const mongoose = require("mongoose");
const QuestionPaper = require("./models/QuestionPaper");
mongoose
  .connect("mongodb+srv://nabin1:pword@cluster0-eumyn.mongodb.net/cmate", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(async () => {
    const qp = await QuestionPaper.find().sort("-created_at");
    console.log(qp);
  });
