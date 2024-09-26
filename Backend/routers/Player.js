import { Router } from "express";
import { PlayerUser } from "../Models/PlayerUser.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizePlayer } from "../middlewares/roleCheck.js";

const router = Router();

router.get("/allUsers", verifyToken, authorizePlayer, async (req, res) => {
  try {
    const players = await PlayerUser.find().exec();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/userdetails", verifyToken, authorizePlayer, async (req, res) => {
  try {
    console.log("i'm at userdetails");

    // const user = await PlayerUser.findById(req.user.userId).populate(
    //   "subscribedCoaches"
    // ); // Assuming subscribedCoaches is an array of coach IDs or objects
    const user = await PlayerUser.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user._id,
      PlayerName: user.UserName,
      PlayerEmail: user.Email,
      PlayerLevel: user.Level,
      PlayerPassword: user.Password
      
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
  authorizePlayer,
  async (req, res) => {
    const profileId = req.user.userId;
    console.log(profileId);
    console.log("Updation route is getting hit");
    const updatedValues = req.body;
    console.log(updatedValues);
    try {
      // Update the profile using the CompanyUser model
      const updatedUser = await PlayerUser.findByIdAndUpdate(
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

router.get("/findplayer", verifyToken, authorizePlayer, async (req, res) => {
  console.log("Enter getting company details");
  try {
    const user = await PlayerUser.findById(req.query._id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      PlayerName: user.PlayerName,
      PlayerEmail: user.PlayerEmail,
      PlayerLevel: user.PlayerLevel,
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
