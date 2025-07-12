# Fitbinary 🏋️‍♂️

**Fitbinary** is a modern, scalable **SaaS Gym Management Platform** designed for fitness centers, and gym chains. Built with **Next.js**, **Express.js**, **MongoDB**, and real-time technologies, this system provides a comprehensive solution to manage every aspect of gym operations—from memberships and payments to real-time notifications and staff management.

> 🔗 **Live **: [https://fitbinary.com/](https://fitbinary.com/)

---

## ✨ Key Features

### 👤 Multi-Tenant Management

* Host and manage multiple gyms (tenants) with isolated data
* Each tenant has its own dashboard, staff, members, and settings
* Scalable architecture with branch-level access and control

### ⛓️ Membership Management

* Add, edit, renew, and track memberships
* Track status: Active, Paused (Hold), Expired
* Automatic billing and PDF invoice generation with email delivery

### 📋 Billing & Invoicing

* Automatic invoice generation for services like memberships, lockers, personal training
* PDF invoices generated using Puppeteer
* Invoice records stored and emailed in real-time

### 🔈 Real-Time Notification System

* Admin & tenant level notification broadcasting via **Socket.IO**
* Role-based delivery (staff/admin)
* Unread/read tracking with status and priority

### 🕧 Locker Management

* Assign, free, and track locker usage
* Locker status (Available, Occupied)

### 🏋️ Staff Management

* QR-based staff attendance
* Role-based access (trainer, receptionist, admin)
* Task assignments and role definitions

### ⏱️ Member Attendance

* QR code sent on registration
* Real time location based attendance of staff and members
* Member scans QR for daily check-in
* Auto-logging with time tracking

### 👥 Role-Based Access Control

* Admin, Manager, Trainer, Receptionist, and Member access levels
* Access rules enforced on backend and frontend

### ⚖️ Robust Analytics & Reports

* Daily, weekly, monthly, and yearly revenue reports
* New vs Renewed vs Expired member insights
* Branch-wise performance comparison

### 📢 Notification Dashboard

* Mark as read
* View all
* Notification priority (High, Normal, Low)
* Notification actions with redirect URLs

### ✨ Onboarding Flow

* Step-by-step onboarding wizard for new tenants
* Ensure tenant provides org, staff, and branch data before activating

### 🏢 Branch Management

* Multi-branch handling within one tenant
* Assign staff, set capacities, and monitor individual branch performance

### 📧 Email Integration

* Email member on registration with QR
* Email invoice/receipt after every purchase

### 🚀 Future-Ready Design

* Designed to scale
* Modular services
* Real-time, cloud-ready, and production-hardened

---

## 📊 Technologies Used

### Frontend

* **Next.js** 15 with App Router
* **ShadCN UI**, **TailwindCSS**, **Lucide Icons**
* **Framer Motion** for animation
* **Redux Toolkit** for global state
* **React Query** for data fetching & caching

### Backend

* **Node.js**, **Express.js**
* **MongoDB + Mongoose**
* **Socket.IO** for real-time
* **JWT Authentication** (Token + Cookie based)
* **Puppeteer** for PDF generation

### DevOps & Hosting

* VPS

---

## 🔧 Installation Guide

### Prerequisites:

* Node.js >= 18
* MongoDB Atlas URI
* Cloudinary account
* Resend config 

### Clone and Install:

```bash
# Clone the repo
git clone https://github.com/NabarajBasnet/GymManagementFrontend.git
cd revive-fitness-system

# Install dependencies
npm install

# Setup environment variables (see below)
cp .env
```

---

## 🌐 Environment Variables

```env
# MONGODB
DATABASE_URI=

# AUTH
TOKEN_SECRET=


```

---

## 🔄 API Highlights

| Route                        | Method | Description                      |
| ---------------------------- | ------ | -------------------------------- |
| /api/auth/tenant/login       | POST   | Login for tenant                 |
| /api/members                 | POST   | Register new member              |
| /api/members/attendance      | POST   | Member QR attendance             |
| /api/staff/attendance        | POST   | Staff QR attendance              |
| /api/invoice                 | POST   | Generate invoice and email       |
| /api/notifications/get       | GET    | Fetch tenant notifications       |
| /api/notifications/read/\:id | PATCH  | Mark single notification as read |
| /api/notifications/bulk-read | PATCH  | Mark multiple notifications      |
 and many more
---

---

## 🚪 License

This project is **proprietary and protected** under Nabaraj Basnet. Contact for commercial use.

---
