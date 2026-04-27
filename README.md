# Saraha App (Full-Stack)

A complete full-stack web application built using **React (Vite) + Vanilla CSS Glassmorphism** for the Frontend and **Node.js + Express + MongoDB** for the Backend. 

This application allows users to register, create a secure profile, and share a personal link to receive totally anonymous, honest feedback from friends, colleagues, or anyone with the link.

## 🚀 Features

### **Frontend Features:**
- **Modern Premium UI**: Built with a custom Design System featuring a beautiful "Glassmorphism" deep dark mode, smooth gradient buttons, and micro-animations.
- **User Authentication**: Secure Sign-Up and Login forms with form validations and JWT stored in local storage. Auto-refresh tokens handled via Axios Interceptors.
- **Profile Dashboard**: View all received anonymous messages instantly. Includes a "Copy to Clipboard" feature for the shareable profile URL.
- **Public Message Portal**: Anyone can visit your unique URL and send a rich text message with up to 2 image file attachments completely anonymously.
- **Responsiveness**: Fully responsive layout tailored for Desktop, Tablet, and Mobile.
- **Toast Notifications**: Interactive toast alerts for success/failure feedback on UX actions seamlessly.

### **Backend Features:**
- **Express + Mongoose**: Scalable MVC (Model-View-Controller) architecture connecting to MongoDB.
- **Robust Security**: Protected with `helmet`, `cors`, and `express-rate-limit` to prevent brute-force attacks.
- **Authentication**: JWT token-based auth with `ACCESS_TOKEN` and `REFRESH_TOKEN` rotation strategy. Supports Google OAuth parsing architecture.
- **File Uploads**: Custom `multer` engine configuration to parse incoming `multipart/form-data` and securely store files locally in the `/uploads` directory.
- **Redis Integration**: Connected to Redis for potential fast caching or token management in advanced features.
- **Validation**: Strict schema validation at middleware level using `Joi`.

## 📂 Project Structure

```
Saraha-full_stack/
├── Backend/                 # Node.js + Express Backend Engine
│   ├── src/                 # Main Source Code
│   │   ├── DB/              # MongoDB and Redis connection
│   │   ├── modules/         # Business Logic (User, Auth, Message)
│   │   └── index.js         # Entry Point
│   ├── uploads/             # Locally stored User/Message attachments
│   └── package.json
└── Frontend/                # Vite + React Client
    ├── src/
    │   ├── api/             # Axios instance + Interceptors for Auth Handling
    │   ├── components/      # Reusable UI Blocks (Navbar, ProtectedRoutes)
    │   ├── context/         # React Context API (AuthContext)
    │   ├── pages/           # Application views (Home, Login, Dashboard, PublicProfile)
    │   ├── App.jsx          # Route Manager
    │   └── index.css        # Core Design System (Glassmorphism & tokens)
    └── package.json
```

## 🛠️ Usage Instructions

### 1. Running the Backend

Ensure you have **MongoDB** and **Redis** running locally (or update the backend configuration files to point to your cloud clusters).

```bash
cd Backend
npm install
npm run start:dev
```
The backend server will run on `http://localhost:3000`.

### 2. Running the Frontend

```bash
cd Frontend
npm install
npm run dev
```
The frontend Vite server typically runs on `http://localhost:5173`. Open this URL in the browser.

## 📦 Core Technologies

- **Frontend:** React.js, Vite, React Router DOM, Axios, Lucide React (Icons), React Hot Toast
- **Backend:** Node.js, Express, Mongoose (MongoDB), Redis, Multer, Joi, JSONWebToken, BcryptJS, Express-Rate-Limit

## 🔒 Security Practices Implemented
- Passwords are auto-hashed using `Bcrypt` before DB entry.
- File validation blocks unauthorized mime-types via Multer filters.
- API is protected against rapid requests using Rate-Limiting.
- The UI gracefully intercepts and renews tokens automatically upon expiration using `axios.interceptors.response`.
