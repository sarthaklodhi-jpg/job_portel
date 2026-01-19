import cloudinary from "./cloudinary.js";

export const attachResumeDownloadUrl = (user) => {
  if (!user?.profile?.resume) return user;

  const resumeDownloadUrl = cloudinary.url(user.profile.resume, {
    resource_type: "raw",
    attachment: user.profile.resumeOriginalName, // ⭐ filename enforced
  });

  return {
    ...user,
    profile: {
      ...user.profile,
      resumeDownloadUrl,
    },
  };
};
