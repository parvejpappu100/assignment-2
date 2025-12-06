# 🚗 Vehicle Rental System Backend

**Live URL:** [https://assignment-2-gamma-one.vercel.app](https://assignment-2-gamma-one.vercel.app)

---

## 🎯 Project Overview

The **Vehicle Rental System** is a backend API built with Node.js and TypeScript for managing a vehicle rental business. The system provides:

- Vehicle inventory management with availability tracking
- Customer account management
- Booking creation, cancellation, and return processing
- Secure authentication with role-based access (Admin and Customer)
- Automatic rental cost calculation and vehicle status updates

The API is fully RESTful and follows modular, feature-based architecture for maintainability.

---

## 🛠️ Features

### **Authentication & Authorization**
- User signup and login with JWT authentication
- Password hashing using bcrypt
- Role-based access:
  - **Admin:** Manage vehicles, users, and all bookings
  - **Customer:** Manage own profile and bookings

### **Vehicles**
- Add, update, delete, and retrieve vehicles (Admin-only for management)
- Track availability (`available` or `booked`)
- Retrieve specific vehicle details

### **Users**
- Admin can view, update, and delete users
- Customers can update their own profiles
- Deletion constraints prevent removing users with active bookings

### **Bookings**
- Customers can create bookings; system calculates total price automatically
- Admins can mark bookings as returned
- Automatic vehicle availability updates for cancelled or returned bookings
- Role-based booking retrieval (Admin sees all, Customer sees own)

---

## 💻 Technology Stack

- **Backend:** Node.js + TypeScript + Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT + bcrypt
- **Deployment:** Vercel

---

## 📁 Code Structure

The codebase follows a modular, feature-based architecture:


- Modular design with routes, controllers, and services.
- Strict TypeScript typing for safety and maintainability.

---

## ⚡ Setup & Usage

### **Prerequisites**
- Node.js >= 18.x
- PostgreSQL database
- npm or yarn

### **Installation**

1. Clone the repository:
```bash
git clone <your-repo-url>
cd assignment-2

Install dependencies:

npm install


Configure environment variables:

cp .env.example .env
# Fill in your DB connection and JWT secret, e.g.
PORT=5000
CONNECTION_STR=postgresql://<username>:<password>@<host>/<db>?sslmode=require
JWT_SECRET="your_jwt_secret"


Start the development server:

npm run dev


The API will run on:

http://localhost:5000
