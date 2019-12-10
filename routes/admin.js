const router = require("express").Router();
const {
  uploadPaper,
  uploadAnswer,
  savePaper,
  deletePaper,
  editPaper,
  getPapers,
  getPaper
} = require("../controllers/admin");
const { upload, imageUpload } = require("../middlewares/upload");

// POST => /admin/uploadPaper
router.post("/uploadPaper", upload.single("questionPaper"), uploadPaper);

//POST => /admin/uploadAnswers
router.post("/uploadAnswer", upload.single("answerSheet"), uploadAnswer);

//POST => /admin/savePaper
router.post("/savePaper", imageUpload.any(), savePaper);

//DELETE => /admin/deletePaper
router.delete("/deletePaper", deletePaper);

//PATCH => /admin/editPaper
router.patch("/editPaper", imageUpload.any(), editPaper);

//GET => /admin/getPapers
router.get("/getPapers", getPapers);

//GET => /admin/getPaper/{id}
router.get("/getPaper/:id", getPaper);

module.exports = router;
