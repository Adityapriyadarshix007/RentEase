🏠 RentEase – Furniture & Appliance Rental
Platform
A full-stack MERN application for renting furniture and home appliances with secure
payments, admin management, maintenance tracking, and flexible rental workflows.
🚀 Project Highlights
Full-stack MERN application
Secure authentication with JWT & Google OAuth
Razorpay payment integration
Complete admin dashboard
Real-world rental workflow implementation
Cloud deployment with Vercel, Render, and MongoDB Atlas
Database-powered cart persistence
Responsive modern UI using Tailwind CSS
🌐 Live Deployment
Service Link
🚀 Frontend https://rentease-app-fawn.vercel.app
⚙️ Backend API https://rentease-backend-njvk.onrender.com
📦 GitHub Repository https://github.com/Adityapriyadarshix007/RentEase
📋 Project Overview
RentEase is a modern furniture and appliance rental platform designed for students, interns, and working
professionals who frequently relocate to different cities.
Instead of purchasing expensive furniture for temporary stays, users can rent products on flexible monthly
plans ranging from 1 to 12 months.
The platform provides a complete rental ecosystem including:
Product browsing and filtering
Cart and checkout system
•
•
•
•
•
•
•
•
•
•
1
Online payments with Razorpay
Rental tracking and management
Maintenance support tickets
Return request handling
Product reviews and ratings
Admin analytics dashboard
This project was developed as a solo full-stack MERN project to simulate a real-world rental business
workflow.
🎯 Problem Statement
People who move frequently often face difficulties purchasing and managing furniture for short-term stays.
Common Problems
Problem Impact
High upfront furniture costs Expensive for students and interns
Transportation difficulties Difficult to move furniture between cities
Lack of flexible rental services Ownership becomes impractical
Poor maintenance support No repair or replacement assistance
RentEase Solution
RentEase solves these challenges by providing:
Flexible monthly rentals
Affordable pricing model
Maintenance and support system
Easy return workflow
Online order and payment management
✅ Features Implemented
👤 User Features
Feature Description
User Authentication Email/password login and Google OAuth
•
•
•
•
•
•
•
•
•
•
•
2
Feature Description
Product Browsing Search, filter, sorting, and pagination
Product Details Product specifications, pricing, and descriptions
Cart System Add products with flexible rental tenure
Checkout Workflow Delivery scheduling and order placement
Payments Razorpay integration and Cash on Delivery
Rental Tracking View active, completed, pending, and cancelled rentals
Maintenance Requests Raise and track support tickets
Return Requests Request returns and track refunds
Reviews & Ratings Verified product reviews and ratings
Contact System Send queries and receive admin replies
Database Cart Persistence Cart data stored securely in MongoDB
👑 Admin Features
Feature Description
Admin Dashboard Real-time statistics and analytics
Product Management Add, update, delete products with images
Category Management Manage product categories and display order
Rental Management Monitor and update rental status
Maintenance Management Assign and resolve support tickets
Returns Management Approve returns and process refunds
User Contact Management Respond to customer inquiries
Analytics & Reports Revenue charts and CSV exports
Returns Analytics Refund tracking and return trend analysis
🔄 Database Cart – What's New
The cart system has been upgraded from browser localStorage to a MongoDB database-powered solution.
3
Benefits of Database Cart Storage
✅ Cross-device synchronization
✅ Persistent cart after browser cache clearing
✅ Account-based cart management
✅ Secure cloud backup and recovery
✅ Improved scalability for production environments
Users can now add products on one device and continue shopping seamlessly from another device after
logging in.
🛠️ Tech Stack
Frontend
Technology Purpose
React 18 Frontend UI framework
Tailwind CSS Responsive styling
React Router v6 Client-side routing
Axios API communication
Chart.js Analytics visualizations
React Hot Toast Notifications
React Icons UI icons
Backend
Technology Purpose
Node.js JavaScript runtime
Express.js REST API server
MongoDB Database
Mongoose ODM for MongoDB
JWT Authentication and authorization
bcryptjs Password hashing
Razorpay Payment gateway integration
•
•
•
•
•
4
Deployment
Service Usage
Vercel Frontend hosting
Render Backend hosting
MongoDB Atlas Cloud database
🏗️ Database Collections
Collection Description
Users User accounts and authentication data
Products Product information and inventory
Rentals Rental orders and payment details
Categories Product categories and organization
Maintenance Support tickets and repair requests
Returns Return requests and refund tracking
Contacts User inquiries and admin responses
Reviews Product ratings and comments
Cart Persistent cart storage for users
📸 Screenshots
Home Page
<img width="1512" height="827" alt="Home Page" src="https://github.com/user-attachments/assets/
b4a0ee26-2bb0-4572-9997-fd7a1e5b5b92" />
Products Page
<img width="1512" height="827" alt="Products Page" src="https://github.com/user-attachments/assets/
d62698b3-ff97-4019-9eb7-424e7b43f8c0" />
5
Cart Page
<img width="1512" height="827" alt="Cart Page" src="https://github.com/user-attachments/assets/
ca6e371b-baea-443a-b323-0ebbf7d0306e" />
Admin Dashboard
<img width="1512" height="827" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/
fdf7b34a-1699-46b2-b268-f86f188dfb87" />
📦 Installation & Setup
Prerequisites
Node.js (v16 or higher)
MongoDB Atlas account or local MongoDB installation
npm or yarn
Clone Repository
git clone https://github.com/Adityapriyadarshix007/RentEase.git
cd RentEase
Backend Setup
cd backend
npm install
npm run dev
Frontend Setup
cd frontend
npm install
cp .env.example .env
npm start
•
•
•
6
🔐 Environment Variables
Backend (.env)
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=365d
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_secret
Frontend (.env)
REACT_APP_API_URL=http://localhost:5001
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxx
🧠 Learning Outcomes
While building RentEase, I improved my understanding of:
Full-stack MERN development
REST API architecture
JWT authentication workflows
MongoDB schema design and aggregation
Payment gateway integration
Cloud deployment and environment management
State management and reusable React components
Production-ready cart persistence using databases
Key Takeaway
One of the biggest lessons learned during development was the importance of proper database schemaplanning before implementation.
•
•
•
•
•
•
•
•
7
🔮 Future Enhancements
Feature Priority
📱 Mobile Application (React Native) High
🔔 Email & SMS Notifications High
📍 Live Order Tracking Medium
💬 Real-time Chat Support Medium
🔄 Subscription Auto-renewals Medium
📊 Bulk Product Upload Low
🤖 AI-based Recommendations Low
👨‍💻 Author
Aditya Priyadarshi
GitHub: https://github.com/Adityapriyadarshix007
Project Repository: https://github.com/Adityapriyadarshix007/RentEase
📄 License
This project was developed for educational, portfolio, and learning purposes.
⭐ Built With
React.js
Node.js
Express.js
MongoDB
Tailwind CSS
Razorpay
Built with dedication to create a practical and scalable rental management platform. 🚀
•
•
•
•
•
•
•
•
