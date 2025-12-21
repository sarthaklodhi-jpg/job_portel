// ==========================================
// JWT Authentication Middleware
// Checks if the user is logged in by verifying the token
// Adds userId to req object for further use in protected routes
// ==========================================

import jwt from "jsonwebtoken";


const isAuthenticated = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false
      });
    }

    // 2️⃣ Verify the token using SECRET_KEY
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
        success: false
      });
    }

    // 3️⃣ Add userId from token to req object
    req.id = decoded.userId;

    // 4️⃣ Call next middleware / controller
    next();

  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      message: "Authentication failed",
      success: false
    });
  }
};

export default isAuthenticated;
