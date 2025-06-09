const USER = require("../model/user");
const resetTokenModel = require("../model/resetToken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt"); 

// Other files: Importing token generation and verification utilities
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../../service/auth");



const sendmailForSignup = async({to,name,loginURL}) =>{
try {
      const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Localhost ${process.env.PORT} <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome Message",
      html: `
        <div style="max-width: 640px; margin: 0 auto; padding: 32px 24px; background: linear-gradient(135deg, #e0f7ff, #f0fbff); border-radius: 16px; box-shadow: 0 8px 32px rgba(0, 123, 255, 0.12); font-family: 'Segoe UI', Helvetica, Arial, sans-serif;">

  <h1 style="color: #0056b3; font-size: 28px; text-align: center; margin-bottom: 16px;">
    🎉 Welcome, ${name}!
  </h1>

  <hr style="border: none; border-top: 1px solid #cce6ff; margin: 20px 0;">

  <p style="color: #333; font-size: 17px; text-align: center; line-height: 1.8; margin: 0 0 24px;">
    We're happy to have you here! 💙<br>
    Thanks for joining LOCALHOST. Your journey with us begins now!
  </p>

  <p style="color: #555; font-size: 16px; text-align: center; line-height: 1.7; margin: 0 0 32px;">
    We’ve made things simple and fun for you. Enjoy all the features made just for you. 😊
  </p>

  <blockquote style="font-style: italic; color: #666; text-align: center; font-size: 15px; margin: 0 0 32px;">
    "Let’s make something great together!" 🚀
  </blockquote>

  <div style="text-align: center;">
    <a href="${loginURL}" style="display: inline-block; background-color: #007bff; color: #fff; font-weight: 600; padding: 12px 28px; border-radius: 30px; text-decoration: none; font-size: 16px;">
      Login 🔐
    </a>
  </div>

  <p style="color: #888; font-size: 14px; text-align: center; margin-top: 28px;">
    Need help? Just reply to this email — we’re here for you. 💬
  </p>

  <p style="color: #444; font-size: 15px; text-align: center; margin-top: 20px;">
    — With love,<br><strong>The LOCALHOST Team 💙</strong>
  </p>

</div>

      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email failed to send");
  }


};




// ==========================================
// ========== Handle User Signup ============
// ==========================================
const handleUserSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log(req.body);

  try {
    await USER.create({ name, email, password });


    const loginURL =  `http://localhost:${process.env.PORT}/user/login`;
    sendmailForSignup({email,name,loginURL});

    if (req.is("application/json")) { 
      return res.status(201).json({ message: "Signup successful" });
    } else {
      return res.redirect("/signup");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong during signup" });
  }
};


// =========================================
// =========== Handle User Login ===========
// =========================================
const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await USER.findOne({ email });

  if (!user) {
    if (req.is("application/json")) {
      return res.status(401).json({ error: "Invalid email" });
    } else {
      return res.render("login", { error: "Invalid email" });
    }
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    if (req.is("application/json")) {
      return res.status(401).json({ error: "Invalid password" });
    } else {
      return res.render("login", { error: "Invalid password" });
    }
  }

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  // Set secure cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  if (req.is("application/json")) {
    return res.status(201).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } else {
    return res.redirect("/");
  }
};


// ==========================================================
// =============== Send Reset Link Email ====================
// ==========================================================
const sendEmail = async ({ to, resetLink }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Localhost ${process.env.PORT} <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Your Password",
      html: `
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center;">
            <h2 style="color: #2d3748;">🔐 Password Reset Request</h2>
          </div>
          <p style="color: #4a5568; font-size: 16px;">
            We received a request to reset your password. If this was you, click the button below to proceed.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="padding: 12px 24px; background-color: #3182ce; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="color: #718096; font-size: 14px;">
            This link is valid for <strong>15 minutes</strong>. If you didn’t request this, please ignore this email.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="text-align: center; font-size: 12px; color: #a0aec0;">
            © ${new Date().getFullYear()} Localhost ${process.env.PORT}. All rights reserved.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email failed to send");
  }
};


// ===========================================================
// =============== Handle Forgot Password ====================
// ===========================================================
const handelForgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if email exists in DB
  const user = await USER.findOne({ email });

  if (!user) {
    if (req.is("application/json")) {
      return res.status(401).json({ error: "Invalid email" });
    } else {
      return res.render("login", { error: "Invalid email" });
    }
  }

  // Generate token & hashed token
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // Save token to DB
  await resetTokenModel.create({
    email,
    resetToken: tokenHash,
    resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 mins expiry
  });

  const resetLink = `http://localhost:${process.env.PORT}/user/resetPassword?token=${token}`;

  await sendEmail({ to: email, resetLink });

  console.log("Reset email sent");
  return res.status(200).json({ message: "Reset email sent" });
};


// ===========================================================
// =============== Handle Reset Password =====================
// ===========================================================

const handleResetPassword = async (req, res) => {
  
  const token = req.query.token;
  const { newPassword } = req.body;

   
   console.log(token);
   console.log("newpasswrd",newPassword);
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
 
  // resetToken model used
  const tokenEntry = await resetTokenModel.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

   console.log("token searching done");
  // no token found
  if (!tokenEntry) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Now find the actual user
  const user = await USER.findOne({ email: tokenEntry.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update password securely
  console.log("New Password:", newPassword); 
  user.password = newPassword;
  await user.save();

  // Cleanup the token entry
  await resetTokenModel.deleteOne({ email: tokenEntry.email });

  return res.status(200).json({ message: "Password reset successful" });
};


// ==========================================
// ================ Logout ==================
// ==========================================
const handleLogout = (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logged out" });
};


// ==========================================
// ============ Render Pages ================
// ==========================================
const handleGetSignup = (req, res) => {
  return res.render("signup");
};

const handleGetLogin = (req, res) => {
  return res.render("login");
};


// ==========================================
// ============ Module Exports ==============
// ==========================================
module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleGetSignup,
  handleGetLogin,
  handleLogout,
  handelForgotPassword,
  handleResetPassword,
};
