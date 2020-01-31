const mongoose = require("mongoose");
const QuestionPaper = require("./models/QuestionPaper");
const fs = require("fs");
const path = require("path");
const DiscussionQuestion = require("./models/DiscussionQuestion");
const DiscussionReplies = require("./models/DiscussionReplies");
mongoose
  .connect("mongodb+srv://nabin1:pword@cluster0-eumyn.mongodb.net/cmate", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(async () => {
    const qps = await QuestionPaper.find().sort("-created_at");
    const imagesNotToDelete = [];
    qps.forEach(qp => {
      const fileLocation = path.join(
        process.cwd(),
        "resources",
        "questionPapers",
        `${qp._id}.json`
      );
      const questions = JSON.parse(fs.readFileSync(fileLocation));
      Object.values(questions).forEach(question => {
        if (question.image) {
          imagesNotToDelete.push(question.image);
        }
        if (question.directionImage) {
          imagesNotToDelete.push(question.directionImage.url);
        }
      });
    });
    // In questions
    const questions = await DiscussionQuestion.find();
    questions.forEach(question => {
      if (question.images.length !== 0) {
        imagesNotToDelete.push(...question.images);
      }
    });
    // In answers
    const answers = await DiscussionReplies.find();
    answers.forEach(answer => {
      if (answer.images.length !== 0) {
        imagesNotToDelete.push(...answer.images);
      }
    });
    const imagesLocation = path.join(process.cwd(), "resources", "images");
    const imagesInServer = fs.readdirSync(imagesLocation);
    let deletedCount = 0;
    imagesInServer.forEach(image => {
      const doesImageExistInDatabase = imagesNotToDelete.some(
        imageNotToDelete => {
          return imageNotToDelete === image;
        }
      );
      if (!doesImageExistInDatabase) {
        const fileLocation = path.join(
          process.cwd(),
          "resources",
          "images",
          image
        );
        fs.unlink(fileLocation, () => {
          console.log(`Deleted ${fileLocation}`);
          deletedCount++;
        });
      }
    });
    console.log(
      `Deleted ${deletedCount} images in total. ${imagesNotToDelete.length} passed the test`
    );
  });
