import jwt from "jsonwebtoken";
import UserModel  from "../models/userModel.js"; 
import { header } from "express-validator";

export const isCoach = async (req, res, next) => {
  try {
    const token = req.cookies.authorization || req.headers.token
    if (!token) return res.status(403).json({ message: "No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decoded.userId);
    // console.log(user.Role)
    if (!user || user.Role !== "coach") {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    req.userId = user._id; 

    next(); 
  } catch (error) {
    return res.status(500).json({ message: "Internal server error from token" });
  }
};
