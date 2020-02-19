const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const configuredPassport = require("./config/passport");
const cookieSession = require("cookie-session");
const secrets = require("./config/secrets");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const isAdmin = require("./middlewares/isAdmin");
const isAuthenticated = require("./middlewares/isAuthenticated");
const paperRoutes = require("./routes/papers");
const resultRoutes = require("./routes/results");
const discussionRoutes = require("./routes/discussions");
const errorHandler = require("./middlewares/errorHandler");
const adminIdentifier = require("./middlewares/adminIdentifier");
require("./models/User");

const app = express();
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 3,
    keys: secrets.COOKIE_KEYS
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(configuredPassport.initialize());
app.use(configuredPassport.session());
app.use(adminIdentifier);
app.use("/api/admin", isAuthenticated, isAdmin, adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", paperRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/images", express.static("resources/images"));
app.use(errorHandler);

mongoose
  .connect(secrets.DB_CONN_STR, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log("MongoDB Started");
    app.listen(4000, () => {
      console.log("Server started");
    });
  })
  .catch(err => {
    console.log(err);
  });
