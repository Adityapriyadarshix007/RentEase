const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');

console.log('🔧 Loading Passport configuration...');
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);
console.log("BACKEND_URL:", process.env.BACKEND_URL);
console.log(
  "Callback URL:",
  `${process.env.BACKEND_URL}/api/auth/google/callback`
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('📧 Google profile received:', profile.emails[0].value);
        
        const email = profile.emails[0].value;
        
        let user = await User.findOne({ email });
        
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
            profileImage: profile.photos[0]?.value || '',
            isActive: true,
            role: 'user',
            phone: '',
            address: {
              street: '',
              city: '',
              state: '',
              pincode: '',
              landmark: ''
            }
          });
          await user.save();
          console.log(`✅ New user created via Google: ${email}`);
        } else if (!user.googleId) {
          user.googleId = profile.id;
          user.profileImage = profile.photos[0]?.value || user.profileImage;
          await user.save();
          console.log(`🔗 Google ID linked to existing user: ${email}`);
        } else {
          console.log(`👋 Returning user: ${email}`);
        }
        
        return done(null, user);
      } catch (error) {
        console.error('❌ Google Strategy Error:', error.message);
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
    console.error('Deserialize error:', error);
    done(error, null);
  }
});

module.exports = passport;
