const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const User = require("../models/User");
const { OAUTH } = require("./secrets");
passport.serializeUser((user, done) => {
  //put user id into the cookie
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  // extract user from user id in the cookie
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new googleStrategy(
    {
      clientID: OAUTH.CLIENT_ID,
      clientSecret: OAUTH.CLIENT_SECRET,
      callbackURL: "/api/auth/google/cb"
    },
    async (accessToken, refreshToken, profile, done) => {
      const oldUser = await User.findOne({ googleId: profile.id });
      if (!oldUser) {
        //add new User if not in db
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          profilePic: profile.photos[0].value,
          email: profile.emails[0].value
        });
        const savedUser = await newUser.save();
        done(null, savedUser);
        return;
      }
      done(null, oldUser);
    }
  )
);

module.exports = passport;
