# Authentication App

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Environment Setup](#environment-setup)
  - [Development with Docker](#development-with-docker)
  - [Development without Docker](#development-without-docker)
- [API Documentation](#api-documentation)
- [Authors](#authors)

---

## Introduction

A modern authentication application built with Typescript, Node.js, Express, and React. This application provides a robust authentication system with features like user registration, login, forgot password, password reset, and secure session management.

---

## Features

- User registration and login
- JWT-based authentication
- Email verification functionality
- Password reset functionality
- Secure session management
- Protected routes
- Form validation
- Responsive design
- Docker support for easy development
- TypeScript support for better type safety

---

## Tech Stack

#### Backend

- Node.js & Express.js
- TypeScript
- JWT Authentication
- MongoDB with Mongoose
- Nodemon for development

#### Frontend

- React with Vite
- TypeScript
- Axios for API requests
- React hook form for form validation
- TailwindCSS for styling
- Zustand for state management
- Lucide react for react icons
- Framer-motion for animation

---

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized development)
- MongoDB (if running locally)

---

## Getting Started

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/Santos2175/auth-app.git
cd auth-app
```

2. Create environment files:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

3. Update the environment variables in both `.env` files with your configuration.

- Backend Environment Variables

```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# BREVO MAIL SERVER SETUP
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

EMAIL_FROM=
EMAIL_ADDRESS=

# CLIENT URL
CLIENT_URL=<your_frontend_url> e.g. http://localhost:5173
```

- Frontend Environment Variables

```
VITE_BASE_URL="http://localhost:5000/"
```

### Development with Docker

1. Build and start the containers:

```bash
docker-compose up --build -d
```

2. Access the applications:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Development without Docker

#### Backend Setup

```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## API Documentation

### Authentication Endpoints

#### Register User

- **POST** `/api/auth/signup`
- **Body**: `{ "email": "user@example.com", "password": "password123", "name":"user123" }`

#### Login

- **POST** `/api/auth/login`
- **Body**: `{ "email": "user@example.com", "password": "password123" }`

#### Verify Email

- **POST** `/api/auth/verify-email`
- **Body**: `{ "code":"512589"}`

#### Forgot Password

- **POST** `/api/auth/forgot-password`
- **Body**: `{ "email": "user@example.com" }`

#### Password Reset

- **POST** `/api/auth/reset-password/:token`
- **Body**: `{ "password":"password1234" }`

---

## Authors

- Santosh Gurung
