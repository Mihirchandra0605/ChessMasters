import { Router } from "express";
import { CoachUser } from "../Models/CoachUser.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { authorizeCoach, authorizePlayer } from "../middlewares/roleCheck.js";

const router = Router();

router.get("/allUsers", verifyToken, authorizeCoach, async (req, res) => {
  try {
    const coaches = await CoachUser.find().exec();
    res.status(200).json(coaches);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

//this route fetches the entire personal info of the coach when hit***********
router.get('/coaches/:id', verifyToken, authorizePlayer, async (req, res) => {
    try {
      const coach = await CoachUser.findById(req.params.id);
      if (!coach) {
        return res.status(404).json({ message: 'Coach not found' });
      }
      res.json(coach);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching coach profile' });
    }
  });


  //this route fetches list of all coaches*********
  router.get('/coaches', verifyToken, authorizeCoach, async (req, res) => {
    try {
      const coaches = await CoachUser.find({}, 'UserName Quote Rating Location');
      res.json(coaches);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching coaches' });
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


// this one is for subscribing to a particular coach**********
router.post('/coaches/:id/subscribe', verifyToken, authorizePlayer, async (req, res) => {
    try {
      const playerId = req.user.id; // Extracted from token
      const coachId = req.params.id;
  
      const coach = await CoachUser.findById(coachId);
      const player = await PlayerUser.findById(playerId);
  
      if (!coach || !player) {
        return res.status(404).json({ message: 'Player or Coach not found' });
      }
  
      // Add the player to the coach's SubscribedPlayers if not already subscribed
      if (!coach.SubscribedPlayers.includes(playerId)) {
        coach.SubscribedPlayers.push(playerId);
      }
  
      // Add the coach to the player's SubscribedCoaches if not already subscribed
      if (!player.SubscribedCoaches.includes(coachId)) {
        player.SubscribedCoaches.push(coachId);
      }
  
      await coach.save();
      await player.save();
  
      res.json({ message: 'Subscription successful' });
    } catch (err) {
      res.status(500).json({ message: 'Error subscribing to coach' });
    }
  });
  

export default router;
