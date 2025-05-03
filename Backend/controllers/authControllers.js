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
    console.log("Fetching user details...");
    console.log("Request cookies:", req.cookies);
    console.log("Request headers:", req.headers);

    // Check if we already have a parsed user from middleware
    if (req.user && req.user.id) {
      console.log("User already authenticated via middleware:", req.user);
      const user = await UserModel.findById(req.user.id).select("-Password");
      
      if (!user) {
        console.log("User not found in database:", req.user.id);
        return res.status(404).json({ message: "User not found." });
      }
      
      console.log("User found:", user._id);
      return res.status(200).json(user);
    }

    // If not, extract and verify the token manually
    let token = null;

    // Try to get token from authorization header
    if (req.headers.authorization) {
      if (req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      } else {
        token = req.headers.authorization;
      }
    } 
    // If not in header, try to get from cookies
    else if (req.cookies && req.cookies.authorization) {
      token = req.cookies.authorization;
      // Remove any trailing semicolons
      if (token.endsWith(';')) {
        token = token.slice(0, -1);
      }
      // Remove 'Bearer ' prefix if present
      if (token.startsWith('Bearer ')) {
        token = token.substring(7);
      }
    }

    console.log("Extracted token:", token ? "Token found" : "No token");

    if (!token) {
      return res.status(401).json({ message: "No token provided. Access denied." });
    }

    // Clean up the token if needed
    if (token.includes("Bearer ")) {
      token = token.split("Bearer ")[1];
    } else if (token.includes("=")) {
      token = token.split("=")[1];
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecretKey);
      console.log("Token decoded successfully:", decoded);
    } catch (error) {
      console.error("Token verification error:", error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token expired. Please login again." });
      }
      return res.status(401).json({ message: "Invalid token. Please login again." });
    }

    // For admin, just return acknowledgment
    if (decoded.role === "admin" || decoded.userId === "admin") {
      return res.status(200).json({ 
        _id: "admin",
        UserName: "Administrator",
        Email: "admin@example.com",
        Role: "admin"
      });
    }

    // For regular users, fetch from database
    const user = await UserModel.findById(decoded.userId).select("-Password");
    
    if (!user) {
      console.log("User not found in database after token verification:", decoded.userId);
      return res.status(404).json({ message: "User not found." });
    }

    console.log("User details fetched successfully:", user._id);
    return res.status(200).json(user);

  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
