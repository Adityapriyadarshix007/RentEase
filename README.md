# 🏠 RentEase – Furniture & Appliance Rental Platform

## Key Highlights
- MERN Stack Project
- Razorpay Integration
- Admin Dashboard
- Live Deployment
- Real-world Rental Workflow

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://rentease-app-fawn.vercel.app)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=flat&logo=render)](https://rentease-backend-njvk.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=flat&logo=github)](https://github.com/Adityapriyadarshix007/RentEase)
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
- Browsing products
- Placing rental orders
- Tracking active rentals
- Requesting maintenance
- Managing returns

There's also a complete admin dashboard for managing products, users, orders, and analytics.

**Built as a solo project** using the MERN stack.

---

## 🎯 The Problem I'm Solving

Students, interns, and working professionals relocate frequently. Buying furniture for short-term stays doesn't make sense:

| Problem | Impact |
|---------|--------|
| 💰 High upfront costs | Students can't afford ₹50k+ for furniture |
| 🚚 Difficulty transporting | Moving items to new cities is expensive |
| 📅 No flexible rentals | Locked into ownership for short stays |
| 🔧 Poor maintenance | No support when things break |

RentEase solves these by offering **monthly rentals with flexible terms from 1 to 12 months**.

---

## ✅ What's Actually Working Right Now

### 👤 For Users

| Feature | What it does |
|---------|---------------|
| **Registration & Login** | Email/password + Google OAuth |
| **Browse Products** | Search, filter by category, sort by price, pagination |
| **Product Details** | View specs, monthly rent, security deposit, technical specifications table |
| **Cart & Checkout** | Add items, choose rental tenure (1-12 months), schedule delivery |
| **Payments** | Razorpay (cards, UPI, netbanking) + Cash on Delivery |
| **My Rentals** | Track active, pending, completed, and cancelled orders |
| **Maintenance** | Raise support tickets, track resolution status (pending → assigned → resolved) |
| **Returns** | Request return with reason, track refund status |
| **My Messages** | View admin replies to contact form submissions |
| **Reviews** | Rate and review products you've rented (with verified purchase badge) |

### 👑 For Admins

| Feature | What it does |
|---------|---------------|
| **Dashboard** | Real-time stats: users, products, rentals, revenue (auto-refresh) |
| **Product Management** | Add, edit, delete products with images (JPEG, PNG, WEBP up to 20MB) |
| **Category Management** | Create and organize product categories with display order |
| **Rental Management** | Update order status, track all rentals with filters |
| **Returns Management** | Approve/reject return requests, process refunds with damage assessment |
| **Maintenance** | Assign and resolve support tickets (pending → assigned → in_progress → resolved) |
| **Contact Messages** | Reply to user inquiries from admin panel |
| **Analytics** | Charts (revenue trends, category distribution), CSV exports (products, rentals, users, returns) |
| **Returns Analytics** | Track refund amounts, returns by reason, monthly return trends |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework with hooks and context API |
| Tailwind CSS | Styling (utility-first, responsive) |
| React Router v6 | Client-side routing |
| Axios | API calls with interceptors |
| Chart.js | Analytics charts (Line, Bar, Doughnut) |
| React Hot Toast | Toast notifications |
| React Icons | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database with ODM |
| JWT | Authentication (stateless tokens) |
| bcryptjs | Password hashing |
| Razorpay | Payment gateway (test mode) |

### Deployment
| Service | What it hosts |
|---------|---------------|
| Vercel | Frontend React app |
| Render | Backend Node.js API |
| MongoDB Atlas | Cloud database |

---

## 🏗️ Database Schema

| Collection | Stores |
|------------|--------|
| **Users** | User profiles, hashed passwords, addresses, Google OAuth IDs |
| **Products** | Product details, pricing, images, inventory, ratings |
| **Rentals** | Order details, rental dates, payment status, delivery info |
| **Categories** | Product categories with display order and slugs |
| **Maintenance** | Support tickets with status tracking |
| **Returns** | Return requests, refund amounts, inspection notes |
| **Contacts** | User inquiries and admin responses |
| **Reviews** | Product ratings, comments, verified purchase flag, helpful votes |

---

## 📦 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Clone & Install

```bash
git clone https://github.com/Adityapriyadarshix007/RentEase.git
cd RentEase

### Backend Setup

```bash
cd backend
npm install
npm run dev


### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Add REACT_APP_API_URL=http://localhost:5001
npm start


Environment Variables
Backend (.env)

env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=365d
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx


Frontend (.env)

env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxx


🧠 What I Learned
While building this project, I improved my understanding of API design, authentication, deployment, and database planning.

React component architecture - Breaking UI into reusable pieces

REST API design - Proper error handling, status codes, validation

MongoDB schema relationships - Populating references, aggregation pipelines

JWT authentication - Token generation, verification, protected routes

Payment gateway integration - Razorpay webhooks, signature verification

Full-stack deployment - Vercel, Render, environment variables

Biggest lesson: Plan your database schema before writing code. I redesigned the rentals collection twice because I didn't think through payment status flows properly.

🔮 Future Plans (When I Have More Time)

Feature	Priority

📱 Mobile App (React Native)	High
🔔 Email/SMS notifications	High
📍 Live order tracking with map	Medium
📊 Bulk product upload via CSV	Low
🤖 AI-based product recommendations	Low
💬 Live chat support	Medium
🔄 Auto-renewing subscriptions	Medium


Role	Email	Password
👤 Regular User	- register yourself


📸 Screenshots
Page	Screenshot
Home Page	<img width="800" alt="Home" src="https://github.com/user-attachments/assets/8edf2cb8-8a4a-4b44-aff2-3f13d6a1c275" />
Products Page	<img width="800" alt="Products" src="https://github.com/user-attachments/assets/8e317d17-ae88-4b99-abe6-585581607474" />
Cart Page	<img width="800" alt="Cart" src="https://github.com/user-attachments/assets/814bdd17-8990-43c9-b103-9d8c1a24f128" />
Admin Dashboard	<img width="800" alt="Admin" src="https://github.com/user-attachments/assets/b6bc3e89-e332-4c28-992c-e067f953670e" />


📄 License
Developed for academic learning and portfolio purposes.

👨‍💻 Author
Aditya Priyadarshi

GitHub: @Adityapriyadarshix007

Project Link: https://github.com/Adityapriyadarshix007/RentEase

Built with React, Node.js, MongoDB, and Tailwind CSS 🚀

