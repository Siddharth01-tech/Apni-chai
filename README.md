# Apni Chai

> **Tagline:** Har Cup Mein Apnapan.  
> **Project Type:** Chai Delivery Platform  

Apni Chai is a full-stack chai delivery platform built with the MERN stack, featuring online ordering, secure payments, live delivery tracking, and ML-powered chai recommendations.

---

## 🍵 Overview

**Apni Chai** brings the authentic warmth and comforting aroma of slow-simmered, freshly brewed Indian chai right to your doorstep. Designed with a warm, editorial aesthetic and powered by a modern tech stack, Apni Chai enables customers to discover handcrafted teas, personalize each cup to their exact taste preferences, and receive real-time updates as their chai is delivered fresh.

---

## ✨ Features

- **Artisanal Chai Menu:** Explore a curated collection of classic and signature teas including *Adrak Chai*, *Elaichi Chai*, *Masala Chai*, *Kesar Chai*, *Kulhad Chai*, and *Cutting Chai*.
- **Deep Customization:** Tailor every cup with custom sweetness levels, milk bases (Dairy, Oat, Almond), spice strength, and serving sizes (Cutting, Regular, Kulhad, Flask).
- **Secure Authentication & Quick OTP Login:** Dual authentication workflow supporting email/password and phone/email one-time passwords (OTP).
- **Cart & Order Management:** Smooth ordering experience with real-time cart synchronization, address management, and order placement.
- **Payment Gateway Integration:** Secure online payment processing via Razorpay as well as Cash on Delivery (COD) options.
- **Live Delivery Tracking:** Real-time location and status updates powered by WebSockets (Socket.io).
- **ML-Powered Recommendations:** Smart recommendation microservice delivering personalized chai pairings and recommendations based on taste preferences and order history.
- **Editorial Responsive UI:** Premium, responsive design built with React 19, Tailwind CSS, and Playfair Display typography.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS v4, Lucide Icons
- **Typography:** Playfair Display & Inter (Google Fonts)
- **State Management:** React Context API (`AuthContext`)

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with HTTP-only cookies
- **Media Storage:** Cloudinary
- **Payments:** Razorpay
- **Real-Time:** Socket.io
- **Email:** Nodemailer

### ML Service
- **Service:** Chai recommendation & similarity scoring microservice

---

## 📁 Project Structure

```text
Apni-chai/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Cloudinary, Email, Socket configs
│   │   ├── controllers/     # Auth, Cart, Order, Product, User, OTP controllers
│   │   ├── middleware/      # Auth, Admin, Upload, Delivery middlewares
│   │   ├── models/          # Mongoose data schemas
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # ML recommendation client service
│   │   ├── sockets/         # Real-time delivery tracking handlers
│   │   └── utils/           # Helper utilities & token generators
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/              # Favicon, icons, and static assets
│   ├── src/
│   │   ├── assets/          # Editorial photography & imagery
│   │   ├── components/      # Navbar, Footer, ProductCard, SectionHeading
│   │   ├── context/         # AuthContext and custom auth hooks
│   │   ├── data/            # Curated artisanal chai product data
│   │   └── pages/           # Home, Menu, ProductDetail, Auth
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- MongoDB Atlas account or local MongoDB instance

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure your environment variables in `backend/.env`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
COOKIE_SAME_SITE=lax
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend server:

```bash
npm run dev
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Configure environment variables in `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000/api/v1
```

Start the Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

*Apni Chai — Har Cup Mein Apnapan.*
