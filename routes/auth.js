const router = require("express").Router();
const passport = require("../config/passport");
const { getAuthStatus } = require("../controllers/auth");
// GET => /auth/login
router.get(
  "/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GET => /auth/google/cb i.e: redirected from oauth consent screen after success
router.get("/google/cb", passport.authenticate("google"), (req, res) => {
  res.redirect("http://localhost:3000");
});

// GET => /auth/authStatus
router.get("/getAuthStatus", getAuthStatus);

module.exports = router;
