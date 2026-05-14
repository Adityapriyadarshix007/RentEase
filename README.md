# 🏠 RentEase – Furniture & Appliance Rental Platform

## Key Highlights
- ✅ MERN Stack Project
- ✅ Razorpay Payment Integration
- ✅ Complete Admin Dashboard
- ✅ Live Deployment (Vercel + Render)
- ✅ Real-world Rental Workflow
- ✅ Cloudinary Image Optimization
- ✅ 24/7 Uptime Monitoring

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://rentease-app-fawn.vercel.app)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=flat&logo=render)](https://rentease-backend-njvk.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat&logo=github)](https://github.com/Adityapriyadarshix007/RentEase)
[![Uptime](https://img.shields.io/badge/Uptime-99.9%25-brightgreen)](https://uptimerobot.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Live Demo

| Environment | URL |
|-------------|-----|
| 🚀 **Frontend** | [rentease-app-fawn.vercel.app](https://rentease-app-fawn.vercel.app) |
| ⚙️ **Backend API** | [rentease-backend-njvk.onrender.com](https://rentease-backend-njvk.onrender.com) |
| 📦 **GitHub** | [Adityapriyadarshix007/RentEase](https://github.com/Adityapriyadarshix007/RentEase) |

---

## 📋 Project Overview

**RentEase** is a full-stack web application that lets people rent furniture and home appliances online. I built this because I've seen friends and colleagues struggle with buying expensive furniture when they move to a new city for a few months.

Instead of spending thousands on items they'll need to sell or leave behind, RentEase gives them the flexibility to rent month-by-month.

The platform handles:
- 🔍 Browsing products with advanced filtering
- 🛒 Placing rental orders with flexible tenure
- 📦 Tracking active rentals and delivery status
- 🔧 Requesting maintenance support
- 🔄 Managing returns and refunds
- 📊 Complete admin dashboard with analytics
- 💳 Secure online payments via Razorpay

**Built as a solo project** using the MERN stack.

---

## 🎯 The Problem I'm Solving

Students, interns, and working professionals relocate frequently. Buying furniture for short-term stays doesn't make sense:

| Problem | Impact | RentEase Solution |
|---------|--------|-------------------|
| 💰 High upfront costs | ₹50k+ for furniture | Monthly rentals starting at ₹499 |
| 🚚 Difficulty transporting | Expensive moving costs | Free delivery & pickup |
| 📅 No flexible rentals | Locked into ownership | 1-12 months flexible tenure |
| 🔧 Poor maintenance | No support when things break | 24/7 maintenance requests |
| 🖼️ Product images slow | 5-6 second load time | Cloudinary CDN (< 1 second) |

---

## ✅ What's Actually Working Right Now

### 👤 For Users (12+ Features)

| Feature | What it does | Status |
|---------|---------------|--------|
| **Registration & Login** | Email/password + Google OAuth | ✅ Live |
| **Browse Products** | Search, filter by category, sort by price, pagination (12 per page) | ✅ Live |
| **Product Details** | View specs, monthly rent, security deposit, technical specifications table | ✅ Live |
| **Cart & Checkout** | Add items, choose rental tenure (1-12 months), schedule delivery | ✅ Live |
| **Payments** | Razorpay (cards, UPI, netbanking) + Cash on Delivery | ✅ Live |
| **My Rentals** | Track active, pending, completed, and cancelled orders | ✅ Live |
| **Maintenance** | Raise support tickets, track resolution status | ✅ Live |
| **Returns** | Request return with reason, track refund status | ✅ Live |
| **My Messages** | View admin replies to contact form submissions | ✅ Live |
| **Reviews** | Rate and review products you've rented (with verified purchase badge) | ✅ Live |
| **Cart Persistence** | Cart saved to database, accessible across devices | ✅ Live |
| **Order History** | Complete rental history with payment tracking | ✅ Live |

### 👑 For Admins (10+ Features)

| Feature | What it does | Status |
|---------|---------------|--------|
| **Dashboard** | Real-time stats: users, products, rentals, revenue (auto-refresh every 30s) | ✅ Live |
| **Product Management** | Add, edit, delete products with Cloudinary image upload (JPEG, PNG, WEBP up to 20MB) | ✅ Live |
| **Category Management** | Create and organize product categories with display order | ✅ Live |
| **Rental Management** | Update order status, track all rentals with filters | ✅ Live |
| **Returns Management** | Approve/reject return requests, process refunds with damage assessment | ✅ Live |
| **Maintenance** | Assign and resolve support tickets (pending → assigned → in_progress → resolved) | ✅ Live |
| **Contact Messages** | Reply to user inquiries from admin panel | ✅ Live |
| **Analytics** | Charts (revenue trends, category distribution), CSV exports (products, rentals, users, returns) | ✅ Live |
| **Returns Analytics** | Track refund amounts, returns by reason, monthly return trends | ✅ Live |
| **User Management** | Manage user roles, active status, view user details | ✅ Live |

---

## 🚀 Recent Performance & Availability Updates

### ☁️ Cloudinary Image Optimization
To drastically improve page load speed and reduce server costs, all product images are now stored and optimized using **Cloudinary**.

- **Images are no longer stored as Base64** in the database, reducing API response size by over 90%
- Automatic image compression and format selection (WebP) for faster downloads
- Product listing pages load **~75% faster** than before (from 5-6 seconds to < 1 second)
- Responsive images with automatic device optimization

### 💡 Keep-Alive Service (UptimeRobot)
The free-tier backend service on Render will go to sleep after periods of inactivity, causing a **cold start delay** of 3-5 seconds on the first request.

To solve this, a free **UptimeRobot** monitor pings the backend health endpoint every 5 minutes, keeping the service active and ensuring:
- ✅ First-time visitors get a fast response (no cold start)
- ✅ Consistent API response times under 500ms
- ✅ 99.9% uptime for the platform
- ✅ Improved overall user experience

### 📊 Performance Metrics

| Metric | Before Optimization | After Optimization | Improvement |
|--------|---------------------|-------------------|-------------|
| API Response (12 products) | 5.9 seconds | 0.45 seconds | **92% faster** |
| First Paint | 2.1 seconds | 0.8 seconds | **62% faster** |
| Time to Interactive | 3.8 seconds | 1.2 seconds | **68% faster** |
| Image Load Time | 2-3 seconds | 0.3 seconds | **85% faster** |
| Cold Start | 5+ seconds | 0.5 seconds | **90% faster** |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework with hooks and context API |
| Tailwind CSS | 3.3.0 | Styling (utility-first, responsive) |
| React Router DOM | 6.14.0 | Client-side routing |
| Axios | 1.4.0 | API calls with interceptors |
| Chart.js | 4.3.0 | Analytics charts (Line, Bar, Doughnut) |
| React Hot Toast | 2.4.0 | Toast notifications |
| React Icons | 4.10.0 | Icon library |
| Framer Motion | 10.12.0 | Smooth animations |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | JavaScript runtime |
| Express.js | 4.18.2 | REST API server |
| MongoDB | 6.0 | NoSQL database |
| Mongoose | 7.3.0 | ODM for MongoDB |
| JWT | 9.0.0 | Authentication (stateless tokens) |
| bcryptjs | 2.4.3 | Password hashing |
| Razorpay | 2.8.6 | Payment gateway (test mode) |
| Cloudinary | 1.41.3 | Image hosting and optimization |

### Deployment
| Service | What it hosts | Plan |
|---------|---------------|------|
| Vercel | Frontend React app | Free (Hobby) |
| Render | Backend Node.js API | Free (Web Service) |
| MongoDB Atlas | Cloud database | Free (M0 Sandbox) |
| Cloudinary | Image storage & CDN | Free (25GB) |
| UptimeRobot | Backend monitoring | Free (50 monitors) |

---

## 🏗️ Database Schema

| Collection | Document Count | Stores |
|------------|----------------|--------|
| **Users** | ~10 | User profiles, hashed passwords, addresses, Google OAuth IDs |
| **Products** | 50 | Product details, pricing, Cloudinary image URLs, inventory, ratings |
| **Rentals** | 53 | Order details, rental dates, payment status, delivery info |
| **Categories** | 2 | Product categories (Furniture, Appliances) with display order |
| **Maintenance** | ~5 | Support tickets with status tracking |
| **Returns** | ~3 | Return requests, refund amounts, inspection notes |
| **Contacts** | ~15 | User inquiries and admin responses |
| **Reviews** | ~20 | Product ratings, comments, verified purchase flag, helpful votes |

---

## 📸 Screenshots

| Page | Screenshot |
|------|------------|
| **Home Page** | <img width="800" alt="Home Page" src="https://github.com/user-attachments/assets/b4a0ee26-2bb0-4572-9997-fd7a1e5b5b92" /> |
| **Products Page** | <img width="800" alt="Products Page" src="https://github.com/user-attachments/assets/d62698b3-ff97-4019-9eb7-424e7b43f8c0" /> |
| **Cart Page** | <img width="800" alt="Cart Page" src="https://github.com/user-attachments/assets/ca6e371b-baea-443a-b323-0ebbf7d0306e" /> |
| **Admin Dashboard** | <img width="800" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/fdf7b34a-1699-46b2-b268-f86f188dfb87" /> |

---

## 📦 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn
- Cloudinary account (free)
- Razorpay test account (free)

### 1. Clone Repository

```bash
git clone https://github.com/Adityapriyadarshix007/RentEase.git
cd RentEase

Backend Setup

cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values (see Environment Variables section)
nano .env

# Start backend server
npm run dev

Frontend Setup

cd frontend
npm install

# Create .env file
cp .env.example .env

# Add your backend URL
echo "REACT_APP_API_URL=http://localhost:5001" >> .env

# Start frontend
npm start

Environment Variables

Backend (.env)

PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=365d
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Frontend (.env)

REACT_APP_API_URL=http://localhost:5001
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx

4. Deploy to Production

Backend (Render.com)

1. Push code to GitHub

2. Connect repository to Render

3. Add environment variables

4. Deploy

Frontend (Vercel)

cd frontend
vercel --prod


🧠 What I Learned
While building this project, I improved my understanding of:

1. React component architecture - Breaking UI into reusable pieces

2. REST API design - Proper error handling, status codes, validation

3. MongoDB schema relationships - Populating references, aggregation pipelines

4. JWT authentication - Token generation, verification, protected routes

5. Payment gateway integration - Razorpay webhooks, signature verification

6. Image optimization - Cloudinary CDN, lazy loading, responsive images

7. Full-stack deployment - Vercel, Render, environment variables, CI/CD

8. Performance optimization - Database indexing, caching, compression

9. Real-time updates - Auto-refresh dashboards, event listeners

Biggest lesson: Plan your database schema before writing code. I redesigned the rentals collection twice because I didn't think through payment status flows properly.

🔮 Future Plans (When I Have More Time)
Feature	Priority	Status
📱 Mobile App (React Native)	High	⏳ Planned
🔔 Email/SMS notifications	High	⏳ Planned
📍 Live order tracking with map	Medium	⏳ Planned
📊 Bulk product upload via CSV	Low	⏳ Planned
🤖 AI-based product recommendations	Low	⏳ Planned
💬 Live chat support	Medium	⏳ Planned
🔄 Auto-renewing subscriptions	Medium	⏳ Planned
📈 Advanced analytics dashboard	Low	⏳ Planned
👤 Demo Access
Try the live demo: https://rentease-app-fawn.vercel.app

Simply register as a new user to explore all features.

💡 Note: Admin credentials are not shared publicly for security reasons. For admin access or any questions, please reach out to the developer.

🐛 Known Issues & Limitations
Issue	Status	Workaround
Razorpay test mode only	⚠️ Known	Use test card: 4111 1111 1111 1111
Cold start on Render free tier	⚠️ Known	UptimeRobot keeps it warm
No email notifications	⏳ Planned	Will add SendGrid integration
Multi-city inventory	⏳ Planned	Future enhancement


📄 License
Developed for academic learning and portfolio purposes.

👨‍💻 Author
Aditya Priyadarshi

GitHub: @Adityapriyadarshix007

Project Link: https://github.com/Adityapriyadarshix007/RentEase

🙏 Acknowledgments
Razorpay for test payment gateway

Cloudinary for free image hosting

Render and Vercel for free hosting

MongoDB Atlas for free database hosting

UptimeRobot for free monitoring

Built with React, Node.js, MongoDB, Tailwind CSS, and Cloudinary 🚀