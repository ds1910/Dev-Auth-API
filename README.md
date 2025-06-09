# 🔐 Auth Backend System

A **modular, secure, and production-ready authentication backend** built with **Node.js**, **Express**, and **MongoDB**. This system handles user registration, login, logout, email verification, password reset, and secure JWT-based session management.

It is designed to be **easily reusable in future projects** and follows **industry best practices** for scalability, security, and maintainability.

---

## 🎯 Project Goals

- ✅ Create a **secure and reusable** authentication backend that can be integrated into any frontend (React, Vue, Angular, etc.)
- ✅ Simplify auth logic to avoid rebuilding from scratch in every project
- ✅ Provide **email-based flows** like signup confirmation and password reset
- ✅ Use **JWT** (Access + Refresh) token mechanism for scalable authentication
- ✅ Modular, well-organized codebase for easy extension (OAuth, MFA, RBAC)

---

## 🗂 Project Structure

auth-backend/
  controllers/         # Business logic for signup, login, password reset, etc.
  models/              # Mongoose schemas (User, Token)
  routes/              # API route definitions
  middlewares/         # Auth middleware (JWT verification, role restriction)
  utils/               # Utility helpers (token generation, email sending)
  config/              # Configuration files (DB, environment)
  auth.js              # JWT token helpers and verification
  index.js             # Application entry point
  .env                 # Environment variables (not committed)
