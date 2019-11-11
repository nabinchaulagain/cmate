const fs = require("fs");
const mongoose = require("mongoose");
const questionPaper = require("./models/QuestionPaper");
(async () => {
  mongoose.connect(
    "mongodb+srv://nabin1:pword@cluster0-eumyn.mongodb.net/cmate"
  );
  fs.readFile("./goa.json", async (err, data) => {
    const questionGroup = { questions: JSON.parse(data.toString()) };
    console.log(questionGroup);
    const qp = new questionPaper({ questionGroup, title: "Test paper" });
    const savedDoc = await qp.save();
    console.log(savedDoc);
  });
})();
