const express = require("express");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const configuredPassport = require("./config/passport");
const cookieSession = require("cookie-session");
const secrets = require("./config/secrets");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const isAdmin = require("./middlewares/isAdmin");
const cors = require("cors");
const isAuthenticated = require("./middlewares/isAuthenticated");
require("./models/User");

const app = express();
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 3,
    keys: secrets.COOKIE_KEYS
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, X-Auth-Token"
  );
  next();
});
app.use(configuredPassport.initialize());
app.use(configuredPassport.session());
app.use("/api/admin", isAuthenticated, isAdmin, adminRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect("mongodb+srv://nabin1:pword@cluster0-eumyn.mongodb.net/cmate", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log("MongoDB Started");
    app.listen(4000, () => {
      console.log("Server started at http://localhost:4000");
    });
  })
  .catch(err => {
    console.log(err);
  });
