# BookNest - Online Book Store

A full-stack online book store built with the MERN stack as a college portfolio project. Users can browse and buy books with Cash on Delivery or a demo payment option, and an admin can manage books and orders. There is no real payment gateway.

## Features

**User**
- Register, login and logout (JWT, login persists after refresh)
- Browse all books, search by title or author, filter by category
- View book details
- Add to cart, change quantity, remove items, see cart total
- Checkout with shipping address and payment method
- View previous orders and profile

**Admin**
- Login with an admin account
- Dashboard with basic counts
- Add, edit and delete books
- View all orders and update order status

## Tech Stack

- Frontend: React (Vite), React Router, Axios, plain CSS
- Backend: Node.js, Express 5, MongoDB, Mongoose
- Auth: JWT, bcryptjs (a pure JavaScript version of bcrypt, easier to install on any OS)

## Folder Structure

```
online-book-store/
  backend/
    config/db.js              MongoDB connection
    controllers/              Logic for auth, books, cart, orders
    middleware/               JWT protect, adminOnly, error handlers
    models/                   User, Book, Cart, Order schemas
    routes/                   Route files for each controller
    seed.js                   Adds sample users and books
    server.js                 App entry point
  frontend/
    src/
      components/             Navbar, Footer, BookCard, ProtectedRoute, Status
      context/                Auth, Cart and Toast state
      pages/                  All pages including admin pages
      services/               Axios instance and format helpers
      App.jsx                 Routes
      main.jsx                Entry point
      index.css               All styles
```

Vite needs the `.jsx` extension for files containing JSX, so the files are `App.jsx` and `main.jsx`.

## Installation

You need Node.js (v18 or newer) and MongoDB running locally (or a MongoDB Atlas connection string).

### Backend

```
cd backend
npm install
```

Create a `.env` file (copy `.env.example`), then add sample data and start the server:

```
npm run seed
npm run dev
```

The API runs on http://localhost:5000.

### Frontend

In a second terminal:

```
cd frontend
npm install
```

Create a `.env` file (copy `.env.example`), then:

```
npm start
```

The app opens at http://localhost:3000.

## Environment Variables

Backend `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bookstore
JWT_SECRET=change_this_to_a_long_random_string
```

Frontend `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

## Demo Accounts (created by `npm run seed`)

| Role  | Email               | Password |
|-------|---------------------|----------|
| Admin | admin@bookstore.com | admin123 |
| User  | user@bookstore.com  | user123  |

Running the seed script again deletes all existing users, books, carts and orders and recreates the sample data. New registrations are always normal users.

## API Overview

| Method | Endpoint                 | Access | Description                       |
|--------|--------------------------|--------|-----------------------------------|
| POST   | /api/auth/register       | Public | Create account                    |
| POST   | /api/auth/login          | Public | Login, returns token              |
| GET    | /api/auth/profile        | User   | Logged in user's details          |
| GET    | /api/books               | Public | List books (`search`, `category`, `sort`, `limit`) |
| GET    | /api/books/categories    | Public | List categories                   |
| GET    | /api/books/:id           | Public | Single book                       |
| POST   | /api/books               | Admin  | Add book                          |
| PUT    | /api/books/:id           | Admin  | Edit book                         |
| DELETE | /api/books/:id           | Admin  | Delete book                       |
| GET    | /api/cart                | User   | Get cart                          |
| POST   | /api/cart                | User   | Add book (`bookId`, `quantity`)   |
| PUT    | /api/cart/:bookId        | User   | Set quantity                      |
| DELETE | /api/cart/:bookId        | User   | Remove book                       |
| POST   | /api/orders              | User   | Place order from cart             |
| GET    | /api/orders/my           | User   | Own orders                        |
| GET    | /api/orders              | Admin  | All orders                        |
| PUT    | /api/orders/:id/status   | Admin  | Update order status               |

Protected routes expect the header `Authorization: Bearer <token>`.

## How It Works

- Login returns a JWT. The frontend saves the user and token in localStorage and Axios attaches the token to every request.
- `protect` middleware verifies the token and loads the user. `adminOnly` checks the role.
- Prices in the order are copied from the book at checkout time, so later price changes do not affect old orders.
- Placing an order checks stock, reduces stock, saves the order and empties the cart.
- Express 5 sends errors from async functions to the error middleware automatically, so controllers do not need try/catch blocks.

## Future Improvements

- Order cancellation that restores stock
- Book reviews and ratings by users
- Pagination on the books page
- Profile editing and password change
- Image upload instead of image URLs
- Real payment gateway
- Automated tests
