const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        
        // Check if user already exists
        let user = await User.findOne({ email });
        
        if (!user) {
          // Create new user for first-time Google sign-in
          user = new User({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            profileImage: profile.photos[0]?.value,
            isActive: true,
            role: 'user', // Default role
            phone: '',
            address: {
              street: '',
              city: '',
              state: '',
              pincode: ''
            }
          });
          await user.save();
          console.log(`✅ New user created via Google: ${email}`);
        } else if (!user.googleId) {
          // Link existing account with Google ID
          user.googleId = profile.id;
          user.profileImage = profile.photos[0]?.value;
          await user.save();
          console.log(`🔗 Google ID linked to existing user: ${email}`);
        }
        
        return done(null, user);
      } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
