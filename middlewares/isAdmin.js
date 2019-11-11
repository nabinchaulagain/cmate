const secrets = require("../config/secrets");
const isAdmin = (req, res, next) => {
  const user = req.user;
  if (
    user.googleId === secrets.ADMIN_ID &&
    user.email === secrets.ADMIN_EMAIL
  ) {
    next();
  } else {
    res.status(403).send("Not an admin");
  }
};
module.exports = isAdmin;
