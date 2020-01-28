const fs = require("fs");
const validateDiscussionQuestion = (req, res, next) => {
  if (!req.body.question || !req.body.description) {
    for (let fileCollection in req.files) {
      for (let file of req.files[fileCollection]) {
        fs.unlink(file.path, () => {});
      }
    }
    return res.status(400).send("Incomplete body");
  }
  next();
};

module.exports = validateDiscussionQuestion;
