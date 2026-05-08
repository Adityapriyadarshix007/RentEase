# RentEase – Furniture & Appliance Rental Platform

## Project Overview

RentEase is a full-stack web application developed to simplify the process of renting furniture and home appliances online. It is designed for students, working professionals, and individuals who need products for temporary use without making a large upfront purchase.

Many people relocate for education, internships, or jobs and often require essential products such as beds, study tables, chairs, refrigerators, washing machines, and other household items for a limited period. Buying these products for short-term use can be expensive and inconvenient.

RentEase solves this problem by providing a rental-based digital platform where users can browse products, select rental duration, place orders, track rentals, and raise maintenance requests when needed.

The project demonstrates practical full-stack development skills including frontend development, backend API creation, authentication, database management, and scalable project structuring.

---

## Problem Statement

People staying temporarily in a city often struggle to arrange furniture and appliances. Purchasing products for short durations leads to unnecessary expenses, transportation issues, and resale difficulties.

There is a need for an online platform where users can rent products monthly according to their needs conveniently and affordably.

---

## Objectives

- Provide an online rental platform for furniture and appliances.
- Reduce the financial burden of purchasing expensive products.
- Offer flexible rental durations.
- Build a secure and smooth booking system.
- Create an admin dashboard for management.
- Demonstrate real-world MERN stack implementation.

---

## Main Features

### User Features

- User registration and login
- JWT-based authentication
- Browse all rental products
- Search and filter products
- View detailed product information
- Add and remove items from cart
- Select rental duration
- Place rental orders
- Track active and completed rentals
- Raise maintenance requests
- Manage user profile

### Admin Features

- Dashboard with analytics
- Product management (Add / Edit / Delete)
- Category management
- Order management
- User management
- Complaint/support ticket management
- Revenue and usage insights

---

## Technology Stack

### Frontend

- React.js
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- Chart.js

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

---

## Database Collections

- Users
- Products
- Categories
- Orders
- Rentals
- Maintenance Requests

---

###Installation & Setup

Prerequisites

Install the following:

* Node.js
* npm
* MongoDB

###Clone Repository

git clone https://github.com/yourusername/rentease.git
cd rentease

##Backend Setup

cd backend
npm install
npm run dev

##Frontend Setup

cd frontend
npm install
npm start


##Environment Variables

Create a .env file inside the backend folder:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/rentease
JWT_SECRET=your_secret_key


Challenges Faced During Development

* Managing frontend and backend authentication flow
* Designing MongoDB schema relationships
* Handling cart state and rental duration logic
* Updating rental order statuses
* Solving CORS and deployment issues
* Creating responsive UI across devices


What I Learned

* React component architecture
* REST API development
* MongoDB schema design
* JWT authentication
* Protected routes
* State management
* CRUD operations
* Full-stack deployment workflow

⸻

Current Limitations

* Payment gateway not integrated yet
* Live order tracking unavailable
* Email notifications can be improved
* Multi-city inventory system not implemented

⸻

Future Enhancements

* Razorpay / Stripe integration
* Mobile application
* AI-based product recommendations
* Subscription rental plans
* Live chat support
* Real-time delivery tracking

⸻

Live Demo Link:- 

Screenshots

Home Page


<img width="1512" height="827" alt="Screenshot 2026-05-08 at 8 01 38 PM" src="https://github.com/user-attachments/assets/8edf2cb8-8a4a-4b44-aff2-3f13d6a1c275" />



Product Listing


<img width="1512" height="827" alt="Screenshot 2026-05-08 at 8 04 59 PM" src="https://github.com/user-attachments/assets/8e317d17-ae88-4b99-abe6-585581607474" />



Cart Page


<img width="1512" height="827" src="https://github.com/user-attachments/assets/814bdd17-8990-43c9-b103-9d8c1a24f128" />


Admin Dashboard


<img width="1512" height="827" src="https://github.com/user-attachments/assets/b6bc3e89-e332-4c28-992c-e067f953670e" />


Why This Project Matters

RentEase solves a practical, real-world problem for students and temporary residents by making essential household products accessible without ownership costs.

It also demonstrates the ability to build business-oriented full-stack web applications using modern technologies.

Author

Aditya Priyadarshi

⸻

License

Developed for academic learning and portfolio purposes.

