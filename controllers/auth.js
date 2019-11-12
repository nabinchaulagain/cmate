// controller for GET=> /auth/getStatus
const getAuthStatus = (req, res) => {
  if (req.user) {
    res.json(req.user);
    return;
  }
  res.status(401).send("Not logged in");
};

const logout = (req, res) => {
  req.logout();
  res.redirect("http://localhost:3000");
};
module.exports = { getAuthStatus, logout };
