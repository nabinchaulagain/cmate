const router = require("express").Router();
const {
  addQuestion,
  getQuestions,
  getQuestion,
  editQuestion,
  deleteQuestion
} = require("../controllers/discussions");
const { imageUpload } = require("../middlewares/upload");
const validateQuestion = require("../middlewares/validateDiscussionQuestion");
const isAuthenticated = require("../middlewares/isAuthenticated");
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
module.exports = router;
