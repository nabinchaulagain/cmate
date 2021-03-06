const router = require("express").Router();
const {
  getPaper,
  getPapers,
  saveQuizResult,
  getQuizResult,
  getAnswer,
  saveQuizProgress,
  getQuizProgress,
  deleteQuizProgress,
  reportQuestion
} = require("../controllers/papers");
const isAuthenticated = require("../middlewares/isAuthenticated");
//GET =>/getPapers
router.get("/getPapers", getPapers);

//GET => /getPaper/:id
router.get("/getPaper/:id", getPaper);

//GET => /getAnswer/:id
router.get("/getAnswer/:id", getAnswer);

//POST => /saveQuizResult
router.post("/saveQuizResult", isAuthenticated, saveQuizResult);

//GET => /getQuizResult?resultId
router.get("/getQuizResult", isAuthenticated, getQuizResult);

//PUT => /saveQuizProgress
router.put("/saveQuizProgress", isAuthenticated, saveQuizProgress);

//GET => /getQuizProgress
router.get("/getQuizProgress", isAuthenticated, getQuizProgress);

//DELETE => /deleteQuizProgress
router.delete("/deleteQuizProgress", isAuthenticated, deleteQuizProgress);

//POST => /report/:quizId?questionNum
router.post("/report/:paperId", isAuthenticated, reportQuestion);

module.exports = router;
