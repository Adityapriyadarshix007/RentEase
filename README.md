# RentEase - Furniture & Appliance Rental Platform

![RentEase Banner](https://via.placeholder.com/1200x400?text=RentEase)

## 🏠 Overview

RentEase is a comprehensive web platform that allows users to rent furniture and appliances on a monthly basis, providing flexible, affordable, and convenient solutions for urban living. Students and working professionals can now enjoy quality products without the burden of ownership.

## ✨ Features

### 👤 User Features
- **User Authentication**: Secure register/login with JWT
- **Product Catalog**: Browse furniture & appliances with advanced filtering
- **Product Details**: View specifications, pricing, and rental options
- **Shopping Cart**: Add/remove items, update quantity and tenure
- **Checkout Process**: Schedule delivery, choose payment method
- **Rental Management**: Track active, pending, and completed rentals
- **Maintenance Requests**: Submit and track support tickets
- **User Profile**: Update personal information and change password
- **Order History**: View all past rental transactions

### 👑 Admin Features
- **Dashboard**: Real-time stats and analytics
- **User Management**: View, edit, and manage user accounts
- **Product Management**: CRUD operations for products
- **Rental Management**: Track and update rental status
- **Maintenance Management**: Assign and resolve support tickets
- **Category Management**: Manage product categories
- **Analytics**: Revenue trends and category distribution

## 🚀 Technology Stack

### Frontend
- **React 18** - UI Library
- **Tailwind CSS** - Styling
- **React Router v6** - Navigation
- **Axios** - API calls
- **React Hot Toast** - Notifications
- **React Icons** - Icons
- **Chart.js** - Analytics charts

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/rentease.git
cd rentease

# Install backend dependencies
cd backend
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/rentease
# JWT_SECRET=your_super_secret_key

# Start backend server
npm run dev