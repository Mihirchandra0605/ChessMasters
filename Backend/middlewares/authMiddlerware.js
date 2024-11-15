import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config.js";

export const authMiddleware = (req, res, next) => {
  // Check for token in cookies or headers
  const token = req.cookies.authorization || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided. Access denied." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, jwtSecretKey);

    // Attach user information to the request object
    req.userId = decoded.userId;
    req.role = decoded.userType;
    
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Invalid token. Access denied." });
  }
};
