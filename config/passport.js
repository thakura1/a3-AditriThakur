const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

const callbackFromEnv =
  process.env.GITHUB_CALLBACK_URL ||
  process.env.GITHUB_CALLBACK ||
  'http://localhost:3000/auth/github/callback';

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  console.warn('⚠️  Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in env!');
}
console.log('Using GitHub callback URL:', callbackFromEnv);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: callbackFromEnv
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('GitHub verify callback invoked. profile.id=', profile && profile.id);
        let user = await User.findOne({ githubId: profile.id }).exec();
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            username: profile.username || profile.displayName || `gh-${profile.id}`
          });
          console.log('Created new user:', user.username);
        } else {
          if (profile.username && user.username !== profile.username) {
            user.username = profile.username;
            await user.save();
          }
          console.log('Found user:', user.username);
        }
        return done(null, user);
      } catch (err) {
        console.error('Error inside GitHub verify callback:', err);
        return done(err);
      }
    }
  )
);

module.exports = passport;


