import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import GoogleAuthHandler from './pages/GoogleAuthHandler';
import CompleteProfile from './pages/CompleteProfile';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyRentals from './pages/MyRentals';
import RentalDetailPage from './pages/RentalDetailPage';
import Maintenance from './pages/Maintenance';
import MaintenanceDetail from './pages/MaintenanceDetail';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import Cancellation from './pages/Cancellation';
import MyMessages from './pages/MyMessages';
import MyReturns from './pages/MyReturns';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminRentals from './pages/admin/AdminRentals';
import AdminMaintenance from './pages/admin/AdminMaintenance';
import AdminCategories from './pages/admin/AdminCategories';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReturns from './pages/admin/AdminReturns';
import AdminReturns from './pages/admin/AdminReturns';
import AdminContacts from './pages/admin/AdminContacts';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/cancellation" element={<Cancellation />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/my-rentals" element={<ProtectedRoute><MyRentals /></ProtectedRoute>} />
                <Route path="/rentals/:id" element={<ProtectedRoute><RentalDetailPage /></ProtectedRoute>} />
                <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
                <Route path="/maintenance/:id" element={<ProtectedRoute><MaintenanceDetail /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/my-messages" element={<ProtectedRoute><MyMessages /></ProtectedRoute>} />
                <Route path="/my-returns" element={<ProtectedRoute><MyReturns /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/rentals" element={<ProtectedRoute adminOnly><AdminLayout><AdminRentals /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/maintenance" element={<ProtectedRoute adminOnly><AdminLayout><AdminMaintenance /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/categories" element={<ProtectedRoute adminOnly><AdminLayout><AdminCategories /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminLayout><AdminAnalytics /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/returns" element={<ProtectedRoute adminOnly><AdminLayout><AdminReturns /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/returns" element={<ProtectedRoute adminOnly><AdminLayout><AdminReturns /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/contacts" element={<ProtectedRoute adminOnly><AdminLayout><AdminContacts /></AdminLayout></ProtectedRoute>} />
                
                {/* 404 */}
                <Route path="*" element={<Navigate to="/products" replace />} />

                {/* Google Authenitication */}
                <Route path="/google-auth" element={<GoogleAuthHandler />} />
                <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
