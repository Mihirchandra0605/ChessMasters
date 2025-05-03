import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config.js";

export const authMiddleware = (req, res, next) => {
  try {
    console.log("🔹 Checking authentication...");
    console.log("🔹 Request cookies:", req.cookies);
    console.log("🔹 Request headers:", req.headers);

    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies ? req.cookies.authorization : null;
    let token;

    // Try to get token from authorization header
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log("🔹 Token found in Authorization header");
    } 
    // If not in header, try cookies
    else if (cookieToken) {
      token = cookieToken;
      // Check if the cookie token has a semicolon at the end and remove it
      if (token.endsWith(';')) {
        token = token.slice(0, -1);
      }
      console.log("🔹 Token found in cookies");
    }

    if (!token) {
      console.error("❌ No token found in headers or cookies");
      return res.status(401).json({ message: "No token provided. Access denied." });
    }

    console.log("🔹 Raw token:", token);

    // Clean up the token if needed
    if (token.startsWith("Bearer ")) {
      token = token.split("Bearer ")[1];
    } else if (token.includes("=")) {
      token = token.split("=")[1];
    }

    console.log("🔹 Processed token:", token);

    try {
      const decoded = jwt.verify(token, jwtSecretKey);
      console.log("✅ Token decoded:", decoded);

      // Make sure we're consistent with the field names
      const userId = decoded.userId || decoded.id; 
      
      // Attach user object
      req.user = { 
        id: userId, 
        role: decoded.role 
      };
      
      // Also set userId for backward compatibility
      req.userId = userId;

      if (!req.user.id) {
        console.error("❌ Error: User ID missing in token.");
        return res.status(403).json({ message: "Invalid token: No user ID found." });
      }

      next();
    } catch (jwtError) {
      console.error("🔥 JWT verify error:", jwtError);
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token expired. Please login again." });
      }
      return res.status(403).json({ message: "Invalid token. Access denied." });
    }
  } catch (error) {
    console.error("🔥 General error in auth middleware:", error);
    res.status(500).json({ message: "Server error in authentication." });
  }
};

// Optional: Role-specific middleware
export const isCoach = (req, res, next) => {
  if (req.user && req.user.role !== 'coach') {
    return res.status(403).json({ message: "Access denied. Coach role required." });
  }
  next();
};

export const isPlayer = (req, res, next) => {
  if (req.user && req.user.role !== 'player') {
    return res.status(403).json({ message: "Access denied. Player role required." });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admin role required." });
  }
  next();
};