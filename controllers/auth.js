const secrets = require("../config/secrets");
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
  res.redirect("http://localhost:3000");
};
module.exports = { getAuthStatus, logout };
