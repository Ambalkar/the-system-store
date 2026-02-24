# MERN E-Commerce Project

A simple MERN stack e-commerce application with admin and store pages.

## Project Structure

```
MERN-Project/
├── backend/           # Express.js + MongoDB API
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── server.js     # Main server file
│   └── seed-admin.js # Admin user creation script
└── frontend/         # React + Vite
    └── src/
        ├── components/
        └── context/
```

## Features

- **Admin Page**: Add/delete products (requires admin login)
- **Store Page**: Browse products, add to cart, checkout
- **User Authentication**: Sign up and login with JWT
- **Role-based Access**: Separate admin and user roles
- **Dark/Light Mode**: Toggle in navbar
- **Shopping Cart**: Persistent cart with checkout

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (running locally or use MongoDB Atlas)

### Installation

1. **Backend Setup**
```
bash
cd backend
npm install
```

2. **Frontend Setup**
```
bash
cd frontend
npm install
```

### Running the Application

1. **Start Backend** (Terminal 1)
```
bash
cd backend
npm run dev
```
Backend runs on http://localhost:5000

2. **Start Frontend** (Terminal 2)
```
bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000

### Default Admin Credentials

The admin account is created automatically:
- **Email**: admin@example.com
- **Password**: admin123

### Creating Regular Users

1. Go to http://localhost:3000
2. Click "Sign Up" link
3. Enter name, email, password
4. Click Register

Regular users can browse the store and add items to cart, but cannot access the admin page.

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Admin
- `POST /api/admin/create-admin` - Create admin (requires secret key)

## Technologies Used

### Backend
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Context API for state management
