# MyShop – E-Commerce Website

MyShop is a full-stack e-commerce web application that allows users to browse products, search and filter products, add items to a cart, and place orders. It also provides an admin panel to manage products, categories, and customer orders.

## Features

### User Features
- User registration and login
- Browse products and view product details
- Search products by name
- Filter products by category and price range
- Sort products by price (low to high and high to low)
- Add products to the shopping cart
- Update product quantities in the cart
- Place orders through checkout
- View personal orders

### Admin Features
- Admin dashboard
- Add, update, and manage products
- Manage product categories
- View and manage customer orders

### Security
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes using authentication middleware
- Admin-only authorization
- Backend input validation

## Technologies Used

**Frontend**
- React
- JavaScript
- HTML
- CSS

**Backend**
- Node.js
- Express.js

**Database**
- MySQL

**Tools**
- Visual Studio Code
- Git and GitHub
- Postman

## Project Structure

```text
ecommerce-project/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── ...
│
├── ecommerse_frontend/
│   ├── public/
│   ├── src/
│   └── ...
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Rashmi-123666/MyShop.git
cd MyShop
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder and add the required environment variables:

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
PORT=your_backend_port
```

Use the actual variable names and values expected by your backend configuration.

Start the backend using the start command defined in `backend/package.json`.

### 3. Set up the frontend

Open a new terminal:

```bash
cd ecommerse_frontend
npm install
```

Start the frontend using the start command defined in `ecommerse_frontend/package.json`.

## Future Improvements

- Deploy the application online
- Improve the user interface
- Add payment gateway integration
- Add product reviews and ratings

## Author

Developed as a full-stack e-commerce project using React, Node.js, Express.js, and MySQL.

**GitHub Repository:** https://github.com/Rashmi-123666/MyShop