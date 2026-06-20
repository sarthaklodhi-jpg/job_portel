import cloudinary from "./cloudinary.js";

const getCloudName = () => process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;

export const attachResumeDownloadUrl = (user, baseUrl) => {
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

    // If a server `baseUrl` is provided, build a proxied download URL that
    // points to our backend route which will stream the file with the
    // appropriate `Content-Disposition` header and filename. This ensures the
    // browser saves the correct filename and content.
    let resumeDownloadUrl = resumeViewUrl;
    if (baseUrl && user.profile.resume) {
      const filename = encodeURIComponent(user.profile.resumeOriginalName || "resume.pdf");
      resumeDownloadUrl = `${baseUrl}/api/v1/users/resume/download?public_id=${encodeURIComponent(
        user.profile.resume
      )}&filename=${filename}`;
    } else {
      // Fallback: attempt Cloudinary attachment URL
      try {
        if (user.profile.resume) {
          const attachmentName = user.profile.resumeOriginalName || "resume";
          resumeDownloadUrl = cloudinary.url(user.profile.resume, {
            resource_type: "raw",
            secure: true,
            flags: "attachment",
            attachment: attachmentName,
          });
        }
      } catch (err) {
        console.warn("resumeDownloadUrl build failed:", err.message);
        resumeDownloadUrl = resumeViewUrl;
      }
    }

    return {
      ...user,
      profile: {
        ...user.profile,
        resumeViewUrl,
        resumeDownloadUrl,
      },
    };
  } catch (error) {
    console.error("attachResumeDownloadUrl error:", error.message);
    return user;
  }
};
