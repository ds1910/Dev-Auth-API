const fs = require("fs");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../../service/auth");

// Middleware to log request and response info
const logReqRes = (fileName) => {
  return (req, res, next) => {
    fs.appendFile(
      fileName,
      `\n${Date.now()} - ${req.method} - ${req.path}\n`,
      (err) => {
        if (err) {
          console.error("Error logging request:", err);
        }
        next();
      }
    );
  };
};

// Middleware to extract user from JWT and attach to req.user
//
// [INFO] Auth middleware with built-in auto-refresh using refresh token.
// If access token is expired, tries to verify refresh token and issue a new one.
// Ideal for server-rendered apps or protected backend routes.
// NOTE: If using frontend apps, prefer using `/refresh-token` route instead.

const checkAuthentication = (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  console.log("accessToken:", accessToken);
  console.log("refreshToken:", refreshToken);

  if (!accessToken) {
    // Try to refresh access token directly if it's missing
    if (!refreshToken) {
      return res.status(401).json({ message: "Access and Refresh Token Missing" });
    }

    try {
      const user = verifyRefreshToken(refreshToken);
      const newAccessToken = generateAccessToken({ id: user.id });
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000,
      });
      req.user = user;
      console.log("Access token was missing but renewed via refresh token");
      return next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid refresh token. Please login again." });
    }
  }

  // Access token is present, try to verify
  try {
    const decode = verifyAccessToken(accessToken);
    req.user = decode;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Try to refresh
      if (!refreshToken) {
        return res.status(403).json({ message: "Access expired and no refresh token found" });
      }

      try {
        const user = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken({ id: user.id });
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: 15 * 60 * 1000, 
        });
        req.user = user;
        console.log("Access token expired but refreshed");
        return next();
      } catch (refreshErr) {
        return res.status(403).json({ message: "Refresh token invalid or expired. Please login again." });
      }
    }

    return res.status(401).json({ message: "Invalid Access Token" });
  }
};


// Middleware to restrict routes to specific roles
const restrictTo = (roles = []) => {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");
    if (!roles.includes(req.user.role)) return res.end("Unauthorized");

    next();
  };
};

module.exports = {
  logReqRes,
  checkAuthentication,
  restrictTo,
};
