# QrCode Project

A full-stack application for QR code management and scanning, featuring user authentication, admin controls, and a modern frontend.

## Features

- User authentication (signup, login)
- Admin panel and protected routes
- QR code generation and scanning
- Role-based access (admin/user)
- Modern React frontend with Tailwind CSS
- Node.js/Express backend with MongoDB

## Project Structure

```
backend/   # Node.js, Express, MongoDB
frontend/  # React, Vite, Tailwind CSS
```

## Setup

### Backend

1. Install dependencies:
   ```
   cd backend
   npm install
   ```
2. Set up your `.env` file with MongoDB URI and JWT secret.
3. Seed users:
   ```
   node scripts/seedUsers.js
   node scripts/seedAdmin.js
   ```
4. Start the server:
   ```
   npm start
   ```

### Frontend

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```


## Environment Variables

Create a `.env` file in the root of the backend folder:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/QRcodeDB
JWT_SECRET=your_jwt_secret_key
```

- `PORT` — the port your Express server runs on
- `MONGODB_URI` — your MongoDB connection string (local or Atlas)
- `JWT_SECRET` — any secret string used to sign and verify JWT tokens, keep this private

## Scripts

- `backend/scripts/seedUsers.js` — Seed default users
- `backend/scripts/seedAdmin.js` — Seed an admin user

