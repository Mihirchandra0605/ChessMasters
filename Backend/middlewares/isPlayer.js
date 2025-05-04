import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import { jwtSecretKey } from "../config.js";

export const isPlayer = async (req, res, next) => {
  try {
    const token = req.cookies.authorization || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "No token provided." });

    const decoded = jwt.verify(token, jwtSecretKey);
    const user = await UserModel.findById(decoded.userId);

    if (!user || user.Role !== "player") {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    req.userId = user._id;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error from token" });
  }
};
