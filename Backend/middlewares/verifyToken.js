import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config.js";

// Middleware to verify JWT token
export function verifyToken(req, res, next) {
  const token = req.cookies["authorization"];
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded; // Attach decoded token payload to request object
    next();
  });
}
