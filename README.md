Vehicle Rental System (Backend)

A backend API for managing vehicle rentals, users, bookings, authentication, and admin operations.

🔗 Live URL:
https://assignment-2-gamma-one.vercel.app

🚀 Features
🔐 Authentication

User registration & login

JWT-based authentication

Encrypted passwords with bcrypt

Role-based access (Admin & Customer)

🧑‍💼 User Management

Register users

Login users

Access protected routes based on roles

🚘 Vehicle Management

Add, update, delete vehicles (Admin)

Add vehicle details (type, price, availability)

📅 Booking Management

Create booking (Customer & Admin)

Retrieve all bookings (Admin)

Retrieve own bookings (Customer)

Update booking status

Total price calculation

🛡 Protected Endpoints

All sensitive routes require:

Authorization: Bearer <token>

🛠 Technology Stack
Category	Technology
Runtime	Node.js + TypeScript
Framework	Express.js
Database	PostgreSQL
Auth	jsonwebtoken (JWT)
Security	bcrypt
Deployment	Vercel
📦 Installation & Setup
1. Clone the repository
git clone <your_repo_url>
cd vehicle-rental-system-backend

2. Install dependencies
npm install

3. Create environment variables

Create a .env file in the root directory:

DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
PORT=5000

4. Run database migrations (if any)

If you're using SQL scripts:

npm run migrate

5. Start the server
Development Mode:
npm run dev

Production Mode:
npm run build
npm start

🔗 API Usage
Authentication Header

For all protected routes, send:

Authorization: Bearer <token>

Login to receive token
POST /auth/login


Returns:

{
  "token": "your_jwt_token",
  "user": { ... }
}

🧩 Project Structure
src/
│── config/
│── modules/
│   ├── auth/
│   ├── users/
│   ├── vehicles/
│   ├── bookings/
│── middleware/
│── app.ts
│── server.ts
