import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import { jwtSecretKey } from "../config.js"; 

export const isPlayer = async (req, res, next) => {
  try {
    // Check for token in cookies or headers
    const token = req.cookies.authorization || req.headers.authorization?.split(" ")[1];
    // console.log('token', token);

    if (!token) {
      return res.status(403).json({ message: "No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, jwtSecretKey);
    const user = await UserModel.findById(decoded.userId);
    // console.log('user', user);
    // console.log('user.Role', user.Role);
    if (!user || user.Role !== "player") {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    // Attach user information to the request object
    req.userId = user._id;
    next();
  } catch (error) {
    console.error("Error in token validation:", error);
    return res.status(500).json({ message: "Internal server error from token" });
  }
};
