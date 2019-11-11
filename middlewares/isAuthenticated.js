const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send("Not Authenticated");
  }
};
module.exports = isAuthenticated;
