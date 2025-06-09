// Essential requires
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
require('dotenv').config();

// Database requires
const USER = require("./model/user");

// Connection and middleware requires
const connectMongoDb = require("./connection");
const { logReqRes, checkAuthentication, restrictTo } = require("./middleware");

// App initialization
const app = express();
const port = process.env.PORT;

// Routers
const userRouter = require("./routes/user");
const testRouter = require("./routes/test");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logReqRes("log.txt"));
// app.use(checkAuthentication); // Enable this when authentication is required

// Connect to MongoDB
connectMongoDb("mongodb://127.0.0.1:27017/AuthAPI").then(() => {
  console.log("MongoDB connected");
});

// EJS setup for server-side rendering
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Routes
app.use("/user", userRouter);
app.use("/test",checkAuthentication, testRouter);

// Start server
app.listen(port, () => console.log("Server started"));
