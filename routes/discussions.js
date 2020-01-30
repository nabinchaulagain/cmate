const router = require("express").Router();
const {
  addQuestion,
  getQuestions,
  getQuestion,
  editQuestion,
  deleteQuestion
} = require("../controllers/discussions");
const {
  getReplies,
  addReply,
  editReply,
  deleteReply
} = require("../controllers/discussionReplies");
const { imageUpload } = require("../middlewares/upload");
const validateQuestion = require("../middlewares/validateDiscussionQuestion");
const isAuthenticated = require("../middlewares/isAuthenticated");
const doesQuestionExist = require("../middlewares/doesQuestionExist");
// POST => /discussions/
router.post(
  "/",
  isAuthenticated,
  imageUpload.fields([{ name: "images", maxCount: 5 }]),
  validateQuestion,
  addQuestion
);

// GET => /discussions
router.get("/", getQuestions);

//GET => /discussions/:id
router.get("/:id", getQuestion);

//PATCH => /discussions/:id
router.patch(
  "/:id",
  isAuthenticated,
  imageUpload.fields([{ name: "images", maxCount: 5 }]),
  validateQuestion,
  editQuestion
);
//DELETE => /discussions/:id
router.delete("/:id", isAuthenticated, deleteQuestion);

// GET => discussions/:questionId/replies
router.get("/:questionId/replies", doesQuestionExist, getReplies);

// POST => discussions/:questionId/replies
router.post(
  "/:questionId/replies",
  isAuthenticated,
  doesQuestionExist,
  imageUpload.array("images", 3),
  addReply
);

//PATCH => discussions/:questionId/replies/:replyId
router.patch(
  "/:questionId/replies/:replyId",
  isAuthenticated,
  doesQuestionExist,
  imageUpload.array("images", 3),
  editReply
);

//DELETE => discussions/:questionId/replies/:replyId
router.delete(
  "/:questionId/replies/:replyId",
  isAuthenticated,
  doesQuestionExist,
  deleteReply
);
module.exports = router;
