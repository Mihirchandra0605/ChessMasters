import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config.js";
import CoachDetails from "../models/CoachModel.js";

function generateToken(userId, role) {
  return jwt.sign({ userId, role }, jwtSecretKey, { expiresIn: "7d" });
}

export const registerUser = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { UserName, Email, Password, Role, Fide_id } = req.body;

    console.log("Role:", Role);
    const userExists = await UserModel.findOne({ Email });
    console.log("User exists:", userExists);
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    } else {
      console.log("User does not exist");
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = new UserModel({
      UserName,
      Email,
      Password: hashedPassword,
      Role,
    });

    await user.save();

    if (Role === "coach") {
      const coachDetails = new CoachDetails({
        user: user._id,
        Fide_id,
      });
      await coachDetails.save();
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = null;
    let isAdmin = false;

    // Admin login hardcoded (consider using ENV variables for better security)
    if (username === "admin" && password === "secret") {
      isAdmin = true;
    } else {
      user = await UserModel.findOne({ UserName: username });

      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const isMatch = await bcrypt.compare(password, user.Password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
    }

    // Generate JWT with appropriate payload
    const payloadId = isAdmin ? "admin" : user._id;
    const role = isAdmin ? "admin" : user.Role;
    const token = generateToken(payloadId, role);

    // Set token in a secure cookie
    res.cookie("authorization", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // Optional: 7 days
    });

    return res.status(200).json({
      message: "Signed in successfully",
      userType: role,
      token, // Optional to send, since it's stored in cookie
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  // Clear authorization cookie
  res.clearCookie("authorization");
  return res.status(200).json({ message: "Logged out successfully" });
};

export const editDetails = async (req, res) => {
  const { email, userData } = req.body;

  try {
    const user = await UserModel.findOneAndUpdate({ Email: email }, userData, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User details updated successfully", user });
  } catch (error) {
    res.status(400).send({ message: "Error updating details", error });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const token = req.cookies.authorization || req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: "No token provided." });

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecretKey);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(500).json({ message: "Invalid token" });
    }

    if (decoded.role === "admin") {
      return res.status(200).json({ message: "Admin access granted." });
    }

    const user = await UserModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
