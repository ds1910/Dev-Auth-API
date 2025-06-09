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

## 🚀 Features

- ✅ **User Signup & Login**
- ✅ **Logout** with refresh token invalidation
- ✅ **JWT Authentication**
  - Access tokens (short-lived)
  - Refresh tokens (long-lived)
- ✅ **Password Hashing** with `bcrypt`
- ✅ **Forgot Password**
  - Sends email with secure reset link
  - Reset password via token
- ✅ **Secure Email Delivery** using `Nodemailer`
- ✅ **Email Verification on Signup** *(optional)*
- ✅ **Secure Reset Tokens** with `crypto` (auto-expire)
- ✅ **Scalable & Clean Code Architecture**
- ✅ **Role-based Access** (easily extendable)
- ✅ Built to follow **OWASP** security guidelines

---

## 🛠 Tech Stack

| Category      | Technology          |
|---------------|---------------------|
| Language      | JavaScript (Node.js)|
| Framework     | Express.js          |
| Database      | MongoDB (Mongoose)  |
| Auth Tokens   | JWT (Access/Refresh)|
| Email Service | Nodemailer          |
| Hashing       | bcrypt              |
| Token Gen     | crypto              |
| Env Config    | dotenv              |

---



