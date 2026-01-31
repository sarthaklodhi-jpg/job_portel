// backend/utils/resume.js
import cloudinary from "./cloudinary.js";

export const attachResumeDownloadUrl = (user) => {
  try {
    // 🛑 HARD GUARDS — login must NEVER fail
    if (
      !user?.profile?.resume ||
      !process.env.CLOUD_NAME
    ) {
      return user;
    }

    const resumeDownloadUrl = cloudinary.url(
      user.profile.resume,
      {
        resource_type: "raw",
        secure: true,
        attachment: user.profile.resumeOriginalName,
      }
    );

    return {
      ...user,
      profile: {
        ...user.profile,
        resumeDownloadUrl,
      },
    };
  } catch (error) {
    console.error("attachResumeDownloadUrl error:", error.message);
    return user; // 👈 NEVER crash login
  }
};
