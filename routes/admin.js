const router = require("express").Router();
const {
  uploadPaper,
  uploadAnswer,
  saveAnswer,
  savePaper
} = require("../controllers/admin");
const upload = require("../middlewares/upload");

// POST => /admin/uploadPaper
router.post("/uploadPaper", upload.single("questionPaper"), uploadPaper);

//POST => /admin/uploadAnswers
router.post("/uploadAnswer", upload.single("answerSheet"), uploadAnswer);

//POST => /admin/savePaper
router.post("/savePaper", savePaper);

//POST => /admin/saveAnswer
router.post("/saveAnswer/:id", saveAnswer);
module.exports = router;
