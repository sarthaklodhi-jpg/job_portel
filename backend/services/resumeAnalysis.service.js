import { PDFParse } from "pdf-parse";
import cloudinary from "../utils/cloudinary.js";
import { ApiError } from "../middlewares/errorHandler.js";
import { Job } from "../models/job.model.js";
import { generateResumeAnalysis } from "../utils/aiClient.js";

const MAX_RESUME_BYTES = 10 * 1024 * 1024;
const MAX_RESUME_TEXT_CHARS = 30000;

const normalizeList = (value) =>
  Array.isArray(value)
    ? value
        .map((item) => String(item || "").trim())
        .filter(Boolean)
        .slice(0, 20)
    : [];

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getResumeUrl = (profile = {}) => {
  if (profile.resumeUrl) return profile.resumeUrl;

  if (profile.resume) {
    return cloudinary.url(profile.resume, {
      resource_type: "raw",
      secure: true,
    });
  }

  return "";
};

const safeJsonParse = (rawText = "") => {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new ApiError(502, "AI returned an invalid response. Please try again.");
    }

    try {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    } catch {
      throw new ApiError(502, "AI returned an invalid response. Please try again.");
    }
  }
};

const normalizeAnalysis = (analysis = {}) => ({
  resumeScore: Math.max(0, Math.min(100, Number(analysis.resumeScore) || 0)),
  skills: normalizeList(analysis.skills),
  strengths: normalizeList(analysis.strengths),
  weaknesses: normalizeList(analysis.weaknesses),
  improvementTips: normalizeList(analysis.improvementTips),
  suggestedRoleKeywords: normalizeList(analysis.suggestedRoleKeywords),
});

const downloadResumePdf = async (resumeUrl) => {
  let parsedUrl;

  try {
    parsedUrl = new URL(resumeUrl);
  } catch {
    throw new ApiError(400, "Invalid resume URL");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new ApiError(400, "Invalid resume URL");
  }

  try {
    const response = await fetch(resumeUrl);

    if (!response.ok) {
      throw new ApiError(502, "Unable to download resume");
    }

    const contentLength = Number(response.headers.get("content-length") || 0);
    if (contentLength > MAX_RESUME_BYTES) {
      throw new ApiError(400, "Resume file is too large to analyze");
    }

    const contentType = response.headers.get("content-type") || "";
    const buffer = Buffer.from(await response.arrayBuffer());

    if (buffer.length > MAX_RESUME_BYTES) {
      throw new ApiError(400, "Resume file is too large to analyze");
    }

    if (!contentType.includes("pdf") && buffer.subarray(0, 4).toString() !== "%PDF") {
      throw new ApiError(400, "Resume analysis currently supports PDF resumes only");
    }

    return buffer;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error("Resume download failed:", error);
    throw new ApiError(502, "Unable to download resume");
  }
};

const extractPdfText = async (buffer) => {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    const text = String(result.text || "").trim();

    if (!text) {
      throw new ApiError(400, "Could not extract text from resume PDF");
    }

    return text.slice(0, MAX_RESUME_TEXT_CHARS);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error("Resume PDF parsing failed:", error);
    throw new ApiError(400, "Could not parse resume PDF");
  } finally {
    await parser.destroy();
  }
};

const findRecommendedJobs = async (analysis) => {
  const terms = [...analysis.skills, ...analysis.suggestedRoleKeywords]
    .map((term) => term.toLowerCase())
    .filter((term, index, list) => term.length > 1 && list.indexOf(term) === index)
    .slice(0, 15);

  if (terms.length === 0) return [];

  const regexes = terms.map((term) => new RegExp(escapeRegex(term), "i"));
  const searchableFields = ["title", "description", "requirements"];
  if (Job.schema.path("skills")) searchableFields.push("skills");
  if (Job.schema.path("industry")) searchableFields.push("industry");

  const orFilters = regexes.flatMap((regex) =>
    searchableFields.map((field) => ({ [field]: regex }))
  );

  return Job.find({ $or: orFilters })
    .populate({ path: "company" })
    .sort({ createdAt: -1 })
    .limit(12);
};

export const screenResumeForUser = async (user) => {
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resumeUrl = getResumeUrl(user.profile);
  if (!resumeUrl) {
    throw new ApiError(400, "Please upload a resume before running AI analysis");
  }

  const pdfBuffer = await downloadResumePdf(resumeUrl);
  const resumeText = await extractPdfText(pdfBuffer);
  const rawAnalysis = await generateResumeAnalysis(resumeText);
  const analysis = normalizeAnalysis(safeJsonParse(rawAnalysis));
  const recommendedJobs = await findRecommendedJobs(analysis);

  return {
    analysis,
    recommendedJobs,
  };
};
