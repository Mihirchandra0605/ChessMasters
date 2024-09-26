import { Router } from "express";
import { CoachUser } from "../Models/CoachUser.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeCoach } from "../middlewares/roleCheck.js";

const router = Router();

router.get("/allUsers", verifyToken, authorizeCoach, async (req, res) => {
  try {
    const players = await CoachUser.find().exec();
    res.status(200).json(coaches);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/userdetails", verifyToken, authorizeCoach, async (req, res) => {
  try {
    console.log("i'm at userdetails");

    // const user = await PlayerUser.findById(req.user.userId).populate(
    //   "subscribedCoaches"
    // ); // Assuming subscribedCoaches is an array of coach IDs or objects
    const user = await CoachUser.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user._id,
      CoachName: user.UserName,
      CoachEmail: user.Email,
    //   CoachLevel: user.Level,
      CoachPassword: user.Password
      
      // subscribedCoaches: user.subscribedCoaches, // Include subscribed coaches in the response
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/updateuserdetails",
  verifyToken,
  authorizeCoach,
  async (req, res) => {
    const profileId = req.user.userId;
    console.log(profileId);
    console.log("Updation route is getting hit");
    const updatedValues = req.body;
    console.log(updatedValues);
    try {
      // Update the profile using the CompanyUser model
      const updatedUser = await CoachUser.findByIdAndUpdate(
        { _id: profileId },
        updatedValues
      );

      if (updatedUser) {
        res.status(200).send("Profile updated successfully");
      } else {
        res.status(404).send("Profile not found");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.get("/findcoach", verifyToken, authorizeCoach, async (req, res) => {
  console.log("Enter getting coach details");
  try {
    const user = await CoachUser.findById(req.query._id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      CoachName: user.UserName,
      CoachEmail: user.Email,
    //   PlayerLevel: user.PlayerLevel,
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
