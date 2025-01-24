import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config.js";

export const authMiddleware = (req, res, next) => {
  try {
    // Check for token in different places
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies.authorization;
    let token;

    // Extract token from Authorization header or cookie
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided. Access denied." });
    }

    // Verify the token
    const decoded = jwt.verify(token, jwtSecretKey);

    // Attach user information to the request object
    req.userId = decoded.userId;
    req.role = decoded.role; // Changed from userType to role to match token payload

    // Add user type check if needed
    if (!decoded.role) {
      return res.status(403).json({ message: "Invalid token: No role specified." });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error);
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
