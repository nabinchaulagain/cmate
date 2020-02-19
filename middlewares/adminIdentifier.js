const secrets = require("../config/secrets");
const adminIdentifier = (req, res, next) => {
  if (req.user) {
    if (req.user.googleId === secrets.ADMIN_ID) {
      req.user.isAdmin = true;
    }
  }
  next();
};

module.exports = adminIdentifier;
