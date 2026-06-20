import asyncHandler from "../middlewares/asyncHandler.js";
import { User } from "../models/user.model.js";
import { screenResumeForUser } from "../services/resumeAnalysis.service.js";

export const screenResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.id).select("-password");
  const result = await screenResumeForUser(user);

  return res.status(200).json({
    success: true,
    analysis: result.analysis,
    recommendedJobs: result.recommendedJobs,
  });
});
