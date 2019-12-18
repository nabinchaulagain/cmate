const router = require("express").Router();
const {
  getPaper,
  getPapers,
  saveQuizResult,
  getQuizResult,
  getAnswer
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
module.exports = router;
