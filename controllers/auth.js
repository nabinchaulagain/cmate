const secrets = require("../config/secrets");
const User = require("../models/User");
const QuizResult = require("../models/QuizResults");
// controller for GET=> /auth/getStatus
const getAuthStatus = (req, res) => {
  if (req.user) {
    //if admin add isAdmin to response payload
    if (
      req.user.googleId === secrets.ADMIN_ID &&
      req.user.email === secrets.ADMIN_EMAIL
    ) {
      return res.json({ ...req.user._doc, isAdmin: true });
    }
    return res.json(req.user);
  }
  res.status(401).send("Not logged in");
};

const logout = (req, res) => {
  req.logout();
  res.redirect(req.headers.referer || "/");
};

// controller for GET=>/auth/profile/:userId
const getProfile = async (req, res, next) => {
  try {
    if (!req.params.userId) {
      return res.status(400).send("Id required");
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("Not found");
    }
    const results = await QuizResult.find(
      { "user._id": user._id },
      { questionPaperId: 1, "performance.rightAnswers": 1 }
    ).populate("questionPaperId");
    const resultsMin = results.map(result => {
      return {
        questionPaper: result.questionPaperId.title,
        correctAnswers: result.performance.rightAnswers,
        quizId: result.questionPaperId._id
      };
    });
    res.json({ user, results: resultsMin });
  } catch (err) {
    next(err);
  }
};
module.exports = { getAuthStatus, logout, getProfile };
