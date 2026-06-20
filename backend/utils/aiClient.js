import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../middlewares/errorHandler.js";

const GEMINI_MODEL = "gemini-2.5-flash";

let client;

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new ApiError(500, "Gemini API key is not configured");
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  return client;
};

export const generateResumeAnalysis = async (resumeText) => {
  const ai = getGeminiClient();

  const prompt = `You are an experienced HR recruiter.

Analyze the following resume.

Return ONLY valid JSON.

{
  "resumeScore":0,
  "skills":[],
  "strengths":[],
  "weaknesses":[],
  "improvementTips":[],
  "suggestedRoleKeywords":[]
}

Analyze only the provided resume.

Do not include markdown.

Return JSON only.

Resume:
${resumeText}`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini resume analysis failed:", error);

    if (error?.status === 401 || error?.message?.includes("UNAUTHENTICATED")) {
      throw new ApiError(
        500,
        "Gemini API key is invalid. Please configure GEMINI_API_KEY with a valid Google AI Studio API key."
      );
    }

    throw new ApiError(502, "AI resume analysis failed. Please try again.");
  }
};
