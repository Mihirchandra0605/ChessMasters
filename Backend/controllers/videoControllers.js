import Video from "../models/videoModel.js";

export const recordVideoView = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Add the view with timestamp
    video.views.push({
      user: userId,
      viewedAt: new Date()
    });

    await video.save();
    
    return res.status(200).json({ message: "View recorded successfully" });
  } catch (error) {
    console.error("Error recording video view:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getVideosByCoach = async (req, res) => {
  try {
    const { coachId } = req.params;
    const videos = await Video.find({ coach: coachId });
    return res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching coach videos:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};