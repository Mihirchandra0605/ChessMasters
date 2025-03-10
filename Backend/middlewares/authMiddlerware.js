import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config.js";

export const authMiddleware = (req, res, next) => {
  try {
    console.log("🔹 Checking authentication...");

    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) {
      console.error("❌ No token found.");
      return res.status(401).json({ message: "No token provided. Access denied." });
    }

    console.log("🔹 Token found:", token);

    const decoded = jwt.verify(token, jwtSecretKey);
    console.log("✅ Token decoded:", decoded);

    // ✅ Attach user object properly
    req.user = { id: decoded.userId, role: decoded.role };

    if (!req.user.id) {
      console.error("❌ Error: User ID missing in token.");
      return res.status(403).json({ message: "Invalid token: No user ID found." });
    }

    next();
  } catch (error) {
    console.error("🔥 Token verification error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    res.status(403).json({ message: "Invalid token. Access denied." });
  }
};


// Optional: Role-specific middleware
export const isCoach = (req, res, next) => {
  if (req.role !== 'coach') {
    return res.status(403).json({ message: "Access denied. Coach role required." });
  }
  next();
};

export const isPlayer = (req, res, next) => {
  if (req.role !== 'player') {
    return res.status(403).json({ message: "Access denied. Player role required." });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admin role required." });
  }
  next();
};
