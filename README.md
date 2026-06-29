# Money Services Management System (Backend)

## Overview

This repository contains the backend API for the Money Services Management System.

The backend is built using the MERN stack backend technologies and provides secure RESTful APIs for authentication, user management, branch operations, customer management, financial transactions, reporting, and email services.

---

## Backend Features

### Authentication

* JWT Authentication
* Password hashing
* Login & Logout
* Protected API routes
* Role-based authorization

### User Management

* User registration
* User roles
* User profile management
* Account activation
* Email confirmation

### Branch Management

* Branch CRUD operations
* Branch assignment
* Branch-specific access control

### Customer Management

* Customer registration
* Account holder management
* Customer information updates

### Currency Management

* Currency CRUD
* Exchange rate support
* Multi-currency operations

### Financial Operations

* Credit
* Debit
* Money Transfer
* Currency Exchange
* Balance calculations
* Transaction history

### Reporting

* Customer statements
* Branch-wise reports
* Currency-wise reports
* Transaction reports
* Financial reports
* Balance reports
* Exportable reports

### Additional Services

* Email notifications
* Printing support
* Data export
* Signature support
* Webcam support
* Audit-friendly transaction records

---

## Technology Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt
* Nodemailer
* Multer
* REST API
* Express Middleware
* CORS
* Morgan
* Dotenv

---

## API Features

* RESTful API architecture
* Secure authentication
* Authorization middleware
* Error handling
* Input validation
* Modular controllers
* Route separation
* Database abstraction using Mongoose

---

## Installation

```bash
git clone <repository-url>

cd backend

npm install

npm start
```

or

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_PASSWORD=your_password
```

---

## Project Architecture

```
Routes
Controllers
Models
Middleware
Services
Utilities
Database
Configuration
```

---

## Security

* JWT authentication
* Password hashing
* Protected routes
* Role-based authorization
* Secure API architecture

---

## License & Usage

Copyright © 2026 Zabeehullah Yadgar

This project is proprietary software.

This repository is published for portfolio demonstration and educational reference only.

You may:

* View the source code.
* Study the implementation.
* Reuse small portions of the code for learning purposes with proper attribution.

You may NOT:

* Copy the entire project.
* Reproduce the application.
* Redistribute the source code.
* Modify and republish the project.
* Sell any part of this software.
* Deploy this application for commercial or personal business use.
* Claim this work as your own.

No license is granted to use, reproduce, or distribute this software except for limited educational reference as described above.

All rights reserved.
