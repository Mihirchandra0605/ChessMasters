import  UserModel  from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config.js";
import  CoachDetails  from "../models/CoachModel.js";
import AdminModel from "../models/AdminModel.js";
function generateToken(userId, role) {
  return jwt.sign({ userId, role }, jwtSecretKey, { expiresIn: "1h" });
}

export const registerUser = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log request body to verify incoming data

    const { UserName, Email, Password, Role, Fide_id } = req.body;

    const userExists = await UserModel.findOne({ Email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

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

    const user = await UserModel.findOne({ UserName: username }) ;
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.Password);
    if (match) {
      const token = generateToken(user._id, user.Role);
      res.cookie("authorization", token);
      return res.status(200).json({
        message: "User signed in successfully",
        userType: user.Role,
        token
      });
    }

    res.status(401).send({ message: "Invalid UserName or password" });
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    // if (user.Role === "coach") {
    //   const coachDetails = await CoachDetails.findOne({ user: user._id }).populate("subscribers", "UserName Email");
    //   if (!coachDetails) {
    //     return res.status(404).json({ message: "Coach details not found." });
    //   }


    //   return res.status(200).json({ user, coachDetails });
    // }


    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

