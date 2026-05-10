const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model');

console.log('🔧 Loading Passport configuration...');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'https://rentease-backend-njvk.onrender.com'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('📧 Google profile received:', profile.emails[0].value);
        
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;
        const profileImage = profile.photos[0]?.value || '';
        
        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { googleId }] });
        
        if (!user) {
          // Create new user with Google data - missing fields will be optional
          user = new User({
            name: name,
            email: email,
            googleId: googleId,
            profileImage: profileImage,
            isActive: true,
            role: 'user',
            // These fields will be optional due to conditional required in schema
            password: undefined,
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
          // Link existing account with Google ID
          user.googleId = googleId;
          if (profileImage) {
            user.profileImage = profileImage;
          }
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
