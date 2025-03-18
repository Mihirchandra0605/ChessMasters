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
      Password,
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

    let user;
    let isAdmin = false;

    if (username === "admin"  && password === "secret" ) {
      // Check admin credentials (no bcrypt comparison, since password is plaintext in the DB)
      // user = await AdminModel.findOne({ UserName: username });
      // if (!user) {
      //   console.log("user not found")
      //   return res.status(401).json({ message: "Invalid admin credentials" });
      // }

      // if (password !== user.Password) {
      //   console.log("incorrect admin password");
      //   return res.status(401).json({ message: "Invalid admin credentials" });
      // }

      // Admin is authenticated
      isAdmin = true;
    } else {
      // Check regular user credentials (still use bcrypt for user)
      user = await UserModel.findOne({ UserName: username });
      if (!user) {
        return res.status(401).json({ message: "Invalid user credentials" });
      }

      const match = await bcrypt.compare(password, user.Password);
      if (!match) {
        return res.status(401).json({ message: "Invalid user credentials" });
      }
    }

    // Generate token based on user or admin role
    const token = generateToken(user ? user._id : "admin", isAdmin ? "admin" : user?.Role);
    res.cookie("authorization", token);

    return res.status(200).json({
      message: "Signed in successfully",
      userType: isAdmin ? "admin" : user?.Role,
      token,
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};


export const logout = (req, res) => {
  res.clearCookie("authorization") || req.cookie.token;
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
    const token = req.cookies.authorization || req.headers.token;
    if (!token) return res.status(403).json({ message: "No token provided." });

    const decoded = jwt.verify(token, jwtSecretKey);

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
