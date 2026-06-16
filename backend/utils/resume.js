import cloudinary from "./cloudinary.js";

const getCloudName = () => process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;

export const attachResumeDownloadUrl = (user) => {
  try {
    const cloudName = getCloudName();

    if ((!user?.profile?.resume && !user?.profile?.resumeUrl) || !cloudName) {
      return user;
    }

    const resumeViewUrl =
      user.profile.resumeUrl ||
      cloudinary.url(user.profile.resume, {
        resource_type: "raw",
        secure: true,
      });

    return {
      ...user,
      profile: {
        ...user.profile,
        resumeViewUrl,
        // Kept for existing frontend code; downloads now use the original filename client-side.
        resumeDownloadUrl: resumeViewUrl,
      },
    };
  } catch (error) {
    console.error("attachResumeDownloadUrl error:", error.message);
    return user;
  }
};
