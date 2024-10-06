# Gym Company Management Admin Dashboard

Welcome to the **Gym Company Management Admin Dashboard**. This project is built with **Next.js**, **MongoDB**, and various libraries to handle authentication, authorization, CRUD operations, and other features needed for efficient gym management.

### Live Demo
🔗 [Live Dashboard](https://nabarajdashboard.vercel.app/)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Authentication & Authorization**: Secure login with roles for Admin, Trainers, and Members using Auth0.
- **Dashboard**: Overview of gym statistics like memberships, classes, and income.
- **CRUD Operations**: Create, Read, Update, and Delete functionality for users, memberships, trainers, and schedules.
- **User Roles**: Differentiated access and features based on roles (Admin, Trainer, Member).
- **Class Scheduling**: Manage classes and assign trainers and members.
- **Membership Management**: Track member subscriptions, renewals, and payments.
- **Notification System**: Alerts for upcoming renewals, new sign-ups, and scheduled classes.
- **Responsive UI**: Works across all devices (mobile, tablet, desktop).
- **Security**: Data encryption, secure password storage (bcrypt), and protection against common vulnerabilities (CSRF, XSS).
- **Cloudinary Integration**: Manage media uploads for user avatars, gym images, etc.

## Technologies Used

- **Frontend**: 
  - [Next.js](https://nextjs.org/)
  - [ShadCN](https://shadcn.dev/) for accessible UI components
  - [Material UI](https://mui.com/) for a consistent design system
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [Framer Motion](https://www.framer.com/motion/) for animations
  - [React Hook Form](https://react-hook-form.com/) for form handling
  
- **Backend**:
  - [MongoDB](https://www.mongodb.com/) for database management
  - [Mongoose](https://mongoosejs.com/) for MongoDB object modeling
  - [Auth0](https://auth0.com/) for authentication and authorization
  - [JSON Web Tokens (JWT)](https://jwt.io/) for secure token-based authorization
  - [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing

- **State Management**:
  - [Redux Toolkit (RTK)](https://redux-toolkit.js.org/) for centralized state management

- **Media Management**:
  - [Cloudinary](https://cloudinary.com/) for storing and managing images

- **Other Libraries & Tools**:
  - [Axios](https://axios-http.com/) for HTTP requests
  - [Validator](https://www.npmjs.com/package/validator) for input validation
  - [Vercel](https://vercel.com/) for hosting

