const express = require("express");
const USER = require("../model/user");
const {
  handleUserSignup,
  handleUserLogin,
  handleGetSignup,
  handleGetLogin,
  handleLogout,
  handelForgotPassword,
  handleResetPassword,
  //handlerefreshTokenRoute,
} = require("../controller/user");

const router = express.Router();


// Signup Route (POST for API / GET for HTML page)
router.route("/signup")
  .post(handleUserSignup)
  .get(handleGetSignup);


// Login Route (POST for API / GET for HTML page)
router.route("/login")
  .post(handleUserLogin)
  .get(handleGetLogin);


// LOGOUT route  
router.post("/logout", handleLogout);


// forgot password route  
router.post("/forgotPassword", handelForgotPassword);

router.post("/resetPassword", handleResetPassword);




// [INFO] Route to handle manual refresh token logic.
// Useful in frontend-heavy apps (React, Vue, etc.) to get new access tokens when expired.
// Frontend should call this when receiving 401 due to token expiry.
// Remove if using backend middleware-based auto-refresh.

// router.get("/refresh", handlerefreshTokenRoute);


module.exports = router;
