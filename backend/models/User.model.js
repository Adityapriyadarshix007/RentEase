const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      // Password is only required for non-Google users
      return !this.googleId;
    },
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: function() {
      // Phone is only required for non-Google users
      return !this.googleId;
    },
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number']
  },
  address: {
    street: { 
      type: String, 
      required: function() {
        return !this.googleId;
      }
    },
    city: { 
      type: String, 
      required: function() {
        return !this.googleId;
      }
    },
    state: { 
      type: String, 
      required: function() {
        return !this.googleId;
      }
    },
    pincode: { 
      type: String, 
      required: function() {
        return !this.googleId;
      },
      match: [/^[0-9]{6}$/, 'Please add a valid 6-digit pincode']
    },
    landmark: { type: String }
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'vendor'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Only hash password if it exists and is modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
