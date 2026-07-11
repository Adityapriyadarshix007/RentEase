const express = require('express');
const compression = require('compression');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'https://rentease-frontend-ul7h.onrender.com', 'https://rentease-app-fawn.vercel.app', 'https://rentease-app-2026.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(compression());
app.use(helmet());
app.use(morgan('dev'));

// Session configuration
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Store sessions in MongoDB for persistence
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24 * 7 // 7 days
});

store.on('error', function(error) {
  console.error('Session store error:', error);
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'rentease-session-secret-key',
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax'
  }
}));

// Initialize Passport
const passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
connectDB();

// =============================================
// ===== ROOT ROUTE (Fixes "Cannot GET /") =====
// =============================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RentEase API Server',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      rentals: '/api/rentals',
      payments: '/api/payments',
      admin: '/api/admin',
      categories: '/api/categories',
      maintenance: '/api/maintenance',
      contact: '/api/contact',
      returns: '/api/returns',
      upload: '/api/upload'
    },
    documentation: 'https://github.com/Adityapriyadarshix007/RentEase',
    timestamp: new Date().toISOString()
  });
});

// =============================================
// ===== HEALTH CHECK =====
// =============================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// =============================================
// ===== API ROUTES =====
// =============================================
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const adminRoutes = require('./routes/admin.routes');
const adminReturnsRoutes = require('./routes/admin-returns.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const contactRoutes = require('./routes/contact.routes');
const categoryRoutes = require('./routes/category.routes');
const rentalRoutes = require('./routes/rental.routes');
const paymentRoutes = require('./routes/payment.routes');
const returnsRoutes = require('./routes/returns.routes');
const cartRoutes = require('./routes/cart.routes');
const uploadRoutes = require('./routes/upload.routes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/returns', adminReturnsRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/returns', returnsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/upload', uploadRoutes);

// =============================================
// ===== GOOGLE AUTH ROUTES =====
// =============================================
app.get('/api/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    accessType: 'offline'
  })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    failureMessage: true
  }),
  (req, res) => {
    console.log('✅ Google auth successful for user:', req.user?.email);
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '365d' }
    );
    
    const frontendUrl = 'https://rentease-app-fawn.vercel.app';
    console.log(`🔄 Redirecting to: ${frontendUrl}/google-auth?token=${token.substring(0, 30)}...`);
    
    res.redirect(`${frontendUrl}/google-auth?token=${token}`);
  }
);

app.get('/api/auth/google/user', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user.toObject();
    delete user.password;
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

app.get('/api/auth/google/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: err.message });
    req.session.destroy();
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// =============================================
// ===== 404 HANDLER =====
// =============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// =============================================
// ===== ERROR HANDLING MIDDLEWARE =====
// =============================================
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`📍 Root: http://localhost:${PORT}/`);
});

module.exports = app;