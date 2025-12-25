// ==========================================
// 📂 FILE: middlewares/isAuthenticated.js
// ==========================================

import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // 3️⃣ Attach userId to request
    req.id = decoded.userId;

    // 4️⃣ Proceed to next middleware / controller
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default isAuthenticated;
