import cloudinary from "./cloudinary.js";

export const attachResumeDownloadUrl = (user) => {
  try {
    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;

    if (!user?.profile?.resume || !cloudName) {
      return user;
    }

    const resumeDownloadUrl = cloudinary.url(user.profile.resume, {
      resource_type: "raw",
      secure: true,
      attachment: user.profile.resumeOriginalName || "resume",
    });

    return {
      ...user,
      profile: {
        ...user.profile,
        resumeDownloadUrl,
      },
    };
  } catch (error) {
    console.error("attachResumeDownloadUrl error:", error.message);
    return user;
  }
};
