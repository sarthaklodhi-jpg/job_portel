const normalizeResumeUrl = (url) => {
  if (!url) return "";
  return url.replace("/api/users/", "/api/v1/users/");
};

export const getResumeUrl = (profile) => {
  // Prefer a view URL for opening in a new tab, then fall back to direct
  // secure URL or download URL.
  const url = profile?.resumeViewUrl || profile?.resumeUrl || profile?.resumeDownloadUrl || "";
  return normalizeResumeUrl(url);
};

export const getResumeDownloadUrl = (profile) => {
  // Prefer a dedicated download URL that sets content-disposition, then
  // fall back to other available URLs.
  const url = profile?.resumeDownloadUrl || profile?.resumeUrl || profile?.resumeViewUrl || "";
  return normalizeResumeUrl(url);
};

export const getResumeName = (profile) => {
  const originalName = profile?.resumeOriginalName || "resume.pdf";
  return /\.[a-zA-Z0-9]+$/.test(originalName) ? originalName : `${originalName}.pdf`;
};

export const openResume = (profile) => {
  const url = getResumeUrl(profile);
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
};

export const downloadResume = async (profile) => {
  const url = getResumeDownloadUrl(profile);
  if (!url) return;

  const filename = getResumeName(profile);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Resume download failed");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
