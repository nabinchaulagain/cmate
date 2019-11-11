// controller for GET=> /auth/getStatus
const getAuthStatus = (req, res) => {
  if (req.user) {
    res.json(req.user);
    return;
  }
  res.status(401).send("Not logged in");
};

module.exports = { getAuthStatus };
