const router = require("express").Router();
const passport = require("../config/passport");
const { getAuthStatus, logout } = require("../controllers/auth");

// GET => /auth/login
router.get(
  "/login",
  (req, res, next) => {
    req.session.redirectTo = req.headers.referer;
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GET => /auth/google/cb i.e: redirected from oauth consent screen after success
router.get("/google/cb", passport.authenticate("google"), (req, res) => {
  const redirectTo = req.session.redirectTo;
  req.session.redirectTo = undefined;
  res.redirect(redirectTo || "/");
});

// GET => /auth/authStatus
router.get("/getAuthStatus", getAuthStatus);

router.get("/logout", logout);

module.exports = router;
