export function authorizePlayer(req, res, next) {
  if (req.user.userType !== "Player") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
}

export function authorizeCoach(req, res, next) {
  if (req.user.userType !== "Coach") {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
}

export function authorizeAdmin(req,res,next) {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ message: "Unauthorized "});
  }
  next();
}
